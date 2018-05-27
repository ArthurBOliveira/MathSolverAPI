var problemGen = (room) => {
  var x = Math.floor(Math.random() * 10 + 1);
  var y = Math.floor(Math.random() * 10 + 1);  
  var rng = Math.floor(Math.random() * 2 + 1);
  var oper = Math.floor(Math.random() * 4 + 1);
  var problem;
  var answer;
  var isCorrect;

  switch (oper) {
    case 1:
      answer = rng > 1 ? x + y : x + y + Math.floor(Math.random() * 10 + 1);
      problem = x + " + " + y + " = " + answer;
      isCorrect = x + y === answer ? true : false;
      break;
    case 2:
      answer = rng > 1 ? x - y : x - y - Math.floor(Math.random() * 10 + 1);
      problem = x + " - " + y + " = " + answer;
      isCorrect = x - y === answer ? true : false;
      break;
    case 3:
      answer = rng > 1 ? x * y : x * y + Math.floor(Math.random() * 10 + 1);
      problem = x + " * " + y + " = " + answer;
      isCorrect = x * y === answer ? true : false;
      break;
    case 4:
      answer = rng > 1 ? x / y : x / y + Math.floor(Math.random() * 10 + 1);
      problem = x + " / " + y + " = " + answer;
      isCorrect = x / y === answer ? true : false;
      break;
  }

  var result = {
      room,
      problem,
      isCorrect,
      completed: false,
  }

  return result;
};

module.exports = { problemGen };
