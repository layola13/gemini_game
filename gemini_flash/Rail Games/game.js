const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const canvasWidth = 800;
const canvasHeight = 600;
const trackWidth = 10;
const trackColor = 'black';
const trainSize = 20;
const trainColor = 'red';

// 初始化画布
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// 轨道路径
const trackPath = [
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 200, y: 200 },
    { x: 300, y: 200 },
    { x: 300, y: 100 },
    { x: 400, y: 100 },
    { x: 400, y: 200 },
    { x: 500, y: 200 },
    { x: 500, y: 100 },
    { x: 600, y: 100 },
];

// 火车位置
let trainX = trackPath[0].x;
let trainY = trackPath[0].y;
let currentTrackPoint = 0;

// 绘制轨道路径
function drawTrack() {
    ctx.strokeStyle = trackColor;
    ctx.lineWidth = trackWidth;
    ctx.beginPath();
    ctx.moveTo(trackPath[0].x, trackPath[0].y);
    for (let i = 1; i < trackPath.length; i++) {
        ctx.lineTo(trackPath[i].x, trackPath[i].y);
    }
    ctx.stroke();
}

// 绘制火车
function drawTrain() {
    ctx.fillStyle = trainColor;
    ctx.fillRect(trainX - trainSize / 2, trainY - trainSize / 2, trainSize, trainSize);
}

// 移动火车
function moveTrain() {
    // 检查是否到达终点
    if (currentTrackPoint === trackPath.length - 1) {
        return;
    }

    // 获取下一个轨道路点
    const nextPoint = trackPath[currentTrackPoint + 1];

    // 计算移动距离
    const dx = nextPoint.x - trainX;
    const dy = nextPoint.y - trainY;

    // 缓慢移动火车
    trainX += dx / 10;
    trainY += dy / 10;

    // 如果火车到达下一个轨道路点，则更新当前点
    if (Math.abs(trainX - nextPoint.x) < 1 && Math.abs(trainY - nextPoint.y) < 1) {
        currentTrackPoint++;
    }
}

// 游戏循环
function gameLoop() {
    // 清除画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 绘制游戏元素
    drawTrack();
    drawTrain();

    // 移动火车
    moveTrain();

    // 循环调用游戏循环函数
    requestAnimationFrame(gameLoop);
}

// 启动游戏循环
gameLoop();