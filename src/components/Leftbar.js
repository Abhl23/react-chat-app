import styles from "../styles/home.module.scss";
import Conversations from "./Conversations";
import NewConversation from "./NewConversation";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";

const Leftbar = () => {
  return (
    <div className={styles.leftbar}>
      <Navbar />
      <SearchBar />
      <NewConversation />
      <Conversations />
    </div>
  );
};

export default Leftbar;
