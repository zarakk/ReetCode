import React, { useState } from "react";
import { Button, TextField, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AdminDashboard = () => {
  const [question, setQuestion] = useState("");
  const [testCases, setTestCases] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          testCases,
          expectedOutput,
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
      <form onSubmit={handleSubmit}>
        <TextField
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Test Cases"
          value={testCases}
          onChange={(e) => setTestCases(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Expected Output"
          value={expectedOutput}
          onChange={(e) => setExpectedOutput(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit">Add Question</Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminDashboard;
