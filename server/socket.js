const {Players} = require('./utils/players');
const {Problems} = require('./utils/problems');
const {isRealString} = require('./utils/validation');
const {problemGen} = require('./utils/problemGen');

let players = new Players();
let problems = new Problems();
let time = 5;

module.exports = (io) => {
    io.on('connection', (socket) => {
        //Player join a room
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

        //CheckAnswer
        socket.on('checkAnswer', (params, callback) => {
            //Get the Player connected
            let p = players.getPlayer(socket.id);  
            
            //Get the Current problem of that Room
            let problem = problems.getProblem(params.problem.room);

            if(typeof problem === "undefined") return;

            //Check if problem is already completed.
            if(!problem.completed)  {
                //Check if the Player answered correctly
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

                    //Return the status for the Player
                    return callback(answer);
                } else {
                    let score = p.score - 1;
                    players.updatePlayerScore(p.id, score);

                    let answer = {
                        status: 'Incorrect!',
                        score: score
                    };

                    //Return the status for the Player
                    return callback(answer);
                }
            } else {
                let answer = {
                    status: 'Already Answered!',
                    score: p.score
                };

                //Return the status for the Player
                return callback(answer);
            }            
        });

        //Remove player disconnecting
        socket.on('disconnect', () => {
            var player = players.removePlayer(socket.id);
            if (player) {
                io.to(player.room).emit('removePlayer', player);
            }
        });
    });

    //Loop to genereate the Problems for each Room every 5 seconds
    (function BroadcastQuestions() {
        let rooms = players.getCurrentRooms();

        if(rooms.length > 0)
            rooms.forEach((element) => EmitNewQuestion(element));

        setTimeout(BroadcastQuestions, 5000);
    })();

    //Generate a new Problem for the room, store it and broadcast it to the Room
    //Also broadcast the Players current scores
    function EmitNewQuestion(room) {
        //Generate a new Problem
        let newProblem = problemGen(room);

        //Replace the Problem of the Room
        problems.removeProblem(room);
        problems.addProblem(room, newProblem.problem, newProblem.isCorrect, false);

        //Broadcast the Problem to the Room
        io.to(room).emit('newQuestion', newProblem);

        //Get and broadcast the Players current scores
        let currPlayers = players.getPlayerList(room);
        io.to(room).emit('updateScores', currPlayers);
    }

    //Loop to align the Time counting in every Client
    (function AlignClientTime() {        
        io.sockets.emit('AlignClientTime', time);

        time = time === 1 ? 5 : time - 1;

        setTimeout(AlignClientTime, 1000);
    })();
}