const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏变量
let player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 20,
  speed: 5,
  direction: 'right',
  health: 100
};

let enemies = [];
let enemySpeed = 2;

// 子弹
let bullets = [];
let bulletSpeed = 10;

// 游戏状态
let gameRunning = false;

// 事件监听器
document.addEventListener('keydown', handleKeyDown);

// 游戏循环
function gameLoop() {
  if (gameRunning) {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 移动玩家
    movePlayer();

    // 生成敌人
    generateEnemies();

    // 移动敌人
    moveEnemies();

    // 渲染玩家
    drawPlayer();

    // 渲染敌人
    drawEnemies();

    // 渲染子弹
    drawBullets();

    // 检查碰撞
    checkCollisions();

    // 更新子弹位置
    updateBullets();

    // 检查游戏结束
    checkGameOver();

    // 循环
    requestAnimationFrame(gameLoop);
  }
}

// 开始游戏
function startGame() {
  gameRunning = true;
  gameLoop();
}

// 结束游戏
function endGame() {
  gameRunning = false;
  alert('游戏结束！');
}

// 处理键盘按下事件
function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowLeft':
      player.direction = 'left';
      break;
    case 'ArrowRight':
      player.direction = 'right';
      break;
    case 'Space':
      shootBullet();
      break;
  }
}

// 移动玩家
function movePlayer() {
  if (player.direction === 'left' && player.x > 0) {
    player.x -= player.speed;
  } else if (player.direction === 'right' && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
}

// 生成敌人
function generateEnemies() {
  if (Math.random() < 0.01) {
    enemies.push({
      x: Math.random() * canvas.width,
      y: 0,
      width: 30,
      height: 15,
      health: 50
    });
  }
}

// 移动敌人
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemySpeed;
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });
}

// 渲染玩家
function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// 渲染敌人
function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.fillStyle = 'red';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// 渲染子弹
function drawBullets() {
  bullets.forEach(bullet => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bullet.x, bullet.y, 5, 5);
  });
}

// 发射子弹
function shootBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    speed: bulletSpeed
  });
}

// 更新子弹位置
function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

// 检查碰撞
function checkCollisions() {
  // 子弹与敌人碰撞
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (isCollision(bullet, enemy)) {
        bullets.splice(bulletIndex, 1);
        enemy.health -= 20;
        if (enemy.health <= 0) {
          enemies.splice(enemyIndex, 1);
        }
      }
    });
  });

  // 敌人与玩家碰撞
  enemies.forEach((enemy, enemyIndex) => {
    if (isCollision(player, enemy)) {
      player.health -= 10;
      enemies.splice(enemyIndex, 1);
    }
  });
}

// 检查游戏结束
function checkGameOver() {
  if (player.health <= 0) {
    endGame();
  }
}

// 碰撞检测函数
function isCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// 开始游戏
startGame();