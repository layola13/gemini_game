const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

let marbles = [];
let gravity = 0.1;
let gameRunning = false;

// 弹珠类
class Marble {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocityX = Math.random() * 5 - 2.5;
        this.velocityY = Math.random() * 5 - 2.5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.velocityY += gravity;
        this.x += this.velocityX;
        this.y += this.velocityY;

        // 反弹
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.velocityX = -this.velocityX;
        }
        if (this.y + this.radius > canvas.height) {
            this.velocityY = -this.velocityY;
            this.y = canvas.height - this.radius;
        }
    }
}

// 开始游戏
startButton.addEventListener('click', () => {
    gameRunning = true;
    startButton.disabled = true;
    createMarbles(20);
    gameLoop();
});

// 创建弹珠
function createMarbles(count) {
    for (let i = 0; i < count; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let radius = Math.random() * 10 + 5;
        let color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        marbles.push(new Marble(x, y, radius, color));
    }
}

// 游戏循环
function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        marbles.forEach(marble => {
            marble.update();
            marble.draw();
        });

        requestAnimationFrame(gameLoop);
    }
}