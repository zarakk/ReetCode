import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AllProblemsPage from "./AllProblemsPage";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { Alert } from "@mui/material";
import HintButton from "../components/HintButton";

const SingleProblemPage = () => {
  const isUserLoggedIn = true;
  const { problem_slug } = useParams();
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  // State for the code input field
  const [code, setCode] = useState("");
  const [problemDetails, setProblemDetails] = useState([]);
  const [showError, setShowError] = useState(false);
  const [option, setOption] = useState("Javascript");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    // Fetch the list of problems from the backend
    fetch("http://localhost:3001/questions", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setProblemDetails(data))
      .catch((error) => console.log(error));
  }, []);

  console.log(problemDetails[problem_slug - 1]);

  const handleChange = (event) => {
    setOption(event.target.value);
  };
  // Function to handle code submission
  async function submitCode(code, testCases, userId, option) {
    const response = await fetch("http://localhost:3001/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, testCases, userId, option }),
    });
    const result = await response.json();
    // Handle result
    setLoading(false);
    if (result.outcome === "AC") {
      setSnackbarMessage("Code submitted successfully!");
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage("An error occurred while submitting the code.");
      setSnackbarSeverity("error");
    }
    setOpen(true);

    console.log(result);
  }

  const handleSubmit = () => {
    if (isUserLoggedIn) {
      setShowError(false);
      setLoading(true);
      // Implement code submission logic here
      console.log("Submitted code:", code);
      // Example usage

      const testCases = [
        { input: "1 2", expectedOutput: "3" },
        { input: "2 3", expectedOutput: "5" },
      ];

      const userId = "user123";

      submitCode(code, testCases, userId, option);
    } else {
      setShowError(true);
    }
  };

  console.log(problemDetails[problem_slug - 1]);
  return (
    <Box sx={{ p: 2, mb: 2 }}>
      <Link to="/problems/all">
        <Button variant="outlined">Back</Button>
      </Link>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Box sx={{ flex: "1 1 auto" }}>
              <Typography variant="h4">
                {problemDetails[problem_slug - 1]?.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor:
                    problemDetails[problem_slug - 1]?.difficulty === "Easy"
                      ? "yellow"
                      : problemDetails[problem_slug - 1]?.difficulty ===
                        "Medium"
                      ? "orange"
                      : "red",
                  width: "25%",
                  borderRadius: 5,
                  justifyContent: "center",
                  display: "flex",
                  p: 1,
                  mt: 1,
                }}
              >
                Difficulty: {problemDetails[problem_slug - 1]?.difficulty}
              </Typography>
              <Typography variant="body1" sx={{ mt: 4 }}>
                {problemDetails[problem_slug - 1]?.description}
              </Typography>

              <List>
                {problemDetails[problem_slug - 1]?.testCases.map(
                  (testCase, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => setSelectedTestCase(index)}
                      sx={{
                        backgroundColor:
                          index === selectedTestCase
                            ? "#ffffff1a"
                            : "transparent",
                      }}
                    >
                      <ListItemText primary={`Test Case ${index + 1}`} />
                    </ListItem>
                  )
                )}
              </List>
              {selectedTestCase !== null && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2">
                    Test Case {selectedTestCase + 1} Input:{" "}
                    {
                      problemDetails[problem_slug - 1]?.testCases[
                        selectedTestCase
                      ].input
                    }
                  </Typography>
                  <Typography variant="body2">
                    Test Case {selectedTestCase + 1} Output:{" "}
                    {
                      problemDetails[problem_slug - 1]?.testCases[
                        selectedTestCase
                      ].output
                    }
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <FormControl sx={{ width: 150, mb: 2 }}>
              <InputLabel id="code-environment-select-label">
                Code Env
              </InputLabel>
              <Select
                labelId="code-environment-select-label"
                id="code-environment-select"
                value={option}
                label="Code Environment"
                onChange={handleChange}
              >
                <MenuItem value="Javascript">Javascript</MenuItem>
                <MenuItem value="C++">C++</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h5" gutterBottom>
              Code Submission
            </Typography>
            <TextField
              multiline
              fullWidth
              rows={10}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code here"
            />
            {/* <HintButton
              problemDescription={problemDetails[problem_slug - 1]?.description}
            /> */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
              {showError && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "red",
                    mt: 2,
                  }}
                >
                  <Typography variant="body2">
                    Please login before submitting
                  </Typography>
                </Box>
              )}
            </Box>

            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={() => setOpen(false)}
            >
              <Alert onClose={() => setOpen(false)} severity={snackbarSeverity}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SingleProblemPage;
