import { signOut } from "firebase/auth";

import { auth } from "../firebase";
import { useAuth } from "../hooks";
import styles from "../styles/home.module.scss";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className={styles.navbar}>
      <img src={user.photoURL} alt="dp" />
      <div className={styles.user}>
        <span>{user.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
