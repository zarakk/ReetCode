import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Avatar } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/contextAPI";
import AccountCircle from "@mui/icons-material/AccountCircle";

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
  const { isLoggedIn, username, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const authLink = getAuthLink(currentPage.pathname, isLoggedIn);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ReetCode
        </Typography>

        <Button color="inherit" sx={{ mr: 2 }}>
          <Link
            to={"/problems/all"}
            style={{ color: "white", textDecoration: "none" }}
          >
            Problems
          </Link>
        </Button>
        {isLoggedIn && (
          <>
            <Avatar>
              <AccountCircle />
              {username}
            </Avatar>
            <Typography variant="h6" component="div" sx={{ marginLeft: 1 }}>
              {username}
            </Typography>
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
