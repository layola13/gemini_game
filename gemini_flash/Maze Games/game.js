const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

let maze = [];
let player = {
    x: 0,
    y: 0,
    color: 'blue'
};
let goal = {
    x: 0,
    y: 0,
    color: 'green'
};
let isGameStarted = false;

// 迷宫生成函数
function generateMaze(width, height) {
    // ... (具体生成逻辑)
    // 使用递归回溯算法或其他方法生成迷宫
}

// 绘制迷宫函数
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(j * 20, i * 20, 20, 20);
            }
        }
    }
    // 绘制玩家
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x * 20, player.y * 20, 20, 20);
    // 绘制目标
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x * 20, goal.y * 20, 20, 20);
}

// 游戏逻辑
function gameLoop() {
    if (isGameStarted) {
        // ... (处理玩家移动，检测碰撞，判断游戏结束等逻辑)
        drawMaze();
        requestAnimationFrame(gameLoop);
    }
}

// 事件监听
startButton.addEventListener('click', () => {
    isGameStarted = true;
    maze = generateMaze(30, 30); // 生成迷宫
    player.x = 0;
    player.y = 0;
    goal.x = maze[maze.length - 1].length - 1;
    goal.y = maze.length - 1;
    drawMaze();
    gameLoop();
    startButton.disabled = true;
    resetButton.disabled = false;
});

resetButton.addEventListener('click', () => {
    isGameStarted = false;
    startButton.disabled = false;
    resetButton.disabled = true;
    drawMaze(); // 清空画布
});

// 初始化游戏
drawMaze();