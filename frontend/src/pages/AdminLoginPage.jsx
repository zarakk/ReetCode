import React, { useState } from "react";
import AllProblemsPage from "./AllProblemsPage";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLoggedIn = false;

  // Login function
  const handleLogin = async (email, password) => {
    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      // Save the token in local storage or session storage
      localStorage.setItem("token", token);
    } else {
      // Handle the login error
      const errorData = await response.json();
      console.log("Login error:", errorData.error);
    }
  };

  if (isLoggedIn) {
    return <Redirect to={AllProblemsPage} />;
  }
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" color={"text.primary"}>
          Admin Login Page
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() => handleLogin(email, password)}
                fullWidth
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminLoginPage;
