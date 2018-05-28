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
      this.players = this.players.filter(player => player.id !== id);
    }

    return player;
  }

  getPlayer(id) {
    return this.players.filter(player => player.id === id)[0];
  }

  getPlayerList(name, room) {
    var players = this.players.filter(
      player => player.room === room && player.name !== name
    );
    var namesArray =
      players.map(player => player.name).length === 0
        ? undefined
        : players.map(player => player.name).toString();

    // console.log(namesArray);

    return namesArray;
  }

  getPlayerList(room) {
    var players = this.players.filter(player => player.room === room);

    players.sort(function(a,b) {return (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0);} ); 

    return players;
  }

  getCurrentRooms() {
    var rooms = this.players.map(player => player.room);

    return rooms.filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos;
    });
  }

  updatePlayerScore(id, score) {
    var player = this.getPlayer(id);

    if (player) {
      player.score = score;

      this.removePlayer(id);
      this.players.push(player);
    }
  }
}

module.exports = { Players };