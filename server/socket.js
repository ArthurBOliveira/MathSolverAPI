const {Players} = require('./utils/players');
const {isRealString} = require('./utils/validation');
const {problemGen} = require('./utils/problemGen');

let players = new Players();

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Someone connected');

        socket.on('join', (params, callback) => {
            // console.log(params);
            if (!isRealString(params.name) || !isRealString(params.room))
                return;
            socket.join(params.room);
            players.removePlayer(socket.id);
            players.addPlayer(socket.id, params.name, params.room);
            socket.broadcast.to(params.room).emit('newPlayerServer', params);

            var problem = problemGen(params.room);
            // console.log(problem);
            return callback(problem);
        });

        //Problem Creator
        socket.on('askForQuestion', (room) => {
            var problem = problemGen(room);
            console.log(problem);

            io.to(problem.room).emit('newQuestion', problem);
        });

        //CheckAnswer
        socket.on('checkAnswer', (problem, answer) => {
            console.log(problem);

            io.to(problem.room).emit('newQuestion', problem);
        });

        socket.on('disconnect', () => {
            var player = players.removePlayer(socket.id);
            if (player) {
                io.to(player.room).emit('removePlayer', player);
            }
        });
    });
}