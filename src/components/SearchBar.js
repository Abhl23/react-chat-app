import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useAuth, useChat } from "../hooks";
import { db } from "../firebase";
import styles from "../styles/home.module.scss";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);

  const { user } = useAuth();
  const {dispatch}=useChat();

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", searchText)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setSearchedUser(doc.data());
      });
    }
  };

  const addUserToChat = async (userInfo) => {
    const combinedId =
      searchedUser.uid > user.uid
        ? searchedUser.uid + user.uid
        : user.uid + searchedUser.uid;

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
            uid: searchedUser.uid,
            displayName: searchedUser.displayName,
            photoURL: searchedUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userConversations", searchedUser.uid), {
            [combinedId + ".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });
      }
    } catch (error) {
      console.log("Error", error);
    }
    
    dispatch({
        type: "CHANGE_USER",
        payload: userInfo
    });

    setSearchedUser(null);
    setSearchText("");
  };

  return (
    <div className={styles.search}>
      <div className={styles.searchInput}>
        <input
          type="text"
          placeholder="Search User"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      {searchedUser && (
        <div className={styles.userChat} onClick={() => addUserToChat(searchedUser)}>
          <img src={searchedUser.photoURL} alt="dp" />
          <div className={styles.userChatInfo}>
            <span>{searchedUser.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
