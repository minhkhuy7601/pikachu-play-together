import { matrix, track, infoCanvas } from "./constant.js";

let { ROWS, COLS } = infoCanvas;

function checkSameCor(point) {
  for (let i = 0; i < track.length; i++) {
    if (track[i].i === point.i && track[i].j === point.j) {
      return true;
    }
  }
  return false;
}

function checkLineX(j1, j2, i) {
  let dir = "L-R";
  if (j1 > j2) {
    dir = "R-L";
  }
  if (dir === "L-R") {
    for (let j = j1; j <= j2; j++) {
      if (!matrix[i][j].isChose) {
        track.length = 0;
        return false;
      }
      if (!checkSameCor({ i, j })) {
        track.push({ i, j });
      }
    }
  } else {
    for (let j = j1; j >= j2; j--) {
      if (!matrix[i][j].isChose) {
        track.length = 0;
        return false;
      }
      if (!checkSameCor({ i, j })) {
        track.push({ i, j });
      }
    }
  }
  return true;
}

function checkLineY(i1, i2, j) {
  let dir = "T-B";
  if (i1 > i2) {
    dir = "B-T";
  }
  if (dir === "T-B") {
    for (let i = i1; i <= i2; i++) {
      if (!matrix[i][j].isChose) {
        track.length = 0;
        return false;
      }
      if (!checkSameCor({ i, j })) {
        track.push({ i, j });
      }
    }
  } else {
    for (let i = i1; i >= i2; i--) {
      if (!matrix[i][j].isChose) {
        track.length = 0;
        return false;
      }
      if (!checkSameCor({ i, j })) {
        track.push({ i, j });
      }
    }
  }
  return true;
}

function checkL(p1, p2) {
  let pMinY = p1;
  let pMaxY = p2;
  if (p1.i > p2.i) {
    pMinY = p2;
    pMaxY = p1;
  }
  let pTop = { i: pMinY.i, j: pMaxY.j };
  let pBottom = { i: pMaxY.i, j: pMinY.j };
  let flag = false;
  if (
    checkLineX(pMinY.j, pTop.j, pTop.i) &&
    checkLineY(pMaxY.i, pTop.i, pTop.j)
  ) {
    // console.log("top");
    return true;
  }
  if (
    checkLineX(pMaxY.j, pBottom.j, pBottom.i) &&
    checkLineY(pMinY.i, pBottom.i, pBottom.j)
  ) {
    // console.log("bottom");

    return true;
  }
  return false;
}

function checkRectX(p1, p2) {
  // find point have y min and max
  let pMinY = p1,
    pMaxY = p2;
  if (p1.i > p2.i) {
    pMinY = p2;
    pMaxY = p1;
  }
  for (let i = pMinY.i + 1; i < pMaxY.i; i++) {
    if (
      checkLineY(pMinY.i, i, pMinY.j) &&
      checkLineX(pMinY.j, pMaxY.j, i) &&
      checkLineY(i, pMaxY.i, pMaxY.j)
    ) {
      return true;
    }
  }
  return false;
}

function checkRectY(p1, p2) {
  let pMinX = p1,
    pMaxX = p2;
  if (p1.j > p2.j) {
    pMinX = p2;
    pMaxX = p1;
  }
  for (let j = pMinX.j + 1; j < pMaxX.j; j++) {
    // check three line
    if (
      checkLineX(pMinX.j, j, pMinX.i) &&
      checkLineY(pMinX.i, pMaxX.i, j) &&
      checkLineX(j, pMaxX.j, pMaxX.i)
    ) {
      return true;
    }
  }
  return false;
}

function checkYShapeU(p1, p2) {
  let pMinX = p1,
    pMaxX = p2;
  if (p1.j > p2.j) {
    pMinX = p2;
    pMaxX = p1;
  }

  //check left direction
  for (let j = pMinX.j - 1; j >= 0; j--) {
    if (
      checkLineX(pMinX.j, j, pMinX.i) &&
      checkLineY(pMinX.i, pMaxX.i, j) &&
      checkLineX(pMaxX.j, j, pMaxX.i)
    ) {
      return true;
    }
  }

  //check right direction
  for (let j = pMaxX.j + 1; j < COLS; j++) {
    if (
      checkLineX(pMinX.j, j, pMinX.i) &&
      checkLineY(pMinX.i, pMaxX.i, j) &&
      checkLineX(pMaxX.j, j, pMaxX.i)
    ) {
      return true;
    }
  }
  return false;
}

function checkXShapeU(p1, p2) {
  let pMinY = p1,
    pMaxY = p2;
  if (p1.i > p2.i) {
    pMinY = p2;
    pMaxY = p1;
  }

  //check top direction
  for (let i = pMinY.i - 1; i >= 0; i--) {
    if (
      checkLineY(pMinY.i, i, pMinY.j) &&
      checkLineX(pMinY.j, pMaxY.j, i) &&
      checkLineY(pMaxY.i, i, pMaxY.j)
    ) {
      return true;
    }
  }

  //check bottom direction
  for (let i = pMaxY.i + 1; i < ROWS; i++) {
    if (
      checkLineY(pMinY.i, i, pMinY.j) &&
      checkLineX(pMinY.j, pMaxY.j, i) &&
      checkLineY(pMaxY.i, i, pMaxY.j)
    ) {
      return true;
    }
  }
  return false;
}

export default function checkTwoPoints(p1, p2) {
  track.length = 0;
  if (p1.value !== p2.value) {
    return false;
  }
  if (p1.i === p2.i) {
    if (checkLineX(p1.j, p2.j, p1.i)) {
      console.log("Line X");
      return true;
    }
  }
  if (p1.j === p2.j) {
    if (checkLineY(p1.i, p2.i, p1.j)) {
      console.log("Line Y");
      return true;
    }
  }
  if (checkL(p1, p2)) {
    console.log("L");
    return true;
  }
  if (checkRectX(p1, p2)) {
    console.log("Z-X");
    return true;
  }
  if (checkRectY(p1, p2)) {
    console.log("Z-Y");
    return true;
  }
  if (checkXShapeU(p1, p2)) {
    console.log("U-X");
    return true;
  }
  if (checkYShapeU(p1, p2)) {
    console.log("U-Y");
    return true;
  }
  return false;
}
