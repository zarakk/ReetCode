import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AllProblemsPage from "./pages/AllProblemsPage";
import ProblemsDetailsPage from "./pages/ProblemsDetailPage";
import SignupPage from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminSignupPage from "./pages/AdminSignupPage";
import CreateQuestions from "./pages/CreateQuestions";

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
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />
        <Route path="/admin-dashboard" element={<CreateQuestions />} />
      </Routes>
    </Router>
  );
}

export default App;
