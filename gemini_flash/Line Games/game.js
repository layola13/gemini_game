const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = 600;
canvas.height = 400;

// 定义线条颜色
const lineColor = 'blue';

// 定义线条宽度
const lineWidth = 5;

// 定义线条数组
let lines = [];

// 定义鼠标点击事件
canvas.addEventListener('click', (event) => {
  // 获取鼠标点击坐标
  const x = event.offsetX;
  const y = event.offsetY;

  // 添加新线条
  lines.push({
    x1: x,
    y1: y,
    x2: x,
    y2: y,
  });
});

// 定义鼠标移动事件
canvas.addEventListener('mousemove', (event) => {
  // 获取鼠标移动坐标
  const x = event.offsetX;
  const y = event.offsetY;

  // 更新最后一条线条的终点坐标
  if (lines.length > 0) {
    lines[lines.length - 1].x2 = x;
    lines[lines.length - 1].y2 = y;
  }
});

// 游戏循环
function gameLoop() {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制线条
  lines.forEach(line => {
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
  });

  // 重新绘制
  requestAnimationFrame(gameLoop);
}

// 开始游戏循环
gameLoop();