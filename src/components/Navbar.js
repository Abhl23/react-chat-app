import { signOut } from "firebase/auth";
import { useToasts } from "react-toast-notifications";

import { auth } from "../firebase";
import { useAuth } from "../hooks";
import styles from "../styles/home.module.scss";

const Navbar = () => {
  const { user } = useAuth();

  const { addToast } = useToasts();

  return (
    <div className={styles.navbar}>
      <img src={user.photoURL} alt="dp" />
      <div className={styles.user}>
        <span>{user.displayName}</span>
        <button
          onClick={() => {
            // firebase/auth function to sign out the user
            signOut(auth);
            addToast("Signed out successfully!", {
              appearance: "success",
            });
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
