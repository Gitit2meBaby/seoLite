// assets/js/components/tabs/SocialMedia.jsx
import styles from "@css/components/tabs/SocialMedia.module.scss";

const SocialMedia = ({ tabId, config }) => {
  return (
    <div className={styles.socialMedia}>
      <h3>Social Media Settings</h3>
      <p>This will contain:</p>
      <ul>
        <li>Open Graph tags</li>
        <li>Twitter Card settings</li>
        <li>Social media images</li>
      </ul>
      <p>
        <em>Component will be implemented in the next phase.</em>
      </p>
    </div>
  );
};

export default SocialMedia;
