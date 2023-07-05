const amqp = require("amqplib/callback_api");
const { spawn } = require("child_process");
const submissions = [];

function processSubmission() {
  console.log("processSubmission called"); // Add logging statement here
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

      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queue
      );

      channel.prefetch(1);

      channel.consume(
        queue,
        function (msg) {
          console.log("Message received:", msg.content.toString()); // Add logging statement here
          console.log(" [x] Received %s", msg.content.toString());
          const submission = JSON.parse(msg.content.toString());
          const { code, testCases, userId } = submission;

          const runnerCode = `
          const fn = new Function(\`return \${submittedCode}\`)();
          for (const testCase of testCases) {
            const input = testCase.input.split(" ").map(Number);
            const result = fn(...input);
            console.log(result);
          }
        `;
          const container = spawn("docker", [
            "run",
            "--rm",
            "-i",
            "node:latest",
            "node",
            "-e",
            `const testCases = ${JSON.stringify(testCases)};
             const submittedCode = \`${code}\`;
             ${runnerCode}`,
          ]);

          let error = "";
          let acked = false; // Add flag to keep track of whether message has been acknowledged

          let result = [];
          container.stdout.on("data", (data) => {
            result.push(...data.toString().trim().split("\n"));
          });
          container.stderr.on("data", (data) => {
            error += data.toString();
            console.log(`container.stderr.on data: ${data.toString()}`); // Add logging statement here
          });

          container.on("close", (code) => {
            console.log(`container.on close: ${code}`); // Add logging statement here
            if (code !== 0 || error) {
              // Handle error
              console.log(`Error: ${error}`);
              if (!acked) {
                // Only acknowledge message if it hasn't been acknowledged yet
                channel.ack(msg);
                acked = true;
              }
              return;
            }
            console.log(`Result: ${result[0]}, ${result[1]}`); // Add logging statement here
            console.log(`Test cases: ${JSON.stringify(testCases)}`); // Add logging statement here
            // Check if the result matches the expected outcome
            let failedTestCaseIndex = -1;
            const outcome = testCases.every((testCase, index) => {
              if (result[index] !== testCase.expectedOutput) {
                failedTestCaseIndex = index;
                return false;
              }
              return true;
            });

            if (!outcome) {
              // Handle failed test case
              console.log(
                `Test case ${failedTestCaseIndex} failed. Expected output: ${testCases[failedTestCaseIndex].expectedOutput}, actual output: ${result[failedTestCaseIndex]}`
              );
              if (!acked) {
                // Only acknowledge message if it hasn't been acknowledged yet
                channel.ack(msg);
                acked = true;
              }
              return;
            }

            // Handle successful submission
            submissions.push({ userId, code });
            console.log(`AC`);
            if (!acked) {
              // Only acknowledge message if it hasn't been acknowledged yet
              channel.ack(msg);
              acked = true;
            }
          });

          // Handle timeout
          setTimeout(() => {
            container.kill();
            console.log(`TLE`);
            if (!acked) {
              // Only acknowledge message if it hasn't been acknowledged yet
              channel.ack(msg);
              acked = true;
            }
          }, 10000);
        },
        {
          noAck: false,
        }
      );
    });
  });
}

// function processSubmission() {
//   amqp.connect("amqp://localhost", function (error0, connection) {
//     if (error0) {
//       throw error0;
//     }
//     connection.createChannel(function (error1, channel) {
//       if (error1) {
//         throw error1;
//       }

//       const queue = "submissionQueue";

//       channel.assertQueue(queue, {
//         durable: false,
//       });

//       console.log(
//         " [*] Waiting for messages in %s. To exit press CTRL+C",
//         queue
//       );

//       channel.prefetch(1);

//       channel.consume(
//         queue,
//         function (msg) {
//           console.log(" [x] Received %s", msg.content.toString());
//           const submission = JSON.parse(msg.content.toString());
//           const { code, testCases, userId } = submission;

//           // Create a container to run the code
//           const container = spawn("docker", [
//             "run",
//             "--rm",
//             "-i",
//             "node:latest",
//             "node",
//             "-e",
//             code,
//           ]);

