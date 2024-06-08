const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameRunning = false;

// 金块
const goldPieces = [];
const goldImage = new Image();
goldImage.src = 'gold.png'; // 替换为您的金块图片路径

// 玩家
const player = {
    x: 100,
    y: 300,
    width: 30,
    height: 30,
    speed: 5,
    image: new Image(),
};
player.image.src = 'player.png'; // 替换为您的玩家图片路径

// 生成金块
function generateGold() {
    const x = Math.random() * (canvas.width - 50) + 25;
    const y = Math.random() * (canvas.height - 50) + 25;
    goldPieces.push({
        x,
        y,
        radius: 15,
        collected: false,
    });
}

// 更新游戏状态
function updateGame() {
    if (!gameRunning) return;

    // 移动玩家
    if (keys.left && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.right && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (keys.up && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.down && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }

    // 检查玩家是否收集金块
    goldPieces.forEach((gold, index) => {
        if (!gold.collected && player.x < gold.x + gold.radius && player.x + player.width > gold.x - gold.radius &&
            player.y < gold.y + gold.radius && player.y + player.height > gold.y - gold.radius) {
            gold.collected = true;
            score++;
            scoreDisplay.textContent = score;
        }
    });

    // 移除已收集的金块
    goldPieces.forEach((gold, index) => {
        if (gold.collected) {
            goldPieces.splice(index, 1);
        }
    });

    // 生成新的金块
    if (goldPieces.length < 5) {
        generateGold();
    }
}

// 绘制游戏
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制玩家
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

    // 绘制金块
    goldPieces.forEach(gold => {
        ctx.drawImage(goldImage, gold.x - gold.radius, gold.y - gold.radius, gold.radius * 2, gold.radius * 2);
    });
}

// 键盘控制
const keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

// 游戏循环
function gameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// 开始游戏
startButton.addEventListener('click', () => {
    gameRunning = true;
    startButton.disabled = true;
    restartButton.disabled = false;
    score = 0;
    scoreDisplay.textContent = score;
    goldPieces.length = 0;
    generateGold();
    gameLoop();
});

// 重新开始游戏
restartButton.addEventListener('click', () => {
    gameRunning = false;
    startButton.disabled = false;
    restartButton.disabled = true;
    score = 0;
    scoreDisplay.textContent = score;
    goldPieces.length = 0;
    player.x = 100;
    player.y = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});