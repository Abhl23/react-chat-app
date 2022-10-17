import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth, useChat } from "../hooks";
import styles from "../styles/home.module.scss";

const Conversations = () => {
  const [chats, setChats] = useState({});

  const { user } = useAuth();
  const { dispatch } = useChat();

  // fetches all the conversations of the current user
  useEffect(() => {
    // listens to current user's document on 'userConversations' collection
    const unsub = onSnapshot(doc(db, "userConversations", user.uid), (doc) => {
      setChats(doc.data());
    });

    return () => {
      unsub();
    };
  }, [user.uid]);

  // opens the chat of the selected user
  const handleOpenChat = (userInfo) => {
    dispatch({
      type: "CHANGE_USER",
      payload: userInfo,
    });
  };

  return (
    <div className={styles.conversations}>
      {Object.entries(chats)                    // returns the object's every key-value pair as an array
        .sort((a, b) => b[1].date - a[1].date)      // sorts the array from latest to oldest
        .map((chat) => (
          <div
            className={styles.userChat}
            key={chat[0]}
            onClick={() => handleOpenChat(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className={styles.userChatInfo}>
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Conversations;
