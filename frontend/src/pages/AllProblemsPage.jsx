import React, { useEffect } from "react";
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
import UpdateProblemModal from "./UpdateProblemModal";

const AllProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAdmin] = useState(true);
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

  const handleUpdateClick = (problem) => {
    setProblemToUpdate(problem);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Acceptance</TableCell>
            {isAdmin ? (
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
                isAdmin={isAdmin}
                setProblemToUpdate={setProblemToUpdate}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
              />
            ))}
        </TableBody>
        <UpdateProblemModal
          open={isUpdateModalOpen}
          onClose={handleUpdateModalClose}
          problem={problemToUpdate}
        />
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
