// enemy.js

export class Enemy {
  constructor() {
    this.x = Math.random() * (gameWidth - 50);
    this.y = -50;
    this.width = 30;
    this.height = 30;
    this.speed = 2;
  }

  update() {
    // 移动
    this.y += this.speed;
  }

  draw(ctx) {
    // 绘制敌人
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}