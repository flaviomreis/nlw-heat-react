import styles from './styles.module.scss';
import logoImage from '../../assets/logo.svg';
import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

type Message = {
  id: string;
  text: string;
  user: {
    name: string,
    avatar_url: string
  }
}

let messagesQueue:Message[] = [];

const socket = io('http://localhost:4000');
socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage);
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    api.get<Message[]>('messages/last3').then(response => {
      setMessages(response.data);
    });
  }, []);

  useEffect(() => {
  const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1],
        ].filter(Boolean));
      }
    }, 3000);
    messagesQueue.shift();
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImage} alt="NLW Heat" />
      <ul className={styles.messageList}>
        {messages.map(message => {
          return (
            <li key={message.id} className={styles.messageItem}>
            <p className={styles.messageContent}>
               {message.text}
            </p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name} />
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>  
          );
        })}
      </ul>
    </div>
  )
}