import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import userAPI from "../../../api/userAPI";
import styles from "./UserRegistrationForm.module.css";

/**
 * UserRegistrationForm Component
 *
 * Registration form, allowing users to input their information
 * and register.
 */
const UserRegistrationForm = () => {
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [error, setError] = useState(null);

  // Autofocus first input field on mount
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Form submission handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    // Check if password matches with confirm password
    const confirmedPassword = formData.get("confirm-password");
    if (data.password !== confirmedPassword) {
      setPasswordMismatch(true);
      return;
    } else {
      setPasswordMismatch(false);
    }

    try {
      //Pass the data object to registerUser
      await userAPI.post("/users/register", data);
      // Navigate to the login page on successful registration
      navigate("/user-login");
    } catch (error) {
      // Handle errors from the server
      if (error.response && error.response.data && error.response.data.errors) {
        // Validation errors from server
        const serverErrors = error.response.data.errors;

        // Render the first error message
        setError(serverErrors[0].msg);
      } else {
        // Handle other types of errors
        console.error("Error creating user:", error);
        setError("Error creating user. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className={styles.input}>
        <label className={styles.label}>
          First Name:
          <input
            type="text"
            name="firstName"
            ref={inputRef} // Ref for autofocus
            required
          />
        </label>
      </div>

      <div className={styles.input}>
        <label className={styles.label}>
          Last Name:
          <input type="text" name="lastName" required />
        </label>
      </div>

      <div className={styles.input}>
        <label className={styles.label}>
          Username:
          <input type="text" name="username" required />
        </label>
      </div>

      <div className={styles.input}>
        <label className={styles.label}>
          Email:
          <input type="email" name="email" required />
        </label>
      </div>

      <div className={styles.input}>
        <label className={styles.label}>
          Password:
          <input type="password" name="password" required />
        </label>
      </div>

      <div className={styles.input}>
        <label className={styles.label}>
          Confirm Password:
          <input type="password" name="confirm-password" required />
        </label>
      </div>
      {/* If the password doesn't match throw an error */}
      {passwordMismatch && (
        <p className={styles.errorMessage}>Passwords do not match.</p>
      )}

      {/* Conditionally render error message */}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {/* Submit button */}
      <button type="submit">Register</button>
    </form>
  );
};

export default UserRegistrationForm;
