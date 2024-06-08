const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let gameState = 'start'; // start, playing, gameOver

// 机器人属性
let robot = {
  x: 100,
  y: 500,
  width: 50,
  height: 50,
  speed: 5,
  img: new Image()
};
robot.img.src = 'robot.png'; // 替换为实际的机器人图片路径

// 障碍物属性
let obstacles = [];
obstacles.push({
  x: 300,
  y: 400,
  width: 50,
  height: 100
});

// 事件监听
document.addEventListener('keydown', handleKeyDown);

// 游戏循环
function gameLoop() {
  requestAnimationFrame(gameLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 根据游戏状态执行相应逻辑
  switch (gameState) {
    case 'start':
      // 显示开始画面
      drawStartScreen();
      break;
    case 'playing':
      // 更新机器人位置
      updateRobot();
      // 绘制机器人
      drawRobot();
      // 绘制障碍物
      drawObstacles();
      // 检查碰撞
      checkCollision();
      break;
    case 'gameOver':
      // 显示游戏结束画面
      drawGameOverScreen();
      break;
  }
}

// 开始游戏
function startGame() {
  gameState = 'playing';
}

// 处理键盘事件
function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowLeft':
      robot.x -= robot.speed;
      break;
    case 'ArrowRight':
      robot.x += robot.speed;
      break;
    case 'ArrowUp':
      robot.y -= robot.speed;
      break;
    case 'ArrowDown':
      robot.y += robot.speed;
      break;
  }
}

// 更新机器人位置
function updateRobot() {
  // 限制机器人移动范围
  if (robot.x < 0) {
    robot.x = 0;
  } else if (robot.x > canvas.width - robot.width) {
    robot.x = canvas.width - robot.width;
  }
  if (robot.y < 0) {
    robot.y = 0;
  } else if (robot.y > canvas.height - robot.height) {
    robot.y = canvas.height - robot.height;
  }
}

// 绘制机器人
function drawRobot() {
  ctx.drawImage(robot.img, robot.x, robot.y, robot.width, robot.height);
}

// 绘制障碍物
function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.fillStyle = 'brown';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// 检查碰撞
function checkCollision() {
  obstacles.forEach(obstacle => {
    if (isCollision(robot, obstacle)) {
      gameState = 'gameOver';
    }
  });
}

// 碰撞检测函数
function isCollision(rect1, rect2) {
  return (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y);
}

// 绘制开始画面
function drawStartScreen() {
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.fillText('救援机器人', canvas.width / 2 - 100, canvas.height / 2 - 50);
  ctx.font = '20px Arial';
  ctx.fillText('按空格键开始游戏', canvas.width / 2 - 100, canvas.height / 2 + 50);
}

// 绘制游戏结束画面
function drawGameOverScreen() {
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.fillText('游戏结束', canvas.width / 2 - 50, canvas.height / 2 - 50);
}

// 开始游戏循环
gameLoop();