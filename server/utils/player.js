class Players {
    constructor() {
        this.players = [];
    }

    addPlayer(id, name, room, score) {
        let player = {
            id,
            name,
            room,
            score
        };
        this.players.push(player);
        return player;
    }

    removePlayer(id) {
        var player = this.getPlayer(id);

        if (player) {
            this.players = this.players.filter((player) => player.id !== id);
        }

        return player;
    }

    getPlayer(id) {
        return this.players.filter((player) => player.id === id)[0];
    }

    getPlayerList(name, room) {
        var players = this.players.filter((player) => player.room === room && player.name !== name);
        var namesArray = players.map((player) => player.name).length === 0 ? undefined : players.map((player) => player.name).toString();

        // console.log(namesArray);

        return namesArray;
    }

    updatePlayerScore(id, score) {
        var player = getPlayer(id);

        if(player){
            player.score = score;

            removePlayer(id);
            addPlayer(player);
        }
    }
}

export default { Players };