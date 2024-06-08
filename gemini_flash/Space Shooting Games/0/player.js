// player.js

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 30;
    this.speed = 5;
    this.isMovingLeft = false;
    this.isMovingRight = false;
  }

  update() {
    // 移动
    if (this.isMovingLeft) {
      this.x -= this.speed;
    }
    if (this.isMovingRight) {
      this.x += this.speed;
    }

    // 限制玩家在画布内
    this.x = Math.max(0, Math.min(this.x, gameWidth - this.width));
  }

  draw(ctx) {
    // 绘制玩家
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  collidesWith(enemy) {
    // 检测碰撞
    return (
      this.x < enemy.x + enemy.width &&
      this.x + this.width > enemy.x &&
      this.y < enemy.y + enemy.height &&
      this.y + this.height > enemy.y
    );
  }
}

// 添加键盘事件监听
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      player.isMovingLeft = true;
      break;
    case 'ArrowRight':
      player.isMovingRight = true;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      player.isMovingLeft = false;
      break;
    case 'ArrowRight':
      player.isMovingRight = false;
      break;
  }
});