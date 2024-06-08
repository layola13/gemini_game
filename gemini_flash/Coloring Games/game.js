const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const colorPalette = document.querySelector('.color-palette');

// 设置画布尺寸
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 定义颜色数组
const colors = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#000000'
];

// 当前选中的颜色
let currentColor = colors[0];

// 鼠标按下状态
let isMouseDown = false;

// 监听鼠标事件
canvas.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  draw(e);
});

canvas.addEventListener('mousemove', (e) => {
  if (isMouseDown) {
    draw(e);
  }
});

canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

// 监听颜色选择
colorPalette.addEventListener('click', (e) => {
  if (e.target.classList.contains('color-box')) {
    currentColor = e.target.style.backgroundColor;
  }
});

// 绘制函数
function draw(e) {
  // 获取鼠标坐标
  const x = e.offsetX;
  const y = e.offsetY;

  // 设置画笔颜色
  ctx.fillStyle = currentColor;

  // 绘制一个圆形
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
}