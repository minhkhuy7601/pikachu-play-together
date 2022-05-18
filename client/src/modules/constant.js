export let canvas = document.querySelector("#canvas");
export let ctx = canvas.getContext("2d");

// PALETTE

export const COLORS = {
  blue: "#c7ecee",
  yellow: "#f6e58d",
  lightBlue: "#dff9fb",
  red: "#ff7675",
  darkBlue: "#053742",
  blue1: "#0984e3",
  blue2: "#74b9ff",
};

export const TIME_PROGRESS = 10;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const initHEIGHT = canvas.height;
const initWIDTH = canvas.width;
const initROWS = 10;
const initCOLS = 20;
const initN = initROWS * initCOLS;
const initSize = Math.floor(initWIDTH / 22);
const initGap = 0;
let initPointBeginDrawX = initWIDTH / 2 - (initSize * initCOLS) / 2;
let initPointBeginDrawY = initHEIGHT / 2 - (initSize * initROWS) / 2;

export const infoCanvas = {
  WIDTH_CANVAS: window.innerWidth,
  HEIGHT_CANVAS: window.innerHeight,
  ROWS: initROWS,
  COLS: initCOLS,
  initN: initN,
  size: initSize,
  gap: initGap,
  pointBeginDrawX: initPointBeginDrawX,
  pointBeginDrawY: initPointBeginDrawY,
  assign: function (WIDTH_CANVAS, HEIGHT_CANVAS, ROWS, COLS, gap) {
    this.WIDTH_CANVAS = WIDTH_CANVAS;
    this.HEIGHT_CANVAS = HEIGHT_CANVAS;
    this.ROWS = ROWS;
    this.COLS = COLS;
    this.n = ROWS * COLS;
    this.size = Math.floor(WIDTH_CANVAS / 22);
    this.gap = gap;
    this.pointBeginDrawX = WIDTH_CANVAS / 2 - (this.size * COLS) / 2;
    this.pointBeginDrawY = HEIGHT_CANVAS / 2 - (this.size * ROWS) / 2;
  },
};

export let matrix = [];
export let backUpMatrix = [];
export let track = [];
export let lines = [];
