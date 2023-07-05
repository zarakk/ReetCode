import { TableCell, TableRow } from "@mui/material";

import React from "react";
import { useNavigate } from "react-router-dom";

const SingleProblemPage = (props) => {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/problems/${props.problem?.id}`);
  };

  return (
    <TableRow onClick={handleRowClick} hover={true} sx={{ cursor: "pointer" }}>
      <TableCell
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
    </TableRow>
  );
};

export default SingleProblemPage;
