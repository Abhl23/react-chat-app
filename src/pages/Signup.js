import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import { auth, storage, db } from "../firebase";
import { useChat, useFormInput } from "../hooks";
import styles from "../styles/signup.module.scss";

const Signup = () => {
  const username = useFormInput("");
  const email = useFormInput("");
  const password = useFormInput("");

  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();

  const { dispatch } = useChat();

  const { addToast } = useToasts();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(username.value, email.value, password.value, avatar);

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );

      const storageRef = await ref(storage, username.value);

      const uploadTask = uploadBytesResumable(storageRef, avatar);

      uploadTask.on(
        (error) => {
          return addToast(error, {
            appearance: "error",
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(response.user, {
              displayName: username.value,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName: username.value,
              email: email.value,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userConversations", response.user.uid), {});

            navigate("/");
          });
        }
      );
    } catch (error) {
      addToast(error, {
        appearance: "error",
      });
    }

    dispatch({
      type: "RESET_USER",
    });

    addToast("Signed up successfully!", {
      appearance: "success",
    });
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <span className={styles.logo}>React Chat</span>
        <span className={styles.heading}>Sign Up</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" {...username} />
          <input type="email" placeholder="email" {...email} />
          <input type="password" placeholder="password" {...password} />
          <input
            style={{ display: "none" }}
            type="file"
            id="avatar"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
          <label htmlFor="avatar">
            <img
              src="https://cdn-icons-png.flaticon.com/128/5460/5460486.png"
              alt="add-avatar"
            />
            <span>Add an avatar</span>
          </label>
          <button>Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
