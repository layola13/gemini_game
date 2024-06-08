const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 600;
const canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let doodle = {
  x: canvasWidth / 2,
  y: canvasHeight - 50,
  width: 20,
  height: 20,
  speed: 0,
  jumpPower: 10,
  isJumping: false,
  gravity: 0.5
};

let platforms = [];
let score = 0;

function generatePlatform() {
  const platformWidth = 80;
  const platformHeight = 10;
  const platformX = Math.random() * (canvasWidth - platformWidth);
  const platformY = Math.random() * canvasHeight;
  platforms.push({
    x: platformX,
    y: platformY,
    width: platformWidth,
    height: platformHeight
  });
}

function drawPlatform(platform) {
  ctx.fillStyle = '#000';
  ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
}

function drawDoodle() {
  ctx.fillStyle = '#000';
  ctx.fillRect(doodle.x, doodle.y, doodle.width, doodle.height);
}

function updateDoodle() {
  doodle.speed += doodle.gravity;
  doodle.y += doodle.speed;

  if (doodle.y > canvasHeight) {
    resetGame();
  }

  if (doodle.isJumping) {
    doodle.speed = -doodle.jumpPower;
    doodle.isJumping = false;
  }

  checkPlatformCollision();
}

function checkPlatformCollision() {
  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];

    if (doodle.x + doodle.width > platform.x &&
        doodle.x < platform.x + platform.width &&
        doodle.y + doodle.height > platform.y &&
        doodle.y < platform.y + platform.height) {
      doodle.isJumping = true;
      score++;
      platforms.splice(i, 1);
      break;
    }
  }
}

function updateScore() {
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function resetGame() {
  doodle.x = canvasWidth / 2;
  doodle.y = canvasHeight - 50;
  doodle.speed = 0;
  platforms = [];
  score = 0;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  updateDoodle();
  drawDoodle();

  for (let i = 0; i < platforms.length; i++) {
    drawPlatform(platforms[i]);
  }

  if (platforms.length < 5) {
    generatePlatform();
  }

  updateScore();

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    doodle.isJumping = true;
  }
});

generatePlatform();
gameLoop();