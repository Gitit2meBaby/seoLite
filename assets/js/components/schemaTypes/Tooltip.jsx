// components/schemaTypes/Tooltip.jsx
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/**
 * Tooltip component with portal rendering to avoid overflow issues
 * @param {string} text - The tooltip text to display
 * @param {string} content - Alternative prop name (for backwards compatibility)
 */
const Tooltip = ({ text, content }) => {
  const tooltipText = text || content;
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState("top"); // 'top', 'bottom', 'left', 'right'
  const triggerRef = useRef(null);

  if (!tooltipText) return null;

  useEffect(() => {
    if (!isVisible || !triggerRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const tooltipWidth = 300; // Approximate max-width
      const tooltipHeight = 100; // Approximate height
      const gap = 12; // Gap between trigger and tooltip
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newPlacement = "top";
      let top = 0;
      let left = 0;

      // Calculate space available in each direction
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = viewportWidth - rect.right;

      // Determine best placement based on available space
      if (spaceAbove >= tooltipHeight + gap) {
        // Top placement (preferred)
        newPlacement = "top";
        top = rect.top + window.scrollY - gap;
        left = rect.left + window.scrollX + rect.width / 2;
      } else if (spaceBelow >= tooltipHeight + gap) {
        // Bottom placement
        newPlacement = "bottom";
        top = rect.bottom + window.scrollY + gap;
        left = rect.left + window.scrollX + rect.width / 2;
      } else if (spaceRight >= tooltipWidth + gap) {
        // Right placement
        newPlacement = "right";
        top = rect.top + window.scrollY + rect.height / 2;
        left = rect.right + window.scrollX + gap;
      } else if (spaceLeft >= tooltipWidth + gap) {
        // Left placement
        newPlacement = "left";
        top = rect.top + window.scrollY + rect.height / 2;
        left = rect.left + window.scrollX - gap;
      } else {
        // Fallback to top with boundary adjustment
        newPlacement = "top";
        top = rect.top + window.scrollY - gap;
        left = rect.left + window.scrollX + rect.width / 2;
      }

      setPosition({ top, left });
      setPlacement(newPlacement);
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isVisible]);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  return (
    <>
      <span
        ref={triggerRef}
        className={styles.tooltipWrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={styles.tooltipTrigger} />
      </span>
      {isVisible &&
        createPortal(
          <div
            className={`${styles.tooltip} ${styles[`tooltip--${placement}`]}`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {tooltipText}
          </div>,
          document.body,
        )}
    </>
  );
};

export default Tooltip;
