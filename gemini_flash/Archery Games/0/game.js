// game.js
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;

    this.player = new Player(this.width / 2, this.height - 50);
    this.targets = [];
    this.arrows = [];

    this.score = 0;
    this.gameStarted = false;

    this.init();
  }

  init() {
    this.canvas.addEventListener("click", (event) => {
      this.shootArrow(event);
    });

    this.gameLoop();
  }

  shootArrow(event) {
    if (this.gameStarted) {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;

      this.arrows.push(new Arrow(this.player.x, this.player.y, mouseX, mouseY));
    }
  }

  generateTargets() {
    const targetCount = Math.floor(Math.random() * 5) + 2;
    for (let i = 0; i < targetCount; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * (this.height / 2);
      this.targets.push(new Target(x, y));
    }
  }

  update() {
    if (this.gameStarted) {
      this.targets.forEach((target, index) => {
        if (target.y > this.height) {
          this.targets.splice(index, 1);
        } else {
          target.update();
        }
      });

      this.arrows.forEach((arrow, index) => {
        if (arrow.x < 0 || arrow.x > this.width || arrow.y < 0 || arrow.y > this.height) {
          this.arrows.splice(index, 1);
        } else {
          arrow.update();

          this.targets.forEach((target, targetIndex) => {
            if (arrow.checkCollision(target)) {
              this.score++;
              this.targets.splice(targetIndex, 1);
              this.arrows.splice(index, 1);
            }
          });
        }
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.player.draw(this.ctx);

    this.targets.forEach((target) => {
      target.draw(this.ctx);
    });

    this.arrows.forEach((arrow) => {
      arrow.draw(this.ctx);
    });

    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(`Score: ${this.score}`, 20, 30);

    if (!this.gameStarted) {
      this.ctx.font = "30px Arial";
      this.ctx.fillText("点击开始游戏", this.width / 2 - 100, this.height / 2);
    }
  }

  gameLoop() {
    if (!this.gameStarted) {
      this.generateTargets();
      this.gameStarted = true;
    }

    this.update();
    this.draw();

    requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
  }

  draw(ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }
}

class Target {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = 2;
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }
}

class Arrow {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 15;
    this.speed = 10;

    const angle = Math.atan2(targetY - y, targetX - x);
    this.velocityX = Math.cos(angle) * this.speed;
    this.velocityY = Math.sin(angle) * this.speed;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }

  checkCollision(target) {
    return (
      this.x + this.width / 2 >= target.x - target.width / 2 &&
      this.x - this.width / 2 <= target.x + target.width / 2 &&
      this.y + this.height / 2 >= target.y - target.height / 2 &&
      this.y - this.height / 2 <= target.y + target.height / 2
    );
  }
}

const canvas = document.getElementById("gameCanvas");
const game = new Game(canvas);