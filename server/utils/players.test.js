const expect = require("expect");

const { Players } = require("./players");

describe("Player", () => {
  var players;

  beforeEach(() => {
    players = new Players();
    players.players = [
      {
        id: "1",
        name: "tst 1",
        room: "room 1",
        score: 0
      },
      {
        id: "2",
        name: "tst 2",
        room: "room 2",
        score: 0
      },
      {
        id: "3",
        name: "tst 3",
        room: "room 1",
        score: 0
      }
    ];
  });

  it("Should add new player", () => {
    var players = new Players();
    var player = {
      id: "123",
      name: "test",
      room: "room test",
      score: 0
    };

    var resPlayer = players.addPlayer(player.id, player.name, player.room, player.score);

    expect(players.players).toEqual([player]);
  });

  it("Should remove a Player", () => {
    var player = players.removePlayer("1");

    expect(player.name).toEqual("tst 1");
    expect(players.players.length).toBe(2);
  });

  it("Should not remove a Player", () => {
    var player = players.removePlayer("99");

    expect(player).toNotExist();
    expect(players.players.length).toBe(3);
  });

  it("Should find a Player", () => {
    var player = players.getPlayer("1");

    expect(player.name).toEqual("tst 1");
  });

  it("Should not find a Player", () => {
    var player = players.getPlayer("99");

    expect(player).toNotExist();
  });

  it("Should return players", () => {
    var playerList = players.getPlayerList("room 1");

    expect(playerList).toEqual([
      {
        id: "1",
        name: "tst 1",
        room: "room 1",
        score: 0
      },
      {
        id: "3",
        name: "tst 3",
        room: "room 1",
        score: 0
      }
    ]);
  });
});
