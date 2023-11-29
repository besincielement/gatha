import React from "react";
import styles from "./GroupSettingBar.module.css";

/**
 * Bar to host selected group related information and functionalities
 * @param {Object} props - The component props.
 * @param {Object} props.selectedGroup - The currently selected group by the user.
 * @returns {JSX.Element} - The rendered component.
 */
function GroupSettingBar({ selectedGroup }) {
  return (
    <div className={styles.barContainer}>
      {/* Render group name */}
      <h2>{selectedGroup.name}</h2>
    </div>
  );
}

export default GroupSettingBar;
