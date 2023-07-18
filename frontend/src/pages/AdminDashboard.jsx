import React, { useState } from "react";
import { Button, TextField, Snackbar, Box, Container } from "@mui/material";
import { Alert } from "@mui/material";

const AdminDashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("admin-token");
    console.log(token);
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          testCases: [
            {
              input,
              output,
            },
          ],
          expectedOutput: output,
        }),
      });
      if (response.ok) {
        setSnackbarMessage("Question added successfully!");
      } else {
        setSnackbarMessage("An error occurred while adding the question.");
      }
    } catch (error) {
      setSnackbarMessage("An error occurred while adding the question.");
    }
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            padding: 2,
          }}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Output"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            fullWidth
            required
          />
          <Button onClick={handleSubmit}>Add Question</Button>
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
        </Box>
      </Container>
    </>
  );
};

export default AdminDashboard;
