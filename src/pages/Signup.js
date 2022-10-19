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

  // state to store the user's profile picture
  const [avatar, setAvatar] = useState(null);

  const [signingUp, setSigningUp] = useState(false);

  const navigate = useNavigate();

  const { dispatch } = useChat();

  const { addToast } = useToasts();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSigningUp(true);

    // check for input fields
    if (!username.value || !email.value || !password.value) {
      setSigningUp(false);

      return addToast("Fields cannot be left empty!", {
        appearance: "error",
      });
    } else if (password.value.length < 6) {
      setSigningUp(false);

      return addToast("Password must be at least 6 characters!", {
        appearance: "error",
      });
    }

    try {
      // creates a new user in firebase
      const response = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );

      // Creates a reference and file name for the avatar
      const storageRef = await ref(storage, username.value);
      // uploads the avatar to cloud storage
      const uploadTask = uploadBytesResumable(storageRef, avatar);

      uploadTask.on(
        (error) => {
          setSigningUp(false);

          return addToast(error, {
            appearance: "error",
          });
        },
        () => {
          // gets the download URL of the uploaded avatar
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(response.user, {
              displayName: username.value,
              photoURL: downloadURL,
            });

            // creates a document in users collection
            await setDoc(doc(db, "users", response.user.uid), {
              uid: response.user.uid,
              displayName: username.value,
              email: email.value,
              photoURL: downloadURL,
            });

            // creates a document in userConversations collection
            await setDoc(doc(db, "userConversations", response.user.uid), {});

            navigate("/");
          });
        }
      );
    } catch (error) {
      setSigningUp(false);

      addToast(error, {
        appearance: "error",
      });
    }

    // dispatches an action to reset the global chat state
    dispatch({
      type: "RESET_USER",
    });

    setSigningUp(false);

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
          <button disabled={signingUp}>
            {signingUp ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
