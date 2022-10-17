import { useEffect, useRef } from "react";

import { useAuth, useChat } from "../hooks";
import styles from "../styles/chat.module.scss";

const Text = ({ message }) => {
  const { user } = useAuth();
  const { data } = useChat();

  // useRef hook to access the latest message in DOM 
  const ref = useRef();

  useEffect(() => {
    // scrolls down to the latest message
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`${styles.message} ${
        message.senderId === user.uid && styles.owner
      }`}
    >
      <div className={styles.userInfo}>
        <img
          src={
            message.senderId === user.uid ? user.photoURL : data.user.photoURL
          }
          alt="dp"
        />
      </div>
      <div className={styles.messageContent}>
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="attachment" />}
      </div>
    </div>
  );
};

export default Text;
