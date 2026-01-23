// assets/js/components/common/ReviewPublishButton.jsx
import { useState } from "react";
import styles from "@css/components/tabs/SocialMedia.module.scss";

const ReviewPublishButton = ({
  onSave,
  hasChanges,
  isSaving,
  onNavigate,
  disabled,
}) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async () => {
    setIsNavigating(true);

    try {
      // If there are unsaved changes, save them first
      if (hasChanges && onSave) {
        await onSave();
        // Wait a bit for the save to fully complete and database to update
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Navigate to Review & Publish tab
      if (onNavigate) {
        onNavigate("publish");
      } else {
        // Fallback: use hash navigation
        window.location.hash = "publish";
      }
    } catch (error) {
      console.error("Failed to save before navigation:", error);
      // Navigate anyway
      if (onNavigate) {
        onNavigate("publish");
      } else {
        window.location.hash = "publish";
      }
    } finally {
      setIsNavigating(false);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      className={styles.saveButton}
      onClick={handleClick}
      disabled={isSaving || isNavigating || disabled}
      style={{
        marginLeft: "1rem",
        background: hasChanges ? "#ffc107" : "#2196f3",
        color: hasChanges ? "#000" : "#fff",
      }}
      onNavigate={onNavigate}
    >
      {isNavigating
        ? "⏳ Navigating..."
        : hasChanges
          ? "💾 Save & Review"
          : "📋 Review & Publish"}
    </button>
  );
};

export default ReviewPublishButton;
