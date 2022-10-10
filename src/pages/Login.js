import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "../firebase";
import { useChat, useFormInput } from "../hooks";
import styles from "../styles/signup.module.scss";

const Login = () => {
  const email = useFormInput("");
  const password = useFormInput("");

  const navigate = useNavigate();
  const { dispatch } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);

      navigate("/");
    } catch (error) {
      console.log("Error", error);
    }

    dispatch({
      type: "RESET_USER",
    });
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <span className={styles.logo}>React Chat</span>
        <span className={styles.heading}>Sign In</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" {...email} />
          <input type="password" placeholder="password" {...password} />
          <button style={{ marginTop: 10 }}>Sign In</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
