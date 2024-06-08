import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Brick } from './brick.js';

// 游戏类
export class PinballGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = 800; // 设置画布宽度
    this.canvas.height = 600; // 设置画布高度

    // 初始化游戏元素
    this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 50, 10, 'red');
    this.paddle = new Paddle(this.canvas.width / 2, this.canvas.height - 20, 80, 10, 'blue');
    this.bricks = this.createBricks();

    // 游戏状态
    this.running = false;
    this.score = 0;
    this.lives = 3;
    this.difficulty = 1; // 初始难度
    this.gameOver = false; // 游戏是否结束

    // 初始化事件监听器
    this.initEventListeners();

    // 绘制游戏开始画面
    this.drawStartScreen();
  }

  // 初始化事件监听器
  initEventListeners() {
    document.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        if (!this.running && !this.gameOver) {
          this.start();
        } else if (this.gameOver) {
          this.restart();
        }
      }
      if (event.key === 'p') { // 按下 'p' 键暂停游戏
        this.pause();
      }
    });
    document.addEventListener('mousemove', (event) => {
      let newX = event.clientX - this.canvas.offsetLeft - this.paddle.width / 2;
      // 限制挡板移动范围
      this.paddle.x = Math.max(0, Math.min(newX, this.canvas.width - this.paddle.width));
    });
  }

  // 创建砖块
  createBricks() {
    const bricks = [];
    const brickWidth = 50;
    const brickHeight = 20;
    const brickGap = 10;
    const brickRows = 5;
    const brickCols = 10;

    for (let row = 0; row < brickRows; row++) {
      for (let col = 0; col < brickCols; col++) {
        bricks.push(this.createBrick(col * (brickWidth + brickGap) + brickGap,
          row * (brickHeight + brickGap) + 50,
          brickWidth,
          brickHeight,
          'green'));
      }
    }
    return bricks;
  }

  // 创建单个砖块
  createBrick(x, y, width, height, color) {
    return new Brick(x, y, width, height, color);
  }

  // 开始游戏
  start() {
    this.running = true;
    // 设置球体初始速度
    this.ball.velocityX = this.difficulty * 5;
    this.ball.velocityY = this.difficulty * -5;
    this.animate();
  }

  // 停止游戏
  stop() {
    this.running = false;
  }

  // 暂停游戏
  pause() {
    if (this.running) {
      this.running = false;
    } else {
      this.running = true;
      this.animate(); // 恢复动画循环
    }
  }

  // 重玩游戏
  restart() {
    this.gameOver = false;
    this.stop();
    this.score = 0;
    this.lives = 3;
    this.bricks = this.createBricks(); // 重新生成砖块
    this.ball.reset(this.canvas.width / 2, this.canvas.height - 50);
    this.ball.velocityX = this.difficulty * 5; // 根据难度调整球速
    this.ball.velocityY = this.difficulty * -5;
    this.drawStartScreen();
  }

  // 更新游戏状态
  update() {
    // 更新弹球位置
    this.ball.update(this.canvas.width, this.canvas.height);

    // 检查弹球与挡板碰撞
    if (this.ball.y + this.ball.radius > this.paddle.y &&
      this.ball.x > this.paddle.x &&
      this.ball.x < this.paddle.x + this.paddle.width) {
      // 计算球体与挡板碰撞点的横坐标
      const relativeIntersectX = (this.paddle.x + (this.paddle.width / 2)) - this.ball.x;
      // 计算反弹角度 (修正后的计算方法)
      const bounceAngle = (relativeIntersectX / (this.paddle.width / 2)) * (Math.PI / 3); // 调整角度范围
      // 更新球体速度
      this.ball.velocityX = this.difficulty * 5 * Math.sin(bounceAngle);
      this.ball.velocityY = this.difficulty * -5 * Math.cos(bounceAngle); 
    }

    // 检查弹球与砖块碰撞
    for (let i = 0; i < this.bricks.length; i++) {
      const brick = this.bricks[i];
      if (brick.isCollided(this.ball)) {
        this.bricks.splice(i, 1);
        this.score += 10;
        this.ball.velocityY = -this.ball.velocityY;
        break;
      }
    }

    // 检查弹球是否掉落
    if (this.ball.y > this.canvas.height) {
      this.lives--;
      this.ball.reset(this.canvas.width / 2, this.canvas.height - 50);
      this.ball.velocityX = this.difficulty * 5; // 根据难度调整球速
      this.ball.velocityY = this.difficulty * -5;
    }

    // 检查游戏是否结束
    if (this.lives === 0) {
      this.gameOver = true;
      this.stop();
      this.drawGameOverScreen(); // 绘制游戏结束画面
    } else if (this.bricks.length === 0) {
      this.gameOver = true;
      this.stop();
      this.drawGameOverScreen(); // 绘制游戏结束画面
    }
  }

  // 绘制游戏画面
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制背景图片
    const backgroundImage = new Image();
    backgroundImage.src = 'images/background.png'; // 替换成实际的图片路径
    this.ctx.drawImage(backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

    // 绘制弹球
    this.ball.draw(this.ctx);

    // 绘制挡板
    this.paddle.draw(this.ctx);

    // 绘制砖块
    this.bricks.forEach(brick => brick.draw(this.ctx));

    // 绘制分数和生命值
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(`分数: ${this.score}`, 10, 30);
    this.ctx.fillText(`生命值: ${this.lives}`, 10, 60);
  }

  // 绘制游戏开始画面
  drawStartScreen() {
    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('按下空格键开始游戏', this.canvas.width / 2 - 150, this.canvas.height / 2);
  }

  // 绘制游戏结束画面
  drawGameOverScreen() {
    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'white';
    if (this.lives === 0) {
      this.ctx.fillText('游戏结束！你输了！', this.canvas.width / 2 - 150, this.canvas.height / 2 - 30);
    } else {
      this.ctx.fillText('游戏结束！你赢了！', this.canvas.width / 2 - 150, this.canvas.height / 2 - 30);
    }
    this.ctx.fillText(`分数: ${this.score}`, this.canvas.width / 2 - 150, this.canvas.height / 2);
    this.ctx.fillText('按下空格键重新开始游戏', this.canvas.width / 2 - 150, this.canvas.height / 2 + 30);
  }

  // 动画循环
  animate() {
    if (this.running) {
      this.update();
      this.draw();
      requestAnimationFrame(() => this.animate());
    }
  }
}

// 初始化游戏
const canvas = document.getElementById('pinballCanvas');
const game = new PinballGame(canvas);