const updateProblem = (id, data, questions) => {
  return new Promise((resolve, reject) => {
    // Find the index of the problem to update
    const index = questions.findIndex((problem) => problem.id === id);
    if (index === -1) {
      // Problem not found
      reject(new Error("Problem not found"));
      return;
    }

    // Update the problem data
    questions[index] = {
      ...questions[index],
      ...data,
    };

    resolve();
  });
};

const deleteProblem = (id, questions) => {
  // Find the index of the problem to delete
  const index = questions.findIndex((problem) => problem.id === id);
  if (index === -1) {
    // Problem not found
    return;
  }

  // Remove the problem from the array
  questions.splice(index, 1);
};

module.exports = { deleteProblem, updateProblem };
