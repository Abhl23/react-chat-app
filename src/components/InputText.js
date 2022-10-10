import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import { db, storage } from "../firebase";
import { useAuth, useChat } from "../hooks";
import styles from "../styles/chat.module.scss";

const InputText = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const { user } = useAuth();
  const { data } = useChat();

  const handleSend = async () => {
    if(!text && !image){
      return;
    }

    if (image) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        (error) => {
          console.log("Error", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("URL", downloadURL);
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: text,
                img: downloadURL,
                senderId: user.uid,
                date: Timestamp.now(),
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text,
          senderId: user.uid,
          date: Timestamp.now(),
        }),
      });
    }

    if (text) {
      await updateDoc(doc(db, "userConversations", user.uid), {
        [data.chatId + ".lastMessage"]: text,
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userConversations", data.user.uid), {
        [data.chatId + ".lastMessage"]: text,
        [data.chatId + ".date"]: serverTimestamp(),
      });
    }

    setText("");
    setImage(null);
  };

  return (
    <div className={styles.inputText}>
      <input
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className={styles.send}>
        <input
          style={{ display: "none" }}
          type="file"
          id="attach"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="attach">
          <img
            src="https://cdn-icons-png.flaticon.com/128/4131/4131729.png"
            alt="attach"
          />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default InputText;
