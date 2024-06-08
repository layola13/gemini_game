const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const canvasWidth = 400;
const canvasHeight = 600;
const invaderWidth = 30;
const invaderHeight = 20;
const invaderSpacing = 20;
const invaderRows = 5;
const invaderColumns = 10;
const playerWidth = 50;
const playerHeight = 10;
const playerSpeed = 5;
const bulletSpeed = 5;
const bulletRadius = 5;

// 初始化游戏元素
let player = {
  x: canvasWidth / 2 - playerWidth / 2,
  y: canvasHeight - playerHeight - 10,
  width: playerWidth,
  height: playerHeight,
};
let invaders = [];
let bullets = [];

// 初始化入侵者
for (let i = 0; i < invaderRows; i++) {
  for (let j = 0; j < invaderColumns; j++) {
    invaders.push({
      x: j * (invaderWidth + invaderSpacing),
      y: i * (invaderHeight + invaderSpacing) + 50,
      width: invaderWidth,
      height: invaderHeight,
      alive: true,
    });
  }
}

// 游戏循环
function gameLoop() {
  // 清除画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 更新游戏逻辑
  updatePlayer();
  updateInvaders();
  updateBullets();
  checkCollisions();

  // 渲染游戏元素
  drawPlayer();
  drawInvaders();
  drawBullets();

  // 循环调用 gameLoop
  requestAnimationFrame(gameLoop);
}

// 更新玩家位置
function updatePlayer() {
  if (keys.left && player.x > 0) {
    player.x -= playerSpeed;
  }
  if (keys.right && player.x + player.width < canvasWidth) {
    player.x += playerSpeed;
  }
}

// 更新入侵者位置
function updateInvaders() {
  // 随机移动入侵者
  let direction = Math.random() < 0.5 ? -1 : 1;
  for (let i = 0; i < invaders.length; i++) {
    if (invaders[i].alive) {
      invaders[i].x += direction;
    }
  }
}

// 更新子弹位置
function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bulletSpeed;

    // 删除超出画布的子弹
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }
}

// 检测碰撞
function checkCollisions() {
  // 子弹与入侵者碰撞
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < invaders.length; j++) {
      if (invaders[j].alive && checkCollision(bullets[i], invaders[j])) {
        invaders[j].alive = false;
        bullets.splice(i, 1);
      }
    }
  }
  // 玩家与入侵者碰撞
  for (let i = 0; i < invaders.length; i++) {
    if (invaders[i].alive && checkCollision(player, invaders[i])) {
      // 游戏结束
      alert('游戏结束！');
      return;
    }
  }
}

// 碰撞检测函数
function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// 渲染玩家
function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// 渲染入侵者
function drawInvaders() {
  ctx.fillStyle = 'green';
  for (let i = 0; i < invaders.length; i++) {
    if (invaders[i].alive) {
      ctx.fillRect(
        invaders[i].x,
        invaders[i].y,
        invaders[i].width,
        invaders[i].height
      );
    }
  }
}

// 渲染子弹
function drawBullets() {
  ctx.fillStyle = 'red';
  for (let i = 0; i < bullets.length; i++) {
    ctx.beginPath();
    ctx.arc(bullets[i].x, bullets[i].y, bulletRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 键盘事件监听
const keys = {};
document.addEventListener('keydown', function (e) {
  keys[e.code] = true;
  if (e.code === 'Space') {
    fireBullet();
  }
});
document.addEventListener('keyup', function (e) {
  keys[e.code] = false;
});

// 发射子弹
function fireBullet() {
  bullets.push({
    x: player.x + player.width / 2 - bulletRadius,
    y: player.y,
    radius: bulletRadius,
  });
}

// 设置画布尺寸
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// 开始游戏循环
gameLoop();