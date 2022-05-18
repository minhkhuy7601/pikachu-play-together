import { CanvasPokemon } from "/modules/configCanvas.js";
import Item from "/modules/Item.js";

const socket = io("/together");

const btnCreateRoom = document.querySelector(".ui-room__btnNewRoom");
const containerElement = document.querySelector(".container");
const inputNameElement = document.querySelector("#input-name");
const formElement = document.querySelector(".ui-room__form");

const AMOUNT_PLAYER_ENOUGH_TO_PLAY = 2;

let ID_ROOM = "";
let NAME_PLAYER = "";
let IS_MASTER = false;
let canvasMatrix = [];

window.addEventListener("load", () => {
  getNameFromLocal();
  btnCreateRoom.addEventListener("click", handleCreateRoom);
  formElement.addEventListener("click", handleFormJoinRoom);
  manageSocketFlow();
});

function manageSocketFlow() {
  socket.on("createRoomSuccess", uiMasterRoomPlayer);
  socket.on("joinRoomSuccess", uiNormalPlayer);
  socket.on("joinRoomFailed", () => {
    alert("Couldn't join'");
  });
  socket.on("updateListPlayer", handleUpdateListPlayer);
  socket.on("startGameSuccess", handleCreateGame);
}

function getNameFromLocal() {
  NAME_PLAYER = localStorage.getItem("namePlayer");
  if (NAME_PLAYER) {
    inputNameElement.value = NAME_PLAYER;
  }
}

function handleFormJoinRoom(e) {
  const inputIDroomElement = document.querySelector("#input-id-room");
  e.preventDefault();
  let valueInput = inputIDroomElement.value;
  socket.emit("joinRoom", { IDroom: valueInput, name: NAME_PLAYER });
}

function hasValidInputName() {
  return NAME_PLAYER.length <= 8;
}

function handleCreateRoom() {
  NAME_PLAYER = inputNameElement.value;
  if (!NAME_PLAYER) {
    alert("Please enter your name!");
  } else {
    if (!hasValidInputName()) {
      alert("The maximum length name is 8 letters");
    } else {
      localStorage.setItem("namePlayer", NAME_PLAYER);
      socket.emit("createRoom", { namePlayer: NAME_PLAYER });
    }
  }
}

function handleUpdateListPlayer(data) {
  renderListPlayer(data.listPlayer);
}

function uiMasterRoomPlayer(data) {
  IS_MASTER = true;
  ID_ROOM = data.IDroom;
  let { listPlayer } = data;
  renderListPlayer(listPlayer);
}

function uiNormalPlayer(data) {
  ID_ROOM = data.IDroom;
  let { listPlayer } = data;
  renderListPlayer(listPlayer);
}

function renderUIWaitingRoom() {
  return `<div class="ui-room">
    <img id="logo" src="/client/assets/images/logo.png" alt="" />
    <h2 class="ui-room__title">2 Player</h2>
    <p>Waiting room</p>
    <div class="ui-room__idRoom">
      <div class="ui-room__idRoom__btnBack btn">
        <i class="fa-solid fa-arrow-left"></i>
      </div>
      <div class="ui-room__idRoom__id">ID room: <span>${ID_ROOM}</span></div>
    </div>
    <div class="ui-room__listPlayers">
    </div>
    <div class="ui-room__btn-start btn">Start</div>
  </div>`;
}

function renderListPlayer(listPlayer) {
  containerElement.innerHTML = renderUIWaitingRoom();
  const listPlayerElement = document.querySelector(".ui-room__listPlayers");
  const btnStartElement = document.querySelector(".ui-room__btn-start");

  btnStartElement.addEventListener("click", () => {
    socket.emit("startGame", ID_ROOM);
  });

  let playerElement = listPlayer.map(
    (player) => `<div class="ui-room__listPlayers__player">
  <img
    src="/client/assets/images/animationPikachu.gif"
    class="ui-room__listPlayers__player__img"
    alt=""
  />
  <div class="ui-room__listPlayers__player__name">${player.name} ${
      player.isMaster ? "(master)" : ""
    }</div>
</div>`
  );

  listPlayerElement.innerHTML = "";
  playerElement.forEach((ele) => {
    listPlayerElement.innerHTML += ele;
  });

  let waitingElement = `<div class="ui-room__listPlayers__player">
  <img
    src="/client/assets/images/pokeball.png"
    class="ui-room__listPlayers__player__img pokeball"
    alt=""
  />
  <div class="ui-room__listPlayers__player__name waiting">
    Waiting...
  </div>
</div>`;
  if (!IS_MASTER) {
    btnStartElement.classList.add("hidden");
  }
  if (playerElement.length < AMOUNT_PLAYER_ENOUGH_TO_PLAY) {
    listPlayerElement.innerHTML += waitingElement;
  } else {
    btnStartElement.classList.add("active");
  }
}

function handleCreateGame(initMatrix) {
  const body = document.querySelector("body");
  body.innerHTML = `<div class="modal-wrap modal">
  <div class="modal-game">
    <h2 class="modal-game__title">Game over!</h2>
    <div class="modal-game__btn">
      <div class="modal-game__btn__back">
        <a href="./uiMenu.html"><button class="btn">Back</button></a>
      </div>
      <div class="modal-game__btn__playAgain">
        <a href="./index.html"><button class="btn">Play again</button></a>
      </div>
    </div>
  </div>
</div>
<div class="wrap-game-play">
  <div class="functionBox">
    <div class="functionBox__btn">
      <a href="./uiMenu.html">
        <button class="btn functionBox__btn__back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
      </a>
      <button class="btn functionBox__btn__again">
        <i class="fa-solid fa-arrow-rotate-left"></i>
      </button>
    </div>
    <div class="functionBox__progress">
      <div class="functionBox__progress__bar"></div>
    </div>
    <div class="functionBox__info">
      <div class="functionBox__info__name">Khuy</div>
      <div class="functionBox__info__point">Point: <span>100</span></div>
    </div>
  </div>
  <canvas id="canvas"></canvas>`;

  initCanvas(initMatrix);
  handleClickCanvas();
}

function handleClickCanvas() {
  const canvas = document.getElementById("canvas");
  canvas.addEventListener("click", (e) => {
    let corX = e.offsetX;
    let corY = e.offsetY;
    canvasMatrix.every((row) => {
      let ctn = true;
      row.every((item) => {
        if (
          item.x <= corX &&
          corX <= item.x + item.size &&
          item.y <= corY &&
          corY <= item.y + item.size
        ) {
          console.log(item.i, item.j);
          socket.emit("playerChooseItem", {
            i: item.i,
            j: item.j,
            idRoom: ID_ROOM,
          });
          ctn = false;
          return false;
        }
        return true;
      });
      return ctn;
    });
  });
}

function waitForImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
async function initCanvas(initMatrix) {
  let canvas = document.querySelector("#canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  let ROWS = initMatrix.length;
  let COLS = initMatrix[0].length;

  let infoCanvas = new CanvasPokemon(
    canvas.width,
    canvas.height,
    ROWS,
    COLS,
    0
  );

  console.log(infoCanvas.getAllValue());

  let { size, gap, pointBeginDrawX, pointBeginDrawY } =
    infoCanvas.getAllValue();
  // console.log(a.getAllValue());

  for (let i = 0; i < ROWS; i++) {
    let newRow = new Array();
    for (let j = 0; j < COLS; j++) {
      let { state, value } = initMatrix[i][j];
      let image;
      let item;
      let isChose = false;
      if (state === 1) {
        let src = `/client/assets/images/${value}.png`;
        await waitForImage(src).then((res) => {
          image = res;
        });
      } else {
        isChose = true;
      }
      item = new Item(
        ctx,
        i,
        j,
        isChose,
        image,
        value,
        size,
        gap,
        pointBeginDrawX,
        pointBeginDrawY
      );
      newRow.push(item);
    }
    canvasMatrix.push(newRow);
  }

  console.log(canvasMatrix);
  drawGame(canvas.width, canvas.height, canvasMatrix, ctx);
}

function drawGame(canvasWidth, canvasHeight, matrix, ctx) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  matrix.forEach((val) => {
    val.forEach((v) => v.draw());
  });
  // lines.forEach((val) => {
  //   val.draw();
  // });
}
