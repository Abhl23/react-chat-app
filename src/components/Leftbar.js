import styles from "../styles/home.module.scss";
import Conversations from "./Conversations";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";

const Leftbar = () => {
  return (
    <div className={styles.leftbar}>
      <Navbar />
      <SearchBar />
      <Conversations />
    </div>
  );
};

export default Leftbar;
