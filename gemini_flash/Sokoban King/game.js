const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');

// 游戏配置
const gridSize = 40; // 格子大小
const mapWidth = 10; // 地图宽度
const mapHeight = 10; // 地图高度

// 游戏状态
let playerX = 1; // 玩家初始位置 X 坐标
let playerY = 1; // 玩家初始位置 Y 坐标
let boxes = [
    { x: 3, y: 2 },
    { x: 4, y: 2 }
]; // 箱子初始位置
let goals = [
    { x: 3, y: 8 },
    { x: 4, y: 8 }
]; // 目标位置
let gameWon = false; // 游戏是否胜利

// 地图数据
const map = [
    "####################",
    "#.................#",
    "#......##.....##....#",
    "#......##.....##....#",
    "#......##.....##....#",
    "#......##.....##....#",
    "#......##.....##....#",
    "#......##.....##....#",
    "#.................#",
    "####################"
];

// 加载图片
const wallImg = new Image();
wallImg.src = 'wall.png';
const boxImg = new Image();
boxImg.src = 'box.png';
const playerImg = new Image();
playerImg.src = 'player.png';
const goalImg = new Image();
goalImg.src = 'goal.png';

// 初始化游戏
function init() {
    gameWon = false;
    playerX = 1;
    playerY = 1;
    boxes = [
        { x: 3, y: 2 },
        { x: 4, y: 2 }
    ];
    drawGame();
}

// 绘制游戏
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制地图
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (map[y][x] === '#') {
                ctx.drawImage(wallImg, x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }
    }

    // 绘制箱子
    boxes.forEach(box => {
        ctx.drawImage(boxImg, box.x * gridSize, box.y * gridSize, gridSize, gridSize);
    });

    // 绘制目标
    goals.forEach(goal => {
        ctx.drawImage(goalImg, goal.x * gridSize, goal.y * gridSize, gridSize, gridSize);
    });

    // 绘制玩家
    ctx.drawImage(playerImg, playerX * gridSize, playerY * gridSize, gridSize, gridSize);

    // 判断游戏是否胜利
    if (boxes.every((box, index) => box.x === goals[index].x && box.y === goals[index].y)) {
        gameWon = true;
        alert("恭喜你，你赢了！");
    }
}

// 处理玩家移动
function movePlayer(dx, dy) {
    // 检查目标位置是否合法
    const newX = playerX + dx;
    const newY = playerY + dy;
    if (newX < 0 || newX >= mapWidth || newY < 0 || newY >= mapHeight) return;
    if (map[newY][newX] === '#') return;

    // 检查是否有箱子
    const boxIndex = boxes.findIndex(box => box.x === newX && box.y === newY);
    if (boxIndex !== -1) {
        // 检查箱子是否可以移动
        const newBoxX = newX + dx;
        const newBoxY = newY + dy;
        if (newBoxX < 0 || newBoxX >= mapWidth || newBoxY < 0 || newBoxY >= mapHeight) return;
        if (map[newBoxY][newBoxX] === '#') return;

        // 移动箱子
        boxes[boxIndex].x = newBoxX;
        boxes[boxIndex].y = newBoxY;
    }

    // 移动玩家
    playerX = newX;
    playerY = newY;
    drawGame();
}

// 监听键盘事件
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

// 重置游戏
resetButton.addEventListener('click', init);

// 初始化游戏
init();