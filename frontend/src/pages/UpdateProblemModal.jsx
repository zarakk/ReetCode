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
  const [title, setTitle] = useState(props.problem?.title);
  const [description, setDescription] = useState(props.problem?.description);
  const [acceptance, setAcceptance] = useState(props.problem?.acceptance);

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
    fetch(`/api/problems/${props.problem?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        acceptance,
      }),
    }).then(() => {
      // Close the modal
      props.onClose();
    });
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
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
