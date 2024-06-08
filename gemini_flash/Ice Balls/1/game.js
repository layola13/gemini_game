class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.ballRadius = 20;
    this.ballColor = 'blue';
    this.ballX = this.width / 2;
    this.ballY = this.height - this.ballRadius;
    this.ballSpeed = 5;
    this.ballAngle = 0;
    this.isMoving = false;
    this.score = 0;
    this.gameOver = false;
    this.isPaused = false;

    this.targetArea = {
      x: 0,
      y: this.height - this.ballRadius * 2,
      width: this.width,
      height: this.ballRadius * 2
    };

    this.init();
  }

  init() {
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const pauseButton = document.getElementById('pauseButton');

    startButton.addEventListener('click', this.startGame.bind(this));
    restartButton.addEventListener('click', this.restartGame.bind(this));
    pauseButton.addEventListener('click', this.pauseGame.bind(this));

    this.canvas.addEventListener('click', this.handleClick.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  startGame() {
    this.resetGame();
    this.isMoving = true;
    this.update();
    this.draw();

    document.getElementById('startButton').disabled = true;
    document.getElementById('restartButton').disabled = false;
    document.getElementById('pauseButton').disabled = false;
  }

  restartGame() {
    this.resetGame();
    this.startGame();
  }

  pauseGame() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      document.getElementById('pauseButton').textContent = '继续游戏';
    } else {
      document.getElementById('pauseButton').textContent = '暂停游戏';
      this.update();
    }
  }

  resetGame() {
    this.score = 0;
    this.gameOver = false;
    this.isMoving = false;
    this.ballX = this.width / 2;
    this.ballY = this.height - this.ballRadius;
    this.ballAngle = 0;
    document.getElementById('scoreDisplay').textContent = '得分：0';
  }

  handleClick(event) {
    if (!this.isMoving && !this.gameOver && !this.isPaused) {
      this.isMoving = true;
      this.ballAngle = Math.atan2(event.offsetY - this.ballY, event.offsetX - this.ballX);
    }
  }

  handleMouseMove(event) {
    if (this.isMoving || this.isPaused) {
      return;
    }
    this.ballAngle = Math.atan2(event.offsetY - this.ballY, event.offsetX - this.ballX);
  }

  update() {
    if (this.isMoving && !this.isPaused) {
      this.ballX += this.ballSpeed * Math.cos(this.ballAngle);
      this.ballY += this.ballSpeed * Math.sin(this.ballAngle);

      // 边界碰撞检测
      if (this.ballX + this.ballRadius > this.width || this.ballX - this.ballRadius < 0) {
        this.ballAngle = Math.PI - this.ballAngle;
      }
      if (this.ballY - this.ballRadius < 0) {
        this.ballAngle = -this.ballAngle;
      }
      
      // 击中目标检测
      if (this.ballY + this.ballRadius > this.height &&
          this.ballX > this.targetArea.x && 
          this.ballX < this.targetArea.x + this.targetArea.width) {
        this.isMoving = false;
        this.score++;
        document.getElementById('scoreDisplay').textContent = '得分：' + this.score;
      }

      // 游戏结束检测
      if (this.score >= 10) {
        this.gameOver = true;
        alert('恭喜你，游戏结束！你的得分是：' + this.score);
        document.getElementById('restartButton').disabled = false;
        document.getElementById('pauseButton').disabled = true;
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 绘制冰球
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.ballColor;
    this.ctx.fill();

    // 绘制目标区域
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(this.targetArea.x, this.targetArea.y, this.targetArea.width, this.targetArea.height);

    // 游戏结束提示
    if (this.gameOver) {
      this.ctx.font = '30px Arial';
      this.ctx.fillStyle = 'red';
      this.ctx.fillText('游戏结束！', this.width / 2 - 100, this.height / 2);
    }
  }
}

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);