import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "../firebase";
import { useChat } from "../hooks";
import styles from "../styles/chat.module.scss";
import Text from "./Text";

const Texts = () => {
  const [messages, setMessages] = useState([]);

  const { data } = useChat();

  useEffect(() => {
    const getMessages = () => {
        // listens to any changes in 'chats' collection
        const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
          });
      
          return () => {
            unsub();
          };
    };

    data.chatId && getMessages();
  }, [data.chatId]);

  return (
    <div className={styles.messages}>
      {messages.map((message) => (
        <Text message={message} key={message.id} />
      ))}
    </div>
  );
};

export default Texts;
