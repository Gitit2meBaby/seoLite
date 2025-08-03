// assets/js/components/common/LoadingSpinner.jsx
import styles from "@css/components/common/LoadingSpinner.module.scss";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}>
        <div className={styles.spinnerRing}></div>
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
