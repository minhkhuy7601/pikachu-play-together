import Item from "./modules/Item.js";
import Line from "./modules/Line.js";

import {
  canvas,
  ctx,
  matrix,
  lines,
  track,
  TIME_PROGRESS,
  infoCanvas,
  backUpMatrix,
} from "./modules/constant.js";
import checkTwoPoints from "./modules/ruleGame.js";
import { Socket } from "socket.io-client";

// SCREEN RESIZE
window.addEventListener("resize", () => {
  console.log("resize");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  infoCanvas.assign(canvas.width, canvas.height, 10, 20, 0);
  initMatrix();
  gamePlay();
});

// LOAD INIT GAME
window.addEventListener("load", () => {
  initStartGame();
  initMatrix();
  gamePlay();
  handleProgressBar();
});

const progressBarElement = document.querySelector(
  ".functionBox__progress__bar"
);
const pointElement = document.querySelector(".functionBox__info__point span");
const modalElement = document.querySelector(".modal");

let itemsSelected = [];
let permitClick = true;
let point = 0;

// GENERATE INITIAL MATRIX VALUE
function initStartGame() {
  let { COLS, ROWS } = infoCanvas;
  let temp = [];
  const AMOUNT_IMAGE = 36;
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
        newRow.push({ state: 0, value: 999999 });
      }
    }
    backUpMatrix.push(newRow);
  }
}

// GENERATE MATRIX ITEM
async function initMatrix() {
  let { COLS, ROWS, size, pointBeginDrawX, pointBeginDrawY, gap } = infoCanvas;
  matrix.length = 0;
  // EACH IMAGE APPEARS 4 TIMES

  for (let i = 0; i < ROWS; i++) {
    let newRow = new Array();
    for (let j = 0; j < COLS; j++) {
      let { state, value } = backUpMatrix[i][j];
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
        i,
        j,
        false,
        image,
        value,
        size,
        gap,
        pointBeginDrawX,
        pointBeginDrawY
      );
      newRow.push(item);
    }
    matrix.push(newRow);
  }
  drawGame();
}

function waitForImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// DRAW CANVAS
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  matrix.forEach((val) => {
    val.forEach((v) => v.draw());
  });
  lines.forEach((val) => {
    val.draw();
  });
}

// HANDLE EVENT CLICK CANVAS
function gamePlay() {
  pointElement.textContent = 0;
  canvas.removeEventListener("click", handleClickCanvas);
  canvas.addEventListener("click", handleClickCanvas);
}

function handleClickCanvas(e) {
  let { size } = infoCanvas;
  if (permitClick) {
    let corX = e.offsetX;
    let corY = e.offsetY;
    matrix.every((row, i) => {
      let ctn = true;
      row.every((item, j) => {
        if (
          item.x <= corX &&
          corX <= item.x + size &&
          item.y <= corY &&
          corY <= item.y + size
        ) {
          if (!item.isChose) {
            conditionSelect(item);
          }
          ctn = false;
          return false;
        }
        return true;
      });
      return ctn;
    });
  }
}

function conditionSelect(item) {
  let { size, pointBeginDrawX, pointBeginDrawY, gap } = infoCanvas;
  let isExist = false;
  itemsSelected = itemsSelected.filter((val) => {
    if (val === item) {
      isExist = true;
      return false;
    }
    return true;
  });

  if (isExist) {
    item.isSelected = false;
    drawGame();
  } else {
    item.isSelected = true;
    itemsSelected.push(item);
    drawGame();
    if (itemsSelected.length === 2) {
      itemsSelected[0].isChose = true;
      itemsSelected[1].isChose = true;
      if (!checkTwoPoints(itemsSelected[0], itemsSelected[1])) {
        itemsSelected[0].isChose = false;
        itemsSelected[1].isChose = false;
        itemsSelected[0].isMatch = false;
        itemsSelected[1].isMatch = false;
      } else {
        backUpMatrix[itemsSelected[0].i][itemsSelected[0].j] = 0;
        backUpMatrix[itemsSelected[1].i][itemsSelected[1].j] = 0;
        point += 10;
        pointElement.textContent = point;
        for (let i = 0; i < track.length - 1; i++) {
          lines.push(
            new Line(
              track[i],
              track[i + 1],
              size,
              gap,
              pointBeginDrawX,
              pointBeginDrawY
            )
          );
        }
      }
      drawGame();
      itemsSelected[0].isMatch = true;
      itemsSelected[1].isMatch = true;
      lines.length = 0;
      itemsSelected.forEach((val) => {
        val.isSelected = false;
      });
      itemsSelected = [];
      permitClick = false;
      setTimeout(() => {
        permitClick = true;
        drawGame();
      }, 300);
    }
  }
}

function handleProgressBar() {
  progressBarElement.style.width = "0%";
  let count = 0;
  let percent = 100 / TIME_PROGRESS;
  let interval = setInterval(() => {
    count++;
    progressBarElement.style.width = `${count * percent}%`;
    if (count === TIME_PROGRESS + 1) {
      clearInterval(interval);
      handleGameOver();
    }
  }, 1000);
}

function handleGameOver() {
  modalElement.style.display = "flex";
}
