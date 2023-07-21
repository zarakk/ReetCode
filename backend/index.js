const express = require("express");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const amqp = require("amqplib/callback_api");
const config = require("./config");
const SECRET_KEY = config.secret;
const fs = require("fs");
const { processSubmission } = require("./submissionProcessor");
const { updateProblem, deleteProblem } = require("./utils");
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

// Define a helper function to read data from a file
const readData = (fileName) => {
  try {
    const data = fs.readFileSync(fileName, "utf8");
    console.log(data);
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Define a helper function to write data to a file
const writeData = (fileName, data) => {
  try {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
  }
};

// Define a helper function to generate a JWT
const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};

// Define a helper function to verify a JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Define a helper function to check if a user is authenticated
const isUserAuthenticated = (req, res, next) => {
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;
  // Check if the header exists and has the format 'Bearer token'
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token from the header
    const token = authHeader.split(" ")[1];
    // Verify the token
    const decoded = verifyToken(token);
    // Check if the token is valid and has the role 'user'
    if (decoded && decoded.role === "user") {
      // Attach the decoded payload to the request object
      req.user = decoded;

      // Proceed to the next middleware or route handler
      next();
    } else {
      // Send an unauthorized response
      res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    // Send an unauthorized response
    res
      .status(401)
      .json({ message: "Missing or malformed authorization header" });
  }
};

// Define a helper function to check if a user is authenticated
const isAdminAuthenticated = (req, res, next) => {
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;
  // Check if the header exists and has the format 'Bearer token'
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token from the header
    const token = authHeader.split(" ")[1];
    // Verify the token
    const decoded = verifyToken(token);
    // Check if the token is valid and has the role 'user'
    if (decoded && decoded.role === "admin") {
      // Attach the decoded payload to the request object
      req.user = decoded;

      // Proceed to the next middleware or route handler
      next();
    } else {
      // Send an unauthorized response
      res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    // Send an unauthorized response
    res
      .status(401)
      .json({ message: "Missing or malformed authorization header" });
  }
};

app.post("/admin/signup", function (req, res) {
  // Add logic to decode the request body
  const { email, password } = req.body;

  // Read the user data from the file
  const admins = readData("admins.json");

  // Check if the user with the given email already exists in the USERS array
  const adminExists = admins.some((admin) => admin.email === email);

  // If the user already exists
  if (adminExists) {
    // Send an error response (Conflict)
    res.status(409).json({ error: "Admin already exists" });
  } else {
    // Store the email and password in the USERS array
    // USERS.push({ email: email, password: password });
    // Create a new admin object with an id and a role
    const newAdmin = { id: admins.length + 1, email, password, role: "admin" };
    admins.push(newAdmin);
    // Write the updated admin data to the file
    writeData("admins.json", admins);

    // Generate a JWT for the new admin
    const token = generateToken(newAdmin);

    // Send a success response with the token
    res.status(201).json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", function (req, res) {
  // Add logic to decode the request body
  const { email, password } = req.body;

  // Read the admin data from the file
  const admins = readData("admins.json");

  // Check if the user with the given email exists in the USERS array
  const admin = admins.find((admin) => admin.email === email);

  // If the user exists and the password is correct
  if (admin && admin.password === password) {
    const token = generateToken(admin);

    // Send a success response with the token
    res.status(200).json({ message: "Logged in successfully", token });
  } else {
    // Send an error response (Unauthorized)
    res.status(401).json({ error: "Invalid email or password" });
  }
});

app.post("/signup", function (req, res) {
  // Add logic to decode the request body
  const { email, password } = req.body;

  // Read the user data from the file
  const users = readData("users.json");

  // Check if the user with the given email already exists in the USERS array
  const userExists = users.some((user) => user.email === email);

  // If the user already exists
  if (userExists) {
    // Send an error response (Conflict)
    res.status(409).json({ error: "User already exists" });
  } else {
    // Store the email and password in the USERS array
    // USERS.push({ email: email, password: password });
    // Create a new admin object with an id and a role
    const newUser = { id: users.length + 1, email, password, role: "user" };
    users.push(newUser);
    // Write the updated admin data to the file
    writeData("users.json", users);

    // Generate a JWT for the new admin
    const token = generateToken(newUser);

    // Send a success response with the token
    res.status(201).json({ message: "User created successfully", token });
  }
});

app.post("/login", function (req, res) {
  // Add logic to decode the request body
  const { email, password } = req.body;

  // Read the admin data from the file
  const users = readData("users.json");

  // Check if the user with the given email exists in the USERS array
  const user = users.find((user) => user.email === email);

  // If the user exists and the password is correct
  if (user && user.password === password) {
    const token = generateToken(user);

    // Send a success response with the token
    res.status(200).json({ message: "Logged in successfully", token });
  } else {
    // Send an error response (Unauthorized)
    res.status(401).json({ error: "Invalid email or password" });
  }
});

app.get("/user/me", isUserAuthenticated, async (req, res) => {
  try {
    const users = readData("users.json");

    const user = users.find((user) => user.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's information
    res.json({
      // id: user._id,
      email: user.email,
      // username: user.username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
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

      const resultsQueue = "resultsQueue";

      channel.assertQueue(resultsQueue, {
        durable: false,
      });

      channel.consume(resultsQueue, (msg) => {
        const result = JSON.parse(msg.content.toString());
        res.json(result);
      });
    });
  });
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
app.post("/questions", isAdminAuthenticated, function (req, res) {
  const { title, description, testCases, expectedOutput } = req.body;
  // Create a question object with the problem ID, solution, and acceptance status
  console.log("title", title);
  const question = {
    id: QUESTIONS.length + 1,
    title,
    description,
    testCases,
    expectedOutput,
  };
  console.log("question", question);
  QUESTIONS.push(question);

  // Send a success response
  res.status(200).json({ message: "Problem added successfully" });
});

// Update a problem
app.put("/api/problems/:id", (req, res) => {
  const problemId = req.params.id;
  // Update the problem in the database
  // Replace this with your own implementation
  updateProblem(problemId, req.body).then(() => {
    res.sendStatus(200);
  });
});

// Delete a problem
app.delete("/api/problems/:id", (req, res) => {
  const problemId = req.params.id;
  // Delete the problem from the database
  // Replace this with your own implementation
  deleteProblem(problemId).then(() => {
    res.sendStatus(200);
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
