const {Players} = require('./utils/players');
const {isRealString} = require('./utils/validation');
const {problemGen} = require('./utils/problemGen');

let players = new Players();

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('join', (params, callback) => {
            console.log(params);
            if (!isRealString(params.name) || !isRealString(params.room))
                return callback('');
            socket.join(params.room);
            players.removePlayer(socket.id);
            players.addPlayer(socket.id, params.name, params.room);
            socket.broadcast.to(params.room).emit('newPlayerServer', params);
            callback(players.getPlayerList(params.name, params.room));
        });

        //Problem Creator
        socket.on('askForQuestion', (room) => {
            var problem = problemGen(room);
            Console.log(problem);

            io.to(position.room).emit('newQuestion', problem);
        });
        

        //Update Players Position
        socket.on('updatePosition', (position) => {
            // console.log(position);
            io.to(position.room).emit('moveFromServer', position);
        });
        //Player Actions
        socket.on('playerAction', (action) => {
            io.to(action.room).emit('playerActionServer', action);
        });
        //Update Player Score
        socket.on('updatePlayerScore', (score) => {
            var player = players.updatePlayerScore(socket.id, score);
            io.to(player.room).emit('updatePlayerScoreServer', player);
        });
        socket.on('disconnect', () => {
            var player = players.removePlayer(socket.id);
            if (player) {
                io.to(player.room).emit('removePlayer', player);
            }
        });
    });
}