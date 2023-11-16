import React from "react";
import styles from "./UsernameInitials.module.css";

/**
 * Component for displaying capital user initials in a circle.
 * @param {string} props.firstName
 * @param {string} props.lastName
 * @component
 */
const UsernameInitials = ({ firstName, lastName }) => {
  // Extract the first letter of each name
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";

  return (
    <div className={styles.initialsContainer}>
      {/* Display the initials inside a circle */}
      <div className={styles.circle}>
        <p className={styles.initials}>{firstInitial + lastInitial}</p>
      </div>
    </div>
  );
};

export default UsernameInitials;