import { useChat } from "../hooks";
import styles from "../styles/chat.module.scss";
import InputText from "./InputText";
import Texts from "./Texts";

const Chat = () => {
  const { data } = useChat();

  return (
    <div className={styles.chat}>
      <div className={styles.chatUser}>
        {data.user && (
          <>
            <img src={data.user.photoURL} alt="dp" />
            <span>{data.user.displayName}</span>
          </>
        )}
      </div>

      <Texts />
      <InputText />
    </div>
  );
};

export default Chat;
