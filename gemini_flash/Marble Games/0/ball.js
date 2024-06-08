// ball.js
export class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.vx = 0; // 水平速度
    this.vy = 0; // 垂直速度
  }

  applyGravity(gravity) {
    this.vy += gravity;
  }

  applyFriction(friction) {
    this.vx *= (1 - friction);
    this.vy *= (1 - friction);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}