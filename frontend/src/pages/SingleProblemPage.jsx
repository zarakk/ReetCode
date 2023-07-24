import { Button, TableCell, TableRow } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const SingleProblemPage = (props) => {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/problems/${props.problem?.id}`);
  };

  const handleUpdateClick = () => {
    props.onOpen(props.problem);
  };

  const handleDeleteClick = () => {
    // Send a request to the backend to delete the problem
    // Replace this with your own API call
    fetch(`http://localhost:3001/api/problems/${props.problem?.id}`, {
      method: "DELETE",
    }).then(() => {
      // Remove the problem from the list
      props.onDelete(props.problem?.id);
    });
  };

  return (
    <TableRow hover={true} sx={{ cursor: "pointer" }}>
      <TableCell
        onClick={handleRowClick}
        sx={{
          transition: "color 0.5s",
          "&:hover": {
            color: "blue",
          },
        }}
      >
        {props.problem?.title}
      </TableCell>
      <TableCell
        sx={{
          color:
            props.problem?.difficulty === "Easy"
              ? "yellow"
              : props.problem?.difficulty === "Medium"
              ? "orange"
              : "red",
        }}
      >
        {props.problem?.difficulty}
      </TableCell>
      <TableCell>{props.problem?.acceptance}</TableCell>
      {props.isAdmin ? (
        <>
          <TableCell>
            {" "}
            <Button
              variant="filled"
              sx={{ backgroundColor: "green", zIndex: 999 }}
              onClick={handleUpdateClick}
            >
              Update
            </Button>
          </TableCell>
          <TableCell>
            {" "}
            <Button
              variant="filled"
              sx={{ backgroundColor: "red" }}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </TableCell>{" "}
        </>
      ) : (
        <></>
      )}
    </TableRow>
  );
};

export default SingleProblemPage;
