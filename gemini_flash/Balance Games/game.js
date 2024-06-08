const platform = document.querySelector('.platform');
const ball = document.querySelector('.ball');
const startButton = document.querySelector('.start-button');

let isGameStarted = false;
let ballX = 0;
let ballY = 0;
let ballSpeedX = 0;
let ballSpeedY = 0;
let gravity = 0.1;

function updateBallPosition() {
  if (isGameStarted) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    ballSpeedY += gravity;
    ball.style.left = ballX + 'px';
    ball.style.bottom = ballY + 'px';
  }
}

function checkCollision() {
  if (isGameStarted) {
    if (ballY <= 0) {
      ballSpeedY = -ballSpeedY * 0.8;
      ballY = 0;
    }
    if (ballX <= 0 || ballX + ball.offsetWidth >= platform.offsetWidth) {
      ballSpeedX = -ballSpeedX * 0.8;
      ballX = Math.max(0, Math.min(ballX, platform.offsetWidth - ball.offsetWidth));
    }
  }
}

function startGame() {
  isGameStarted = true;
  startButton.disabled = true;
  ballSpeedX = 0;
  ballSpeedY = 0;
  ballX = platform.offsetWidth / 2 - ball.offsetWidth / 2;
  ballY = 0;
  ball.style.left = ballX + 'px';
  ball.style.bottom = ballY + 'px';
  setInterval(updateBallPosition, 10);
  setInterval(checkCollision, 10);
}

startButton.addEventListener('click', startGame);

window.addEventListener('mousemove', (event) => {
  if (isGameStarted) {
    const platformCenterX = platform.offsetWidth / 2;
    const mouseX = event.clientX - platform.getBoundingClientRect().left;
    const targetX = Math.max(0, Math.min(mouseX, platform.offsetWidth));
    platform.style.left = targetX - platformCenterX + 'px';
    ballSpeedX = (targetX - ballX) * 0.1;
  }
});