const expect = require("expect");

const { Problems } = require("./problems");

describe("Problems", () => {
  var problems;

  beforeEach(() => {
    problems = new Problems();
    problems.problems = [
      {
        room: "1",
        problem: "1 - 1 = 0",
        isCorrect: true,
        completed: false
      },
      {
        room: "2",
        problem: "4 + 4 = 3",
        isCorrect: false,
        completed: true
      },
      {
        room: "3",
        problem: "8 * 9 = 71",
        isCorrect: false,
        completed: false
      }
    ];
  });

  it("Should add new Problem", () => {
    var problems = new Problems();
    var problem = {
      room: "4",
      problem: "1 * 1 = 2",
      isCorrect: false,
      completed: false
    };

    var resproblem = problems.addProblem(
      problem.room,
      problem.problem,
      problem.isCorrect,
      problem.completed
    );

    expect(problems.problems).toEqual([problem]);
  });

  it("Should remove a Problem", () => {
    var problem = problems.removeProblem("1");

    expect(problem.problem).toEqual("1 - 1 = 0");
    expect(problems.problems.length).toBe(2);
  });

  it("Should not remove a Problem", () => {
    var problem = problems.removeProblem("11");

    expect(problem).toNotExist();
    expect(problems.problems.length).toBe(3);
  });

  it("Should find a Problem", () => {
    var problem = problems.getProblem("1");

    expect(problem.problem).toEqual("1 - 1 = 0");
  });

  it("Should not find a Problem", () => {
    var problem = problems.getProblem("99");

    expect(problem).toNotExist();
  });

  it("Should mark a Problem as completed", () => {
    problems.markCompleted("1");

    var problem = problems.getProblem("1");
    expect(problem.completed).toBe(true);
  });
});
