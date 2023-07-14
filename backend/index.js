const express = require("express");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const amqp = require("amqplib/callback_api");
const config = require("./config");
const secretKey = config.secret;

const { processSubmission } = require("./submissionProcessor");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const USERS = [];

const QUESTIONS = [
  {
    id: "1",
    title: "Two states",
    difficulty: "Medium",
    acceptance: "47%",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    id: "2",
    title: "Add Two Numbers",
    difficulty: "Medium",
    acceptance: "58%",
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. You may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    testCases: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
      },
    ],
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Hard",
    acceptance: "78%",
    description:
      "Given a string s, find the length of the longest substring without repeating characters. You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. You may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    testCases: [
      {
        input: "s = bbbbb",
        output: "1",
      },
    ],
  },
];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode the request body
  const { email, password } = req.body;

  // Check if the user with the given email already exists in the USERS array
  const userExists = USERS.some((user) => user.email === email);

  // If the user already exists
  if (userExists) {
    // Send an error response (Conflict)
    res.status(409).json({ error: "User already exists" });
  } else {
    // Store the email and password in the USERS array
    USERS.push({ email: email, password: password });

    // Send a success response
    res.status(200).send("User registered successfully");
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode the request body
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find((user) => user.email === email);

  // If the user exists and the password is correct
  if (user && user.password === password) {
    // Generate a token (any random string will do for now)
    // const token = "random-token";
    // Generate a token with the user's email as the payload
    const token = jwt.sign({ email: user.email }, secretKey);

    // Send a success response with the token
    res.status(200).json({ token: token });
  } else {
    // Send an error response (Unauthorized)
    res.status(401).json({ error: "Invalid email or password" });
  }
});

app.get("/questions", function (req, res) {
  // Return all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.post("/submissions", (req, res) => {
  const { code, testCases, userId, option } = req.body;

  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      const queue = "submissionQueue";

      channel.assertQueue(queue, {
        durable: false,
      });

      const submission = { code, testCases, userId, option };
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(submission)));

      console.log(" [x] Sent %s", JSON.stringify(submission));
    });
  });

  res.json({ status: "ok" });
});

processSubmission();

// app.post("/submissions", function (req, res) {
//   // Retrieve the submitted solution from the request body
//   const { problemId, solution } = req.body;

//   // Randomly determine whether to accept or reject the solution
//   const isAccepted = Math.random() < 0.5; // Adjust the probability as needed

//   // Create a submission object with the problem ID, solution, and acceptance status
//   const submission = {
//     problemId,
//     solution,
//     isAccepted,
//   };
app.post("/submissions", (req, res) => {
  const submissionCode = req.body.code;

  processProblemSubmission(submissionCode)
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      console.error("Error processing problem submission:", error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the submission." });
    });
});

//   // Store the submission in the SUBMISSIONS array
//   SUBMISSION.push(submission);

//   // Return the submission status as the response
//   res.json({ isAccepted });
// });

// leaving as hard todos
// Create a route that lets an admin add a new problem
// Middleware function to check for admin authentication
function isAdmin(req, res, next) {
  // Check if the user is authenticated as an admin (you can define your own logic to check this)
  const isAdminUser = req.user && req.user.isAdmin; // Assuming you have a user object with an "isAdmin" property

  // If the user is an admin, allow the request to proceed
  if (isAdminUser) {
    next();
  } else {
    // If the user is not an admin, send an error response (Unauthorized)
    res.status(401).json({ error: "Unauthorized access" });
  }
}
// ensure that only admins can do that.
app.post("/questions", isAdmin, function (req, res) {
  // Create a question object with the problem ID, solution, and acceptance status
  const question = {
    id,
    title,
    description,
    testCases: [
      {
        input,
        output,
      },
    ],
  };

  QUESTIONS.push(question);
  // Send a success response
  res.status(200).json({ message: "Problem added successfully" });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
