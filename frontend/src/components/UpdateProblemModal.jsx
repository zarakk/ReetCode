import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

const UpdateProblemModal = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [acceptance, setAcceptance] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };
  const handleAcceptanceChange = (event) => {
    setAcceptance(event.target.value);
  };
  const handleConfirmClick = async () => {
    try {
      // Send a request to the backend to update the problem
      // Replace this with your own API call
      const response = await fetch(
        `http://localhost:3001/api/problems/${props.problem?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: props.problem.id,
            title,
            description,
            acceptance,
            difficulty,
          }),
        }
      );
      const data = await response.json();
      props.setProblems(data.QUESTIONS);
      // Close the modal
      props.onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEntered = () => {
    setTitle(props.problem?.title);
    setDescription(props.problem?.description);
    setDifficulty(props.problem?.difficulty);
    setAcceptance(props.problem?.acceptance);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      TransitionProps={{ onEntered: handleEntered }}
    >
      <DialogTitle>Update Problem</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          value={title}
          onChange={handleTitleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={handleDescriptionChange}
          fullWidth
          margin="normal"
          multiline
        />
        <TextField
          label="Difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Acceptance"
          value={acceptance}
          onChange={handleAcceptanceChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={handleConfirmClick}>Confirm Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProblemModal;
