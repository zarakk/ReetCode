import React, { useContext, useEffect } from "react";
import { useState } from "react";
import SingleProblemPage from "./SingleProblemPage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import UpdateProblemModal from "../components/UpdateProblemModal";
import { AuthContext } from "../context/contextAPI";

const AllProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { isRole } = useContext(AuthContext);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [problemToUpdate, setProblemToUpdate] = useState(null);
  useEffect(() => {
    // Fetch the list of problems from the backend
    fetch("http://localhost:3001/questions", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setProblems(data))
      .catch((error) => console.log(error));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
  };

  const handleUpdateModalOpen = (problem) => {
    setProblemToUpdate(problem);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (problemId) => {
    // Remove the problem with the given ID from the list
    setProblems((prevProblems) =>
      prevProblems.filter((problem) => problem.id !== problemId)
    );
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Acceptance</TableCell>
            {isRole === "admin" ? (
              <>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </>
            ) : (
              <></>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render all problems */}
          {problems
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((problem, index) => (
              <SingleProblemPage
                problem={problem}
                key={index}
                setProblemToUpdate={setProblemToUpdate}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                onOpen={handleUpdateModalOpen}
                onDelete={handleDelete}
              />
            ))}
        </TableBody>
        {problemToUpdate && (
          <UpdateProblemModal
            open={isUpdateModalOpen}
            onClose={handleUpdateModalClose}
            onOpen={handleUpdateModalOpen}
            problem={problemToUpdate}
            setProblems={setProblems}
          />
        )}
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={problems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default AllProblemsPage;