//           let result = "";
//           let error = "";

//           container.stdout.on("data", (data) => {
//             result += data.toString();
//           });

//           container.stderr.on("data", (data) => {
//             error += data.toString();
//           });

//           container.on("close", (code) => {
//             if (code !== 0 || error) {
//               // Handle error
//               console.log(`Error: ${error}`);
//               channel.ack(msg);
//               return;
//             }

//             // Check if the result matches the expected outcome
//             const outcome = testCases.every(
//               (testCase) => result === testCase.expectedOutcome
//             );

//             if (!outcome) {
//               // Handle failed test case
//               console.log(`Syntax Error`);
//               channel.ack(msg);
//               return;
//             }

//             // Handle successful submission
//             submissions.push({ userId, code });
//             console.log(`AC`);
//             channel.ack(msg);
//           });

//           // Handle timeout
//           setTimeout(() => {
//             container.kill();
//             console.log(`TLE`);
//             channel.ack(msg);
//           }, 2000);
//         },
//         {
//           noAck: false,
//         }
//       );
//     });
//   });
// }

module.exports = {
  processSubmission,
};

//setup connectino to message queue

// const rabbitmqURL = "amqp://localhost";
// const kubeconfig = new k8s.KubeConfig();
// kubeconfig.loadFromDefault();

// Function to process the submitted problem
//  async function processProblemSubmission(submission) {
//   // Create a Kubernetes Job to run the test cases in a container
//   const job = createTestCasesJob(submission);

//   try {
//     // Create the Kubernetes API client
//     const k8sApi = kubeconfig.makeApiClient(k8s.BatchV1Api);

//     // Create the Job in the Kubernetes cluster
//     const createResponse = await k8sApi.createNamespacedJob("default", job);
//     console.log("Test cases Job created:", createResponse.body.metadata.name);

//     // Watch the Job status until it completes
//     await watchJobCompletion(k8sApi, createResponse.body.metadata.name);

//     // Get the Job status after completion
//     const getResponse = await k8sApi.readNamespacedJobStatus(
//       createResponse.body.metadata.name,
//       "default"
//     );

//     // Determine the result based on the Job status
//     const result =
//       getResponse.body.status.succeeded === 1 ? "AC" : "Syntax Error";

//     return result;
//   } catch (error) {
//     console.error("Error processing problem submission:", error);
//     return "Error";
//   }
// }

// // Helper function to create the Kubernetes Job for running test cases
// function createTestCasesJob(submission) {
//   const job = new k8s.V1Job();
//   job.metadata = { name: "test-cases-job" };
//   job.spec = {
//     parallelism: 1, // Set the initial parallelism to 1
//     completions: 1, // Set the initial completions to 1
//     template: {
//       spec: {
//         containers: [
//           {
//             name: "test-cases-container",
//             image: "your-test-cases-image", // Replace with your test cases image
//             command: [
//               "sh",
//               "-c",
//               "g++ /path/to/code.cpp -o /path/to/executable && /path/to/executable",
//             ], // Compile and run C++ code
//             env: [{ name: "SUBMISSION", value: submission }],
//           },
//         ],
//         restartPolicy: "Never",
//       },
//     },
//   };

//   return job;
// }

// // Helper function to watch the Job status until completion
// async function watchJobCompletion(k8sApi, jobName) {
//   return new Promise((resolve, reject) => {
//     const watcher = new k8s.Watch(kubeconfig);
//     watcher.watch(
//       `/apis/batch/v1/namespaces/default/jobs/${jobName}`,
//       {},
//       (phase, obj) => {
//         if (phase === "DELETED") {
//           resolve();
//           watcher.abort();
//         } else if (phase === "ERROR") {
//           reject(new Error(`Job error: ${obj.status?.message}`));
//           watcher.abort();
//         }
//       }
//     );
//   });
// }

// module.exports = {
//   processProblemSubmission,
//   consumeMessagesFromQueue,
// };
