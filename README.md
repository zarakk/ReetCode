# Reetcode

Reetcode is a full-stack web application for code submission built with React. It allows users to submit code in JavaScript and C++ and provides a containerized environment for running the code using Docker. The application also has an admin side where admins can manage questions.

## User Facing Demo

https://github.com/zarakk/ReetCode/assets/52151884/08c1a893-52df-43e0-bcd7-de59e5d0ec0e

## Admin Facing Demo

https://github.com/zarakk/ReetCode/assets/52151884/24e2fc58-b675-4820-a791-5b2df62eb389

## Features

- **Front end**: The front end is built with React, a popular JavaScript library for building user interfaces. The styling is done with Material-UI (MUI), a React-based framework that implements Google's Material Design.
- **Back end**: The back end is built with Node.js, a JavaScript runtime that enables server-side scripting. The application uses JSON Web Tokens (JWT) for authentication, allowing users and admins to sign up and login securely.
- **Code submission**: The application supports the following code submission features:
  - **Language support**: Users can submit code in JavaScript and C++, two popular programming languages.
  - **Containerization**: The application uses Docker to create a containerized environment for running the submitted code. This ensures that the code runs in a consistent and isolated environment, regardless of the underlying system.
- **Admin functionality**: The application also has an admin side, where admins can perform the following tasks:
  - **Question management**: Admins can create, update, or delete questions from the database. They can also set the difficulty level, category, and other attributes of the questions.

## Tech Stack

| Tech Stack | Description |
| --- | --- |
| React | A popular JavaScript library for building user interfaces |
| Material-UI (MUI) | A React-based framework that implements Google's Material Design |
| Node.js | A JavaScript runtime that enables server-side scripting |
| JSON Web Tokens (JWT) | A standard for securely transmitting information between parties as a JSON object |
| Docker | A platform for developing, shipping, and running applications in containers |
