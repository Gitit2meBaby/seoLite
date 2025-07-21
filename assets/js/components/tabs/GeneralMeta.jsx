import styles from "@css/components/tabs/GeneralMeta.module.scss";

const GeneralMeta = ({ tabId, config }) => {
  return (
    <div className={styles.generalMeta}>
      <h3>General Meta Settings</h3>
      <p>This will contain:</p>
      <ul>
        <li>Page titles</li>
        <li>Meta descriptions</li>
        <li>Meta keywords</li>
        <li>Robots settings</li>
      </ul>
      <p>
        <em>Component will be implemented in the next phase.</em>
      </p>
    </div>
  );
};

export default GeneralMeta;
