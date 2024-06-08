const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const ballRadius = 10;
const playerRadius = 20;
const ballSpeed = 5;
const playerSpeed = 5;

// 游戏状态
let gameStarted = false;
let playerX = canvas.width / 2;
let playerY = canvas.height - playerRadius;
let ballX = Math.random() * canvas.width;
let ballY = 0;
let ballDX = Math.random() * 2 - 1;
let ballDY = ballSpeed;

// 事件监听
canvas.addEventListener('mousemove', (event) => {
    if (gameStarted) {
        playerX = event.offsetX;
    }
});

// 游戏循环
function gameLoop() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制玩家
    ctx.beginPath();
    ctx.arc(playerX, playerY, playerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();

    // 绘制球
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    // 更新球位置
    ballX += ballDX * ballSpeed;
    ballY += ballDY * ballSpeed;

    // 球碰撞边界
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballDX = -ballDX;
    }
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballDY = -ballDY;
    }

    // 球碰撞玩家
    if (distance(playerX, playerY, ballX, ballY) <= playerRadius + ballRadius) {
        // 重新开始游戏
        resetGame();
    }

    // 继续循环
    requestAnimationFrame(gameLoop);
}

// 开始游戏
function startGame() {
    gameStarted = true;
    gameLoop();
}

// 重置游戏
function resetGame() {
    gameStarted = false;
    playerX = canvas.width / 2;
    playerY = canvas.height - playerRadius;
    ballX = Math.random() * canvas.width;
    ballY = 0;
    ballDX = Math.random() * 2 - 1;
    ballDY = ballSpeed;
}

// 计算两点之间的距离
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// 开始游戏
startGame();