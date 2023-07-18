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
          const { code, testCases, userId, option } = submission;
          let runnerCode = "";
          let container = null;
          if (option === "Javascript") {
            runnerCode = `
              const fn = new Function(\`return \${submittedCode}\`)();
              for (const testCase of testCases) {
                const input = testCase.input.split(" ").map(Number);
                const result = fn(...input);
                console.log(result);
              }
            `;
            container = spawn("docker", [
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
          } else if (option === "C++") {
            runnerCode = `
              #include <iostream>
              #include <sstream>
              #include <vector>
              using namespace std;
              
              ${code}
              
              int main() {
                string line;
                while(getline(cin, line)) {
                  istringstream iss(line);
                  vector<int> input;
                  int x;
                  while(iss >> x) input.push_back(x);
                  cout << solve(input) << endl;
                }
                return 0;
              }
            `;
            container = spawn("docker", [
              "run",
              "--rm",
              "-i",
              "gcc:latest",
              "sh",
              "-c",
              `echo '${runnerCode}' > code.cpp && g++ -o code code.cpp && ./code`,
            ]);
            container.stdin.write(testCases.map((tc) => tc.input).join("\n"));
            container.stdin.end();
          }

          if (option !== "Javascript" && option !== "C++") {
            console.error(`Invalid option: ${option}`);
            channel.ack(msg);
            return;
          }

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
            const resultsQueue = "resultsQueue";

            // Handle successful submission
            submissions.push({ userId, code });
            console.log(`AC`);
            channel.sendToQueue(
              resultsQueue,
              Buffer.from(
                JSON.stringify({
                  userId,
                  outcome: "AC",
                })
              )
            );
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

module.exports = {
  processSubmission,
};
