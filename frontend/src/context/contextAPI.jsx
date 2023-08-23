import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isRole, setIsRole] = useState("");

  // Check for the presence of the authentication token when the component is mounted
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      ``;
      // Fetch the user's information from the /user/me endpoint
      fetch("http://localhost:3001/user/me", {
        method: "GET",
        headers: {
          // Set the authorization header with the token
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Set the username state with the data from the response
          setUsername(data.username);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        username,
        setUsername,
        isRole,
        setIsRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
