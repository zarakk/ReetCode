export const updateProblem = (id, data) => {
  // Find the index of the problem to update
  const index = QUESTIONS.findIndex((problem) => problem.id === id);
  if (index === -1) {
    // Problem not found
    return;
  }

  // Update the problem data
  QUESTIONS[index] = {
    ...QUESTIONS[index],
    ...data,
  };
};

export const deleteProblem = (id) => {
  // Find the index of the problem to delete
  const index = QUESTIONS.findIndex((problem) => problem.id === id);
  if (index === -1) {
    // Problem not found
    return;
  }

  // Remove the problem from the array
  QUESTIONS.splice(index, 1);
};
