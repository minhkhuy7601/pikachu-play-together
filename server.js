const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("public"));
app.use("/client", express.static("client"));
app.use("/screens", express.static("screens"));
app.use("/modules", express.static("modules"));

const MAX_PLAYER = 2;

let listRoom2PlayerTogether = new Array();

class Room {
  listPlayer = [];
  matrix = [];
  IDroom = "";
  constructor(IDroom) {
    this.IDroom = IDroom;
  }
  addPlayer(id, name, isMaster) {
    this.listPlayer.push({ id, name, isMaster });
  }
}

// namespace listeners
const playTogether = io.of("/together");
const competition = io.of("/competition");

playTogether.on("connection", (client) => {
  console.log("client connect game together");

  client.on("createRoom", handleCreateRoom);
  client.on("joinRoom", handleJoinRoom);
  client.on("disconnect", handleDisconnect);
  client.on("startGame", handleStartGame);
  client.on("playerChooseItem", handlePlayerClickItem);

  function handlePlayerClickItem({ i, j, idRoom }) {
    // console.log(i, j);
    console.log(
      JSON.stringify(
        listRoom2PlayerTogether.find((room) => room.IDroom === idRoom),
        null,
        2
      )
    );
    // playTogether.in(idRoom).emit();
  }

  function checkExistRoom(idRoom) {
    return listRoom2PlayerTogether.some((val) => val.IDroom === idRoom);
  }

  function getRoomInList(idRoom) {
    if (checkExistRoom(idRoom)) {
      return listRoom2PlayerTogether.find((val) => val.IDroom === idRoom);
    }
    return null;
  }

  function handleStartGame(idRoom) {
    if (checkExistRoom(idRoom)) {
      playTogether.in(idRoom).emit("startGameSuccess", generateMatrix(idRoom));
    }
  }

  function handleDisconnect() {
    listRoom2PlayerTogether = listRoom2PlayerTogether.map((room) => {
      room.listPlayer = room.listPlayer.filter(
        (player) => player.id !== client.id
      );
      return room;
    });

    // console.log(JSON.stringify(listRoom2PlayerTogether, null, 2));
  }

  function handleCreateRoom({ namePlayer }) {
    let idRoom = Math.floor(Math.random() * 100).toString();
    client.join(idRoom);
    let newRoom = new Room(idRoom);
    newRoom.addPlayer(client.id, namePlayer, true);
    listRoom2PlayerTogether.push(newRoom);
    // console.log(JSON.stringify(listRoom2PlayerTogether, null, 2));
    playTogether.to(client.id).emit("createRoomSuccess", newRoom);
  }

  function handleJoinRoom({ IDroom, name }) {
    let foundRoom = listRoom2PlayerTogether.find(
      (room) => room.IDroom === IDroom
    );
    if (foundRoom && foundRoom.listPlayer.length < MAX_PLAYER) {
      foundRoom.addPlayer(client.id, name, false);
      client.join(foundRoom.IDroom);
      // console.log(JSON.stringify(listRoom2PlayerTogether, null, 2));
      playTogether.to(client.id).emit("joinRoomSuccess", foundRoom);
      playTogether.in(foundRoom.IDroom).emit("updateListPlayer", foundRoom);
    } else {
      playTogether.to(client.id).emit("joinRoomFailed");
    }
  }
});

function generateMatrix(idRoom) {
  let matrix = [];
  const COLS = 20;
  const ROWS = 10;
  const AMOUNT_IMAGE = 36;
  let temp = [];
  for (let i = 0; i < AMOUNT_IMAGE; i++) {
    temp.push(0);
  }

  for (let i = 0; i < ROWS; i++) {
    let newRow = new Array();
    for (let j = 0; j < COLS; j++) {
      let value;
      if (i > 0 && i < ROWS - 1 && j > 0 && j < COLS - 1) {
        let index = Math.floor(Math.random() * AMOUNT_IMAGE);
        while (temp[index] >= 4) {
          index = Math.floor(Math.random() * AMOUNT_IMAGE);
        }
        value = index;
        temp[index]++;
        newRow.push({ state: 1, value });
      } else {
        newRow.push({ state: 0, value: 0 });
      }
    }
    matrix.push(newRow);
  }

  let room = listRoom2PlayerTogether.find((item) => item.IDroom === idRoom);
  room.matrix = matrix;

  return matrix;
}

competition.on("connection", (socket) => {
  console.log("competition");
});

// GET NAVIGATION
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/uiMenu.html");
});

app.get("/onePlayer", (req, res) => {
  res.sendFile(__dirname + "/onePlayer.html");
});

app.get("/together", (req, res) => {
  res.sendFile(__dirname + "/screens/playTogether/index.html");
});

server.listen(port, () => {
  console.log("listening on " + port);
});
