import { COLORS } from "./constant.js";

export default function Item(
  ctx,
  i,
  j,
  isChose,
  img,
  value,
  size,
  gap,
  pointBeginDrawX,
  pointBeginDrawY
) {
  this.x = j * size + j * gap + pointBeginDrawX;
  this.y = i * size + i * gap + pointBeginDrawY;
  this.i = i;
  this.j = j;
  this.size = size;
  this.isChose = isChose;
  this.isSelected1 = false;
  this.isSelected2 = false;
  this.value = value;
  this.isMatch = true;
  this.img = img;

  this.setIsSelected1 = function (value) {
    this.isSelected1 = value;
  };
  this.setIsSelected2 = function (value) {
    this.isSelected2 = value;
  };
  this.setIsChose = function (value) {
    this.isChose = value;
  };
  this.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;
    if (!this.isChose) {
      ctx.fillStyle = COLORS.blue;
      ctx.fillRect(this.x, this.y, size, size);
      if (this.isSelected1) {
        ctx.fillStyle = COLORS.yellow;
        ctx.fillRect(this.x, this.y, size, size);
      }
      if (this.isSelected2) {
        ctx.fillStyle = COLORS.red;
        ctx.fillRect(this.x, this.y, size, size);
      }
      if (!this.isMatch) {
        ctx.fillStyle = COLORS.red;
        ctx.fillRect(this.x, this.y, size, size);
      }
      ctx.strokeStyle = COLORS.darkBlue;
      ctx.drawImage(img, this.x + 5, this.y + 5, size - 10, size - 10);
      ctx.strokeRect(this.x, this.y, size, size);
      ctx.strokeStyle = COLORS.lightBlue;
      ctx.lineWidth = 4;
      ctx.strokeRect(this.x + 3, this.y + 3, size - 6, size - 6);
    }
  };
}
