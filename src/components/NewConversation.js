import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";

import { db } from "../firebase";
import { useAuth, useChat } from "../hooks";
import styles from "../styles/home.module.scss";

const NewConversation = () => {
  // boolean state maintained to show or hide the pop-up
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);

  const { user } = useAuth();
  const { dispatch } = useChat();

  const { addToast } = useToasts();

  useEffect(() => {
    // listens to the 'users' collection
    const unsub = onSnapshot(collection(db, "users"), (querySnapshot) => {
      const filteredUsers = [];

      // gets all the users except the signed in user
      querySnapshot.forEach((doc) => {
        if (doc.data().uid !== user.uid) {
          filteredUsers.push(doc.data());
        }
      });

      setUsers(filteredUsers);
    });

    return () => {
      unsub();
    };
  }, [user.uid]);

  // handles starting of chat with the selected user
  const startChatWithUser = async (userInfo) => {
    const combinedId =
      userInfo.uid > user.uid
        ? userInfo.uid + user.uid
        : user.uid + userInfo.uid;

    // check whether the chat already exists in chats collection or not
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });

        // add user in userConversations
        await updateDoc(doc(db, "userConversations", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: userInfo.uid,
            displayName: userInfo.displayName,
            photoURL: userInfo.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userConversations", userInfo.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      return addToast(error, {
        appearance: "error",
      });
    }

    // changes the user info in global chat state
    dispatch({
      type: "CHANGE_USER",
      payload: userInfo,
    });

    setVisible(false);
  };

  return (
    <>
      <div
        className={styles.newConvoContainer}
        onClick={() => setVisible(true)}
      >
        <span className={styles.newConvo}>New Conversation</span>
        <img
          src="https://cdn-icons-png.flaticon.com/128/4315/4315609.png"
          alt="add"
        />
      </div>
      {visible && (
        <div className={styles.overlay} onClick={() => setVisible(false)}>
          <div className={styles.modal}>
            <div className={styles.heading}>Start Conversation</div>
            <div className={styles.usersList}>
              {users.map((user) => (
                <div onClick={() => startChatWithUser(user)}>
                  <img src={user.photoURL} alt="dp" />
                  <span>{user.displayName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewConversation;
