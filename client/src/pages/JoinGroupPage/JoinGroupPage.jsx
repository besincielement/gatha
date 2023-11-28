import styles from "./JoinGroupPage.module.css";
import HelmetMetaTagsNetlify from "../../components/common/HelmetMetaTagsNetlify/HelmetMetaTagsNetlify";
import PiratePxPageRender from "../../components/common/PiratePxPageRender/PiratePxPageRender";
import SearchGroupAndJoin from "../../components/features/SearchGroupAndJoin/SearchGroupAndJoin";

const JoinGroupPage = () => {
  return (
    <main className={styles.container}>
      {/* Track page renders */}
      <PiratePxPageRender COUNT_IDENTIFIER={"join-group"} />
      {/* Set page title and meta tags */}
      <HelmetMetaTagsNetlify title='gatha - join group' />
      <h1>Join a group</h1>
      <p className={styles.explanation}>
        If you've been shared a code to join a group, simply enter it here:
      </p>
      <SearchGroupAndJoin />
    </main>
  );
};

export default JoinGroupPage;
