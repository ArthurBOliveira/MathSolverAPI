const {Players} = require('./utils/players');
const {Problems} = require('./utils/problems');
const {isRealString} = require('./utils/validation');
const {problemGen} = require('./utils/problemGen');

let players = new Players();
let problems = new Problems();

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('join', (params, callback) => {
            if (!isRealString(params.name) || !isRealString(params.room))
                return;
            socket.join(params.room);
            players.removePlayer(socket.id);
            players.addPlayer(socket.id, params.name, params.room, 0);
            var currPlayers = players.getPlayerList(params.room);
            io.to(params.room).emit('updateScores', currPlayers);

            var problem = problemGen(params.room);
            return callback(problem);
        });

        //Problem Creator
        socket.on('askForQuestion', (room) => {
            EmitNewQuestion(room)
        });

        //CheckAnswer
        socket.on('checkAnswer', (params, callback) => {            
            let p = players.getPlayer(socket.id);  
            
            let problem = problems.getProblem(params.problem.room);

            if(typeof problem === "undefined") return;

            //Check if problem is already completed.
            if(!problem.completed)  {
                if(params.problem.isCorrect === params.answer) {
                    let score = p.score + 1;
                    players.updatePlayerScore(p.id, score);

                    //broadcast that the question was already answered
                    io.to(params.problem.room).emit('questionAnswered', params.problem.room);

                    //Mark problem as Completed
                    problems.markCompleted(params.problem.room);

                    let answer = {
                        status: 'Correct!',
                        score: score
                    };

                    return callback(answer);
                } else {
                    let score = p.score - 1;
                    players.updatePlayerScore(p.id, score);

                    let answer = {
                        status: 'Incorrect!',
                        score: score
                    };

                    return callback(answer);
                }
            } else {
                let answer = {
                    status: 'Already Answered!',
                    score: p.score
                };

                return callback(answer);
            }            
        });

        socket.on('disconnect', () => {
            var player = players.removePlayer(socket.id);
            if (player) {
                io.to(player.room).emit('removePlayer', player);
            }
        });
    });

    (function BroadcastQuestions() {
        let rooms = players.getCurrentRooms();

        if(rooms.length > 0)
            rooms.forEach((element) => EmitNewQuestion(element));

        setTimeout(BroadcastQuestions, 5000);
    })();

    function EmitNewQuestion(room) {
        let newProblem = problemGen(room);

        problems.removeProblem(room);
        problems.addProblem(room, newProblem.problem, newProblem.isCorrect, false);

        io.to(room).emit('newQuestion', newProblem);
        var currPlayers = players.getPlayerList(room);
        io.to(room).emit('updateScores', currPlayers);
    }
}