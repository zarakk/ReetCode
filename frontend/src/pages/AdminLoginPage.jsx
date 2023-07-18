import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/contextAPI";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const { isLoggedIn, setIsLoggedIn, setUsername } = useContext(AuthContext);

  const navigate = useNavigate();

  // Login function
  const handleLogin = async (email, password) => {
    const response = await fetch("http://localhost:3001/admin/login", {
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
      //redirect to problems page
      setUsername(email);
      setIsLoggedIn(true);

      // Display a success message
      setSnackbarMessage("Logged in successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      // Handle the login error
      const errorData = await response.json();
      console.log("Login error:", errorData.error);

      // Display an error message
      setSnackbarMessage(errorData.error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (isLoggedIn) {
    navigate("/admin-dashboard");
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
