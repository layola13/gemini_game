const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏设置
const trackWidth = 800;
const trackHeight = 600;
const carWidth = 50;
const carHeight = 30;
const playerSpeed = 5;

// 玩家数据
let playerX = trackWidth / 2 - carWidth / 2;
let playerY = trackHeight - carHeight - 10;

// 方向控制
let isMovingLeft = false;
let isMovingRight = false;

// 游戏循环
function gameLoop() {
  // 清除画布
  ctx.clearRect(0, 0, trackWidth, trackHeight);

  // 处理玩家移动
  if (isMovingLeft && playerX > 0) {
    playerX -= playerSpeed;
  }
  if (isMovingRight && playerX < trackWidth - carWidth) {
    playerX += playerSpeed;
  }

  // 绘制赛道
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, trackWidth, trackHeight);

  // 绘制玩家车辆
  ctx.fillStyle = 'red';
  ctx.fillRect(playerX, playerY, carWidth, carHeight);

  // 循环调用游戏循环
  requestAnimationFrame(gameLoop);
}

// 监听键盘事件
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    isMovingLeft = true;
  }
  if (event.key === 'ArrowRight') {
    isMovingRight = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft') {
    isMovingLeft = false;
  }
  if (event.key === 'ArrowRight') {
    isMovingRight = false;
  }
});

// 初始化游戏
canvas.width = trackWidth;
canvas.height = trackHeight;
gameLoop();