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
  const [acceptance, setAcceptance] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAcceptanceChange = (event) => {
    setAcceptance(event.target.value);
  };

  const handleConfirmClick = () => {
    // Send a request to the backend to update the problem
    // Replace this with your own API call
    fetch(`http://localhost:3001/api/problems/${props.problem?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.problem.id,
        title,
        description,
        acceptance,
      }),
    }).then(() => {
      // Close the modal
      props.onClose();
    });
  };

  const handleEntered = () => {
    setTitle(props.problem?.title);
    setDescription(props.problem?.description);
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
          label="Acceptance"
          value={acceptance}
          onChange={handleAcceptanceChange}
          fullWidth
          multiline={true}
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
