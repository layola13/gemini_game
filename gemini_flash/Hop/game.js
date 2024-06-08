const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const blockSize = 50;
const gravity = 0.5;
const jumpForce = 10;

let player = {
  x: canvas.width / 2,
  y: canvas.height - blockSize,
  width: blockSize,
  height: blockSize,
  velocityY: 0
};

let platforms = [];

function createPlatforms() {
  platforms.push({
    x: canvas.width / 2 - blockSize / 2,
    y: canvas.height - blockSize,
    width: blockSize,
    height: blockSize
  });

  for (let i = 0; i < 10; i++) {
    let x = Math.random() * (canvas.width - blockSize) + blockSize / 2;
    let y = platforms[i - 1].y - blockSize - Math.random() * blockSize * 2;
    platforms.push({
      x: x,
      y: y,
      width: blockSize,
      height: blockSize
    });
  }
}

function drawPlayer() {
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = 'brown';
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}

function updatePlayer() {
  player.velocityY += gravity;
  player.y += player.velocityY;
}

function checkCollision() {
  platforms.forEach(platform => {
    if (player.x + player.width > platform.x &&
        player.x < platform.x + platform.width &&
        player.y + player.height > platform.y &&
        player.y < platform.y + platform.height) {
      player.velocityY = 0;
      player.y = platform.y - player.height;
    }
  });
}

function jump() {
  player.velocityY = -jumpForce;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlatforms();
  drawPlayer();
  updatePlayer();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    jump();
  }
});

createPlatforms();
gameLoop();