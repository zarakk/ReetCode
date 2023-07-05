import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const currentPage = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ReetCode
        </Typography>

        <Button color="inherit">
          <Link
            to={currentPage.pathname === "/login" ? "/" : "/login"}
            style={{ color: "white", textDecoration: "none" }}
          >
            {currentPage.pathname === "/" ? "Signup" : "Login"}
          </Link>
        </Button>

        <Button color="inherit">
          <Link
            to={"/problems/all"}
            style={{ color: "white", textDecoration: "none" }}
          >
            Problems
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
