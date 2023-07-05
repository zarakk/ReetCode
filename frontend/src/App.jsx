import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AllProblemsPage from "./pages/AllProblemsPage";
import ProblemsDetailsPage from "./pages/ProblemsDetailPage";
import SignupPage from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import AdminLoginPage from "./pages/AdminLoginPage";

function App() {
  /* Add routing here, routes look like -
       /login - Login page
       /signup - Signup page
       /problemset/all/ - All problems (see problems array above)
       /problems/:problem_slug - A single problem page
     */

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<SignupPage />} />
        <Route exact path="/problems/all" element={<AllProblemsPage />} />
        <Route
          path="/problems/:problem_slug"
          element={<ProblemsDetailsPage />}
        />
        <Route path="/admin" element={<AdminLoginPage />} />
      </Routes>
    </Router>
  );
}

// A demo component
function ProblemStatement(props) {
  const title = props.title;
  const acceptance = props.acceptance;
  const difficulty = props.difficulty;

  return (
    <tr>
      <td>{title}</td>
      <td>{acceptance}</td>
      <td>{difficulty}</td>
    </tr>
  );
}
export default App;
