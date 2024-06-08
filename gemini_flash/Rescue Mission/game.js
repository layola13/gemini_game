const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let gameState = 'start'; // start, playing, gameOver

// 游戏对象
let player;
let obstacles = [];
let targets = [];

// 初始化游戏
function init() {
  player = {
    x: 100,
    y: 500,
    width: 50,
    height: 50,
    speed: 5,
    color: 'blue'
  };

  // 生成障碍物
  for (let i = 0; i < 10; i++) {
    obstacles.push({
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * (canvas.height - 50),
      width: 50,
      height: 50,
      color: 'red'
    });
  }

  // 生成目标
  for (let i = 0; i < 5; i++) {
    targets.push({
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * (canvas.height - 50),
      width: 30,
      height: 30,
      color: 'green'
    });
  }
}

// 更新游戏逻辑
function update() {
  // 处理玩家移动
  if (gameState === 'playing') {
    if (keys.left) {
      player.x -= player.speed;
    }
    if (keys.right) {
      player.x += player.speed;
    }
    if (keys.up) {
      player.y -= player.speed;
    }
    if (keys.down) {
      player.y += player.speed;
    }
  }

  // 检查碰撞
  checkCollisions();

  // 检查是否完成任务
  checkTargets();
}

// 绘制游戏画面
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制玩家
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 绘制障碍物
  obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  // 绘制目标
  targets.forEach(target => {
    ctx.fillStyle = target.color;
    ctx.fillRect(target.x, target.y, target.width, target.height);
  });

  // 显示游戏状态
  if (gameState === 'start') {
    ctx.font = '30px Arial';
    ctx.fillText('按下空格键开始游戏', 100, 200);
  } else if (gameState === 'gameOver') {
    ctx.font = '30px Arial';
    ctx.fillText('游戏结束！', 100, 200);
  }
}

// 检查碰撞
function checkCollisions() {
  // 检查玩家与障碍物碰撞
  obstacles.forEach(obstacle => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameState = 'gameOver';
    }
  });
}

// 检查是否完成任务
function checkTargets() {
  // 检查玩家是否收集到所有目标
  if (targets.length === 0) {
    gameState = 'gameOver';
  }
}

// 键盘事件监听
let keys = {};
document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (gameState === 'start' && e.key === ' ') {
    gameState = 'playing';
  }
});
document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

// 游戏循环
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// 初始化游戏并开始游戏循环
init();
gameLoop();