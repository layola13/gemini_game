const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = 800;
canvas.height = 600;

// 游戏对象
let player = {
  x: 100,
  y: 500,
  width: 50,
  height: 20,
  speed: 5,
  color: 'red'
};

// 更新游戏状态
function update() {
  // 处理玩家输入
  if (keys.left) {
    player.x -= player.speed;
  }
  if (keys.right) {
    player.x += player.speed;
  }

  // 绘制游戏画面
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// 游戏循环
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

// 键盘输入
const keys = {
  left: false,
  right: false
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    keys.left = true;
  }
  if (e.key === 'ArrowRight') {
    keys.right = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') {
    keys.left = false;
  }
  if (e.key === 'ArrowRight') {
    keys.right = false;
  }
});

// 启动游戏
gameLoop();