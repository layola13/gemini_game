const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏设置
const canvasWidth = 800;
const canvasHeight = 600;
const targetRadius = 50;
const arrowSpeed = 10;
const gravity = 0.2;

// 初始化画布大小
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// 目标位置
let targetX = canvasWidth / 2;
let targetY = canvasHeight / 2;

// 箭的位置和速度
let arrowX = 0;
let arrowY = canvasHeight - 50;
let arrowSpeedX = 0;
let arrowSpeedY = 0;

// 游戏状态
let isShooting = false;

// 事件监听
canvas.addEventListener('mousedown', startShooting);
canvas.addEventListener('mousemove', updateArrowDirection);

// 游戏循环
function gameLoop() {
    // 清除画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 绘制目标
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    // 绘制箭
    if (isShooting) {
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + arrowSpeedX, arrowY + arrowSpeedY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.stroke();

        // 更新箭的速度
        arrowSpeedY += gravity;
        arrowX += arrowSpeedX;
        arrowY += arrowSpeedY;

        // 检查是否击中目标
        if (checkCollision(arrowX, arrowY, targetX, targetY, targetRadius)) {
            isShooting = false;
            // 击中目标的处理
            console.log('击中目标！');
        }
    }

    // 重新绘制
    requestAnimationFrame(gameLoop);
}

// 开始射击
function startShooting(event) {
    isShooting = true;
    // 设置箭的初始速度
    arrowSpeedX = arrowSpeed * Math.cos(Math.atan2(event.offsetY - arrowY, event.offsetX - arrowX));
    arrowSpeedY = arrowSpeed * Math.sin(Math.atan2(event.offsetY - arrowY, event.offsetX - arrowX));
}

// 更新箭的方向
function updateArrowDirection(event) {
    if (!isShooting) {
        // 更新箭的位置
        arrowX = event.offsetX;
        arrowY = event.offsetY;
    }
}

// 检查碰撞
function checkCollision(x1, y1, x2, y2, radius) {
    const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    return distance <= radius;
}

// 开始游戏循环
gameLoop();