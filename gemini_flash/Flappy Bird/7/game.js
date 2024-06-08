// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 500;

// 常量
const BIRD_RADIUS = 15;
const BIRD_JUMP_VELOCITY = -8; // 更符合物理意义的命名
const PIPE_WIDTH = 50;
const PIPE_SPEED = 2;
const PIPE_MIN_GAP = 120; // 最小管道间距，调整为更合理的值
const INVINCIBLE_TIME = 100; // 无敌时间

let score = 0;
let gameState = 'start'; // 游戏状态: start, running, gameover, paused
let gameStartTime = 0; // 游戏开始时间，用于控制难度
let difficulty = 'medium'; // 难度等级

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const finalScore = document.getElementById('finalScore');
const currentScore = document.getElementById('currentScore');
const difficultySelect = document.getElementById('difficulty');
const tutorial = document.getElementById('tutorial');

class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = BIRD_RADIUS;
    this.velocity = 0;
    this.gravity = 0.5;
    this.jumpForce = BIRD_JUMP_VELOCITY;
    this.isInvulnerable = false; // 是否无敌
    this.invulnerabilityTimer = 0; // 无敌时间计数器
    this.wingAngle = 0; // 翅膀角度
    this.wingAnimationTimer = 0; // 翅膀动画计时器
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // 更新无敌状态
    if (this.isInvulnerable) {
      this.invulnerabilityTimer++;
      if (this.invulnerabilityTimer >= INVINCIBLE_TIME) { // 无敌时间结束
        this.isInvulnerable = false;
        this.invulnerabilityTimer = 0;
      }
    }

    // 更新翅膀动画
    this.wingAnimationTimer++;
    if (this.wingAnimationTimer >= 5) { // 每5帧更新一次翅膀角度
      this.wingAnimationTimer = 0;
      this.wingAngle = (this.wingAngle + 10) % 360;
    }
  }

  jump() {
    this.velocity = this.jumpForce;
  }

  draw(ctx) {
    // 绘制小鸟身体
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    if (this.isInvulnerable) {
      ctx.fillStyle = 'pink'; // 无敌状态下改变颜色
    } else {
      ctx.fillStyle = 'yellow';
    }
    ctx.fill();

    // 绘制翅膀
    ctx.save(); // 保存当前状态
    ctx.translate(this.x + 10, this.y - 5); // 将坐标系移动到翅膀的位置
    ctx.rotate(this.wingAngle * Math.PI / 180); // 旋转翅膀
    ctx.fillStyle = 'brown';
    ctx.fillRect(0, 0, 10, 5); // 绘制左翅膀
    ctx.fillRect(15, 0, 10, 5); // 绘制右翅膀
    ctx.restore(); // 恢复到之前状态
  }
}

class Pipe {
  constructor(x, height, gap) {
    this.x = x;
    this.height = height;
    this.width = PIPE_WIDTH;
    this.gap = gap;
    this.speed = PIPE_SPEED;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = 'green';

    // 上面管道
    ctx.fillRect(this.x, 0, this.width, this.height);

    // 下面管道
    ctx.fillRect(this.x, this.height + this.gap, this.width, canvas.height - this.height - this.gap);
  }
}

const bird = new Bird(50, canvas.height / 2);

function generatePipe() {
  // 动态调整管道间距
  let gap = 150;
  if (difficulty === 'medium') {
    gap -= Math.floor((Date.now() / 1000 - gameStartTime) * 0.15); // 每秒缩小0.15
  } else if (difficulty === 'hard') {
    gap -= Math.floor((Date.now() / 1000 - gameStartTime) * 0.3); // 每秒缩小0.3
  }
  gap = Math.max(gap, PIPE_MIN_GAP); // 确保管道间距不小于最小值
  const height = Math.random() * (canvas.height - bird.radius * 2 - gap) + bird.radius;
  pipes.push(new Pipe(canvas.width, height, gap));
}

function handleInput(event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    if (gameState === 'running') {
      bird.jump();
    } else if (gameState === 'start') {
      // 开始游戏
      gameState = 'running';
      startScreen.style.display = 'none';
      tutorial.style.display = 'none';
      gameStartTime = Date.now() / 1000;
      generatePipe();
      update();
    } else if (gameState === 'paused') {
      gameState = 'running';
      update(); // 继续游戏
    }
  } else if (event.code === 'KeyP') { // 按下P键暂停/继续游戏
    if (gameState === 'running') {
      gameState = 'paused';
    } else if (gameState === 'paused') {
      gameState = 'running';
      update();
    }
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === 'running') {
    bird.update();
    bird.draw(ctx);

    for (let i = 0; i < pipes.length; i++) {
      pipes[i].update();
      pipes[i].draw(ctx);

      if (pipes[i].x + pipes[i].width < 0) {
        pipes.splice(i, 1);
      }

      if (pipes[i].x === bird.x) {
        score++;
        currentScore.textContent = score; // 实时更新分数显示
      }

      // 碰撞检测
      if (checkCollision(bird, pipes[i])) {
        if (!bird.isInvulnerable) { // 只有非无敌状态下才会判定碰撞
          gameState = 'gameover';
          gameOverScreen.style.display = 'block';
          finalScore.textContent = score;
          return;
        }
      }
    }

    if (pipes[pipes.length - 1].x < canvas.width / 2) {
      generatePipe();
    }
  }

  requestAnimationFrame(update);
}

function checkCollision(bird, pipe) {
  // 使用矩形碰撞检测
  return (
    bird.x + bird.radius > pipe.x &&
    bird.x < pipe.x + pipe.width &&
    (
      bird.y < pipe.height ||
      bird.y + bird.radius > pipe.height + pipe.gap
    )
  );
}

function resetGame() {
  bird.x = 50;
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  bird.isInvulnerable = false; // 重置无敌状态
  pipes.length = 0;
  score = 0;
  currentScore.textContent = 0; // 重置分数显示
  gameState = 'start';
  gameStartTime = Date.now() / 1000; // 记录游戏开始时间
  startScreen.style.display = 'block';
  gameOverScreen.style.display = 'none';
  tutorial.style.display = 'block'; // 显示新手引导
}

document.addEventListener('keydown', handleInput);
startButton.addEventListener('click', () => {
  difficulty = difficultySelect.value;
  gameState = 'running';
  startScreen.style.display = 'none';
  tutorial.style.display = 'none';
  generatePipe(); // 生成第一个管道
  update();
});
restartButton.addEventListener('click', resetGame);