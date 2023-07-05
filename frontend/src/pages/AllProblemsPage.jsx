import React, { useEffect } from "react";
import { useState } from "react";
import SingleProblemPage from "./SingleProblemPage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const AllProblemsPage = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    // Fetch the list of problems from the backend
    fetch("http://localhost:3001/questions", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setProblems(data))
      .catch((error) => console.log(error));
  }, []);

  console.log(problems);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Difficulty</TableCell>
          <TableCell>Acceptance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {/* Render all problems */}
        {problems?.map((problem, index) => (
          <SingleProblemPage problem={problem} key={index} />
        ))}
      </TableBody>
    </Table>
  );
};

export default AllProblemsPage;
