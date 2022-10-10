import Chat from "../components/Chat";
import Leftbar from "../components/Leftbar";
import styles from "../styles/home.module.scss";

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <Leftbar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
