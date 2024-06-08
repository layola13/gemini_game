const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 600;
const canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// 冰球
const puck = {
  x: canvasWidth / 2,
  y: canvasHeight / 2,
  radius: 15,
  speed: 5,
  angle: 0,
  dx: 0,
  dy: 0,
};

// 球杆
const stick = {
  x: canvasWidth / 2,
  y: canvasHeight - 50,
  width: 80,
  height: 10,
  angle: 0,
};

// 玩家分数
let score = 0;

// 游戏状态
let isPlaying = false;

// 初始化游戏
function init() {
  puck.x = canvasWidth / 2;
  puck.y = canvasHeight / 2;
  puck.dx = 0;
  puck.dy = 0;
  score = 0;
  isPlaying = false;
}

// 更新游戏逻辑
function update() {
  if (isPlaying) {
    // 更新冰球位置
    puck.x += puck.dx;
    puck.y += puck.dy;

    // 冰球碰撞边界
    if (puck.x + puck.radius > canvasWidth || puck.x - puck.radius < 0) {
      puck.dx = -puck.dx;
    }
    if (puck.y + puck.radius > canvasHeight || puck.y - puck.radius < 0) {
      puck.dy = -puck.dy;
    }

    // 冰球碰撞球杆
    if (puck.x > stick.x - stick.width / 2 &&
        puck.x < stick.x + stick.width / 2 &&
        puck.y + puck.radius > stick.y) {
      // 计算碰撞角度
      puck.angle = Math.atan2(puck.y - stick.y, puck.x - stick.x);

      // 计算冰球速度
      puck.dx = puck.speed * Math.cos(puck.angle);
      puck.dy = puck.speed * Math.sin(puck.angle);
    }
  }
}

// 渲染游戏画面
function render() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 渲染冰球
  ctx.beginPath();
  ctx.arc(puck.x, puck.y, puck.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();

  // 渲染球杆
  ctx.beginPath();
  ctx.rect(stick.x - stick.width / 2, stick.y, stick.width, stick.height);
  ctx.fillStyle = 'brown';
  ctx.fill();

  // 渲染分数
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('分数: ' + score, 10, 30);
}

// 处理鼠标事件
canvas.addEventListener('mousemove', (event) => {
  // 更新球杆位置
  stick.x = event.offsetX;
});

// 处理点击事件
canvas.addEventListener('click', () => {
  if (!isPlaying) {
    isPlaying = true;
  }
});

// 游戏循环
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// 初始化游戏
init();

// 启动游戏循环
gameLoop();