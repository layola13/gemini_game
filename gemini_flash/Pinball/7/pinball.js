// pinball.js

export class Pinball {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    // 游戏参数
    this.ballRadius = 10;
    this.ballX = canvas.width / 2;
    this.ballY = canvas.height - 30;
    this.ballSpeedX = 2; // 降低球的速度
    this.ballSpeedY = -2; // 降低球的速度
    this.paddleWidth = 120; // 增加球拍的宽度
    this.paddleHeight = 10;
    this.paddleX = (canvas.width - this.paddleWidth) / 2;
    this.paddleY = canvas.height - 20;
    this.rightPressed = false;
    this.leftPressed = false;

    // 游戏状态
    this.score = 0;
    this.lives = 3;
    this.gameRunning = false;

    // 障碍物
    this.obstacles = [
      { x: 150, y: 150, width: 60, height: 20 },
      { x: 350, y: 250, width: 80, height: 30 },
      { x: 550, y: 300, width: 50, height: 20 } // 增加障碍物
    ];

    // 加载背景图片
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'background.png'; // 替换为你的背景图片路径
    this.backgroundImage.onload = () => {
      this.drawBackground(); // 图片加载完成后绘制背景
    };
    // 处理图片加载失败
    this.backgroundImage.onerror = () => {
      console.error("背景图片加载失败！");
      // 设置默认背景颜色
      this.ctx.fillStyle = "#eee";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };

    // 监听键盘事件
    document.addEventListener('keydown', this.keyDownHandler.bind(this));
    document.addEventListener('keyup', this.keyUpHandler.bind(this));

    // 添加音效
    this.paddleHitSound = new Audio('paddle_hit.wav'); // 球拍击球音效
    this.obstacleHitSound = new Audio('obstacle_hit.wav'); // 障碍物碰撞音效
    this.gameOverSound = new Audio('game_over.wav'); // 游戏结束音效
  }

  // 键盘按下事件处理
  keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  // 键盘抬起事件处理
  keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  // 更新游戏逻辑
  update() {
    // 更新球的位置
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    // 球碰到左右边界反弹
    if (this.ballX + this.ballRadius > this.canvas.width || this.ballX - this.ballRadius < 0) {
      this.ballSpeedX = -this.ballSpeedX;
    }

    // 球碰到顶部反弹
    if (this.ballY - this.ballRadius < 0) {
      this.ballSpeedY = -this.ballSpeedY;
    }

    // 球碰到球拍
    if (this.ballY + this.ballRadius > this.paddleY && this.ballX > this.paddleX && this.ballX < this.paddleX + this.paddleWidth) {
      this.ballSpeedY = -this.ballSpeedY;
      this.score++;
      this.paddleHitSound.play(); // 播放球拍击球音效
    }

    // 球碰到障碍物
    this.obstacles.forEach(obstacle => {
      if (this.checkCollision(this.ballX, this.ballY, this.ballRadius, obstacle)) {
        this.handleObstacleCollision(obstacle);
      }
    });

    // 球碰到底部边界，生命值减一
    if (this.ballY + this.ballRadius > this.canvas.height) {
      this.lives--;
      this.resetBall();
    }

    // 更新球拍位置
    if (this.rightPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
      this.paddleX += 7;
    } else if (this.leftPressed && this.paddleX > 0) {
      this.paddleX -= 7;
    }

    // 游戏结束
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  // 检查碰撞
  checkCollision(x, y, radius, obstacle) {
    return (
      x + radius > obstacle.x &&
      x - radius < obstacle.x + obstacle.width &&
      y + radius > obstacle.y &&
      y - radius < obstacle.y + obstacle.height
    );
  }

  // 处理障碍物碰撞
  handleObstacleCollision(obstacle) {
    // 简单的反弹实现
    if (this.ballX < obstacle.x || this.ballX > obstacle.x + obstacle.width) {
      this.ballSpeedX = -this.ballSpeedX;
    } else {
      this.ballSpeedY = -this.ballSpeedY;
    }
    this.score += 10; // 击中障碍物加分
    this.obstacleHitSound.play(); // 播放障碍物碰撞音效

    // 障碍物被击中后消失
    const index = this.obstacles.indexOf(obstacle);
    if (index > -1) {
      this.obstacles.splice(index, 1);
    }
  }

  // 重置球的位置
  resetBall() {
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height - 30;
    this.ballSpeedX = 3; // 降低球的速度
    this.ballSpeedY = -3; // 降低球的速度
  }

  // 游戏结束
  gameOver() {
    // 停止游戏循环
    cancelAnimationFrame(this.animationId);

    // 显示游戏结束信息
    gameOverElement.style.display = 'flex';
    finalScoreElement.textContent = this.score;
    this.gameOverSound.play(); // 播放游戏结束音效
  }

  // 绘制游戏画面
  draw() {
    // 绘制背景图片
    this.drawBackground();

    // 绘制球
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'red'; // 修改球的颜色
    this.ctx.fill();
    this.ctx.closePath();

    // 绘制球拍
    this.ctx.beginPath();
    this.ctx.rect(this.paddleX, this.paddleY, this.paddleWidth, this.paddleHeight);
    this.ctx.fillStyle = 'blue';
    this.ctx.fill();
    this.ctx.closePath();

    // 绘制障碍物
    this.obstacles.forEach((obstacle, index) => {
      this.ctx.beginPath();
      this.ctx.rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      // 使用不同的颜色绘制障碍物
      const colors = ['blue', 'orange', 'green', 'purple', 'yellow'];
      this.ctx.fillStyle = colors[index % colors.length]; 
      this.ctx.fill();
      this.ctx.closePath();
    });
  }

  // 绘制背景
  drawBackground() {
    if (this.backgroundImage.complete) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // 开始游戏
  start() {
    // 初始化游戏状态
    this.gameRunning = true;
    this.resetGame(); // 使用 resetGame 初始化游戏状态

    // 开始游戏循环
    this.animationId = requestAnimationFrame(gameLoop);
  }

  // 重置游戏
  resetGame() {
    this.resetBall();
    this.score = 0;
    this.lives = 3;
    this.gameRunning = false;
    scoreElement.textContent = this.score;
    livesElement.textContent = this.lives;
  }
}