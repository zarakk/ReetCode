import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Avatar } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/contextAPI";

const getAuthLink = (currentPage, isLoggedIn) => {
  if (isLoggedIn) {
    return { text: "Logout", link: "/" };
  } else if (currentPage === "/") {
    return { text: "Login", link: "/login" };
  } else {
    return { text: "Signup", link: "/" };
  }
};

const Navbar = () => {
  const currentPage = useLocation();
  const { isLoggedIn, username, setIsLoggedIn, isRole, setIsRole } =
    useContext(AuthContext);
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("admin-token");
  if (token) {
    setIsRole("user");
  }
  if (adminToken) {
    setIsRole("admin");
  }

  const navigate = useNavigate();
  const authLink = getAuthLink(currentPage.pathname, isLoggedIn);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin-token");
    setIsRole("");
    setIsLoggedIn(false);
    navigate("/login");
  };

  console.log(isLoggedIn);
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ReetCode
        </Typography>

        {isRole === "admin" && (
          <>
            <Button color="inherit" sx={{ mr: 2 }}>
              <Link
                to="/admin-dashboard"
                style={{ color: "white", textDecoration: "none" }}
              >
                Admin Dashboard
              </Link>
            </Button>
            <Button color="inherit" sx={{ mr: 2 }}>
              <Link
                to="/problems/all"
                style={{ color: "white", textDecoration: "none" }}
              >
                Problems
              </Link>
            </Button>
          </>
        )}

        {isRole === "user" && (
          <>
            <Button color="inherit" sx={{ mr: 2 }}>
              <Link
                to="/problems/all"
                style={{ color: "white", textDecoration: "none" }}
              >
                Problems
              </Link>
            </Button>
          </>
        )}

        <Button color="inherit">
          <Link
            onClick={handleLogout}
            to={authLink.link}
            style={{ color: "white", textDecoration: "none" }}
          >
            {authLink.text}
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
