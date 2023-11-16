import { useState } from "react";
import PropTypes from "prop-types";
import userContext from "../context/userContext";
import userAPI from "../api/userAPI";

/**
 * UserProvider component that providing user authentication context.
 */
const UserProvider = ({ children }) => {
  // Retrieve user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // State variables for user authentication
  const [loggedIn, setLoggedIn] = useState(!!storedUser);
  const [user, setUser] = useState(storedUser);
  const [error, setError] = useState("");

  /**
   * Handles user login.
   * @param {Object} data - The user login data.
   * @returns {Promise<void>} - A promise that resolves after login.
   */
  const loginUser = async (data) => {
    try {
      setError(""); // Clears the error
      // Send login request to the server
      const response = await userAPI.post("/users/login", data);

      // Extract user data from response
      const userData = response.data.user;

      // Update state and localStorage on successful login
      setUser(userData);
      setLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log(user);
    } catch (err) {
      console.log("errors found");
      setLoggedIn(false);
      console.log(err.response.status);

      // Handle different error scenarios
      if (err.response && err.response.status === 401) {
        setError("Incorrect password.");
      } else if (err.response && err.response.status === 403) {
        setError("You don't have permission to log in.");
      } else if (err.response && err.response.status === 404) {
        setError("Email address not found. Please register an account.");
      } else {
        setError("An unknown error occurred. Please try again later.");
      }

      // Reject the promise with the error
      return Promise.reject(err);
    }
  };

  /**
   * Handles user logout.
   * @returns {Promise<void>} - A promise that resolves after logout.
   */
  const logoutUser = async () => {
    try {
      // Perform logout API call
      await userAPI.get("/users/logout");

      // Update state and remove user data from localStorage after logout
      setLoggedIn(false);
      localStorage.removeItem("user");
    } catch (err) {
      setError("An error occurred while logging out.");
      console.error(err.message);
    }
  };
  // Provide user context to component tree
  return (
    <userContext.Provider
      value={{ error, setError, loggedIn, loginUser, user, logoutUser }}>
      {children}
    </userContext.Provider>
  );
};

// Prop types validation
UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
export default UserProvider;