import { useEffect, useState } from "react";
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
import { useToasts } from "react-toast-notifications";

import { useAuth, useChat } from "../hooks";
import { db } from "../firebase";
import styles from "../styles/home.module.scss";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  // state to store the searched user
  const [searchedUser, setSearchedUser] = useState(null);

  const { user } = useAuth();
  const { dispatch } = useChat();

  const { addToast } = useToasts();

  useEffect(() => {
    if (searchText === "") {
      setSearchedUser(null);
    }
  }, [searchText]);

  // handles the search functionality when pressed 'Enter'
  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      // creates a query to get the searched user from the 'users' collection
      const q = query(
        collection(db, "users"),
        where("displayName", "==", searchText)
      );

      // gets multiple documents which satisfy the query
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setSearchedUser(doc.data());
      });
    }
  };

  // handles adding the user to conversations list and opening of the chat
  const addUserToChat = async () => {
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
      return addToast(error, {
        appearance: "error",
      });
    }

    // changes the global chat state with new user info
    dispatch({
      type: "CHANGE_USER",
      payload: searchedUser,
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
        <div
          className={styles.userChat}
          onClick={() => addUserToChat()}
        >
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
