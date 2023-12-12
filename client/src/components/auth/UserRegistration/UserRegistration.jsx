import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../../api/userAPI";
import {
  handleOtherErrors,
  handleServerErrors,
} from "../../../utils/errorUtils";
import usePasswordVisibility from "../../../hooks/usePasswordVisibility";
import ErrorDisplay from "../../common/ErrorDisplay/ErrorDisplay";
import styles from "./UserRegistration.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * UserRegistrationForm Component
 *
 * Registration form, allowing users to input their information
 * and register.
 */
const UserRegistration = () => {
  // Navigation hook for redirecting
  const navigate = useNavigate();
  // Ref for autofocus
  const inputRef = useRef(null);
  // States for password mismatch and errors
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [error, setError] = useState(null);

  // Use custom hook for managing password visibility
  const { passwordVisible, togglePasswordVisibility } = usePasswordVisibility();

  // Autofocus first input field on mount
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Form submission handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Extract form data
    const formData = new FormData(e.target);

    // Create data object with user information
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    // Check if both entered passwords match
    const confirmedPassword = formData.get("confirm-password");
    if (data.password !== confirmedPassword) {
      setPasswordMismatch(true);
      return;
    } else {
      setPasswordMismatch(false);
    }

    try {
      // Attempt to register the user with the provided data
      await userAPI.post("/users/register", data);
      // Navigate to the login page on successful registration
      navigate("/user-login");
    } catch (error) {
      handleOtherErrors(error, setError, "Error creating user.", "create-user");
      handleServerErrors(error, setError);
    }
  };

  return (
    <form className={styles.registrationForm} onSubmit={handleFormSubmit}>
      {/* Input fields for user information */}
      <div>
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          ref={inputRef} // Ref for autofocus
          required
        />
      </div>

      <div>
        <input type="text" name="lastName" placeholder="Last name" required />
      </div>

      <div>
        <input
          type="text"
          name="username"
          placeholder="Username"
          autoComplete="nope"
          required
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          required
        />
      </div>
      {/* Password input with eye icon */}
      <div className={styles.passwordContainer}>
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Password"
          name="password"
          required
        />
        <span
          className={styles.togglePasswordIcon}
          onClick={togglePasswordVisibility}
        >
          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {/* Password input with eye icon */}
      <div className={styles.passwordContainer}>
        <input
          type={passwordVisible ? "text" : "password"}
          name="confirm-password"
          placeholder="Confirm password"
          required
        />
        <span
          className={styles.togglePasswordIcon}
          onClick={togglePasswordVisibility}
        >
          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      {/* Display an error message if the passwords do not match */}
      {passwordMismatch && (
        <p className={styles.errorMessage}>Entered passwords do not match.</p>
      )}

      {/* Conditionally render error message received from the server */}
      <ErrorDisplay error={error} />
      {/* Submit button for form submission */}
      <button type="submit">Register</button>
    </form>
  );
};

export default UserRegistration;
