const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 游戏状态
let gameRunning = false;
let playerCar = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 50,
    height: 25,
    speed: 0,
    maxSpeed: 10,
    acceleration: 0.2,
    deceleration: 0.1
};

// 键盘输入
let keys = {
    left: false,
    right: false,
    up: false,
    down: false
};

// 监听键盘输入
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'ArrowRight':
            keys.right = true;
            break;
        case 'ArrowUp':
            keys.up = true;
            break;
        case 'ArrowDown':
            keys.down = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'ArrowUp':
            keys.up = false;
            break;
        case 'ArrowDown':
            keys.down = false;
            break;
    }
});

// 游戏循环
function gameLoop() {
    if (gameRunning) {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 更新玩家汽车
        updatePlayerCar();

        // 绘制玩家汽车
        drawPlayerCar();

        // 渲染游戏
        requestAnimationFrame(gameLoop);
    }
}

// 更新玩家汽车
function updatePlayerCar() {
    // 加速
    if (keys.up) {
        playerCar.speed += playerCar.acceleration;
        if (playerCar.speed > playerCar.maxSpeed) {
            playerCar.speed = playerCar.maxSpeed;
        }
    } else {
        // 减速
        playerCar.speed -= playerCar.deceleration;
        if (playerCar.speed < 0) {
            playerCar.speed = 0;
        }
    }

    // 左移
    if (keys.left) {
        playerCar.x -= playerCar.speed;
    }

    // 右移
    if (keys.right) {
        playerCar.x += playerCar.speed;
    }

    // 限制汽车位置
    if (playerCar.x < 0) {
        playerCar.x = 0;
    } else if (playerCar.x > canvas.width - playerCar.width) {
        playerCar.x = canvas.width - playerCar.width;
    }
}

// 绘制玩家汽车
function drawPlayerCar() {
    ctx.fillStyle = 'red';
    ctx.fillRect(playerCar.x, playerCar.y, playerCar.width, playerCar.height);
}

// 开始游戏
function startGame() {
    gameRunning = true;
    requestAnimationFrame(gameLoop);
}

// 结束游戏
function endGame() {
    gameRunning = false;
}

// 初始化游戏
startGame();