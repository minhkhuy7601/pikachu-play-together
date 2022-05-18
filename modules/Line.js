import { COLORS } from "./constant.js";

export default function Line(
  ctx,
  begin,
  end,
  size,
  gap,
  pointBeginDrawX,
  pointBeginDrawY
) {
  this.yBegin = begin.i * size + size / 2 + begin.i * gap + pointBeginDrawY;
  this.xBegin = begin.j * size + size / 2 + begin.j * gap + pointBeginDrawX;
  this.yEnd = end.i * size + size / 2 + end.i * gap + pointBeginDrawY;
  this.xEnd = end.j * size + size / 2 + end.j * gap + pointBeginDrawX;
  this.draw = function () {
    //draw line background
    ctx.beginPath();
    ctx.moveTo(this.xBegin, this.yBegin);
    ctx.lineTo(this.xEnd, this.yEnd);
    ctx.lineWidth = size / 6;
    ctx.strokeStyle = COLORS.blue1;
    ctx.stroke();
    //draw line main
    ctx.beginPath();
    ctx.moveTo(this.xBegin, this.yBegin);
    ctx.lineTo(this.xEnd, this.yEnd);
    ctx.lineWidth = size / 16;
    ctx.strokeStyle = COLORS.blue2;
    ctx.stroke();
  };
}
