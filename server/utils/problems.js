class Problems {
  constructor() {
    this.problems = [];
  }

  addProblem(room, problem, isCorrect, completed) {
    let _problem = {
      room,
      problem,
      isCorrect,
      completed
    };
    this.problems.push(_problem);
    return _problem;
  }

  getProblem(room) {
    return this.problems.filter(problem => problem.room === room)[0];
  }

  removeProblem(room) {
    let problem = this.getProblem(room);

    if (problem) {
      this.problems = this.problems.filter(problem => problem.room !== room);
    }

    return problem;
  }

  markCompleted(room) {
    let problem = this.getProblem(room);

    if (problem) {
      problem.completed = true;

      this.removeProblem(room);
      this.problems.push(problem);
    }
  }
}

module.exports = { Problems };