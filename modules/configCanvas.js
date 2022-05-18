const OFF_SET = 22;

export class CanvasPokemon {
  width = 400;
  height = 200;
  rows = 10;
  cols = 20;
  size = 20;
  gap = 0;
  n = 200;
  pointBeginDrawX = 0;
  pointBeginDrawY = 0;
  constructor(width, height, rows, cols, gap) {
    this.width = width;
    this.height = height;
    this.rows = rows;
    this.cols = cols;
    this.gap = gap;
    this.n = rows * cols;
    this.size = Math.floor(width / OFF_SET);
    this.pointBeginDrawX = width / 2 - (this.size * cols) / 2;
    this.pointBeginDrawY = height / 2 - (this.size * rows) / 2;
  }

  getAllValue() {
    return {
      width: this.width,
      height: this.height,
      rows: this.rows,
      cols: this.cols,
      size: this.size,
      gap: this.gap,
      n: this.n,
      pointBeginDrawX: this.pointBeginDrawX,
      pointBeginDrawY: this.pointBeginDrawY,
    };
  }
}
