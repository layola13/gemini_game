const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let gameState = 'start'; // start, playing, gameOver

// 玩家数据
const player = {
    x: 100,
    y: 500,
    width: 20,
    height: 40,
    speed: 5,
    health: 100
};

// 敌人数据
const enemies = [];

// 初始化游戏
function initGame() {
    gameState = 'playing';
}

// 更新游戏逻辑
function update() {
    if (gameState === 'playing') {
        // 更新玩家位置
        if (keys.left) {
            player.x -= player.speed;
        }
        if (keys.right) {
            player.x += player.speed;
        }
        // 更新敌人位置
        // ...
    }
}

// 绘制游戏画面
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制玩家
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 绘制敌人
    // ...
}

// 游戏循环
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 键盘事件监听
const keys = {
    left: false,
    right: false
};
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        keys.left = true;
    }
    if (event.key === 'ArrowRight') {
        keys.right = true;
    }
});
document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        keys.left = false;
    }
    if (event.key === 'ArrowRight') {
        keys.right = false;
    }
});

// 初始化游戏
initGame();
// 开始游戏循环
gameLoop();