const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const scoreElement = document.getElementById('score');

let score = 0;
let ghosts = [];
let playerPosition = { x: 0, y: 0 };

const gridSize = 10; // 游戏棋盘尺寸

// 初始化游戏棋盘
function initGameBoard() {
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    gameBoard.appendChild(cell);
  }
}

// 生成随机鬼魂
function generateGhost() {
  const randomX = Math.floor(Math.random() * gridSize);
  const randomY = Math.floor(Math.random() * gridSize);
  const ghost = { x: randomX, y: randomY };
  ghosts.push(ghost);
  updateGhostPosition(ghost);
}

// 更新鬼魂位置
function updateGhostPosition(ghost) {
  const cell = gameBoard.querySelector(`[data-index="${ghost.y * gridSize + ghost.x}"]`);
  cell.classList.add('ghost');
}

// 初始化玩家位置
function initPlayerPosition() {
  playerPosition.x = Math.floor(gridSize / 2);
  playerPosition.y = Math.floor(gridSize / 2);
  updatePlayerPosition();
}

// 更新玩家位置
function updatePlayerPosition() {
  const cell = gameBoard.querySelector(`[data-index="${playerPosition.y * gridSize + playerPosition.x}"]`);
  cell.classList.add('player');
}

// 处理玩家移动
function handlePlayerMove(direction) {
  switch (direction) {
    case 'up':
      if (playerPosition.y > 0) {
        playerPosition.y--;
      }
      break;
    case 'down':
      if (playerPosition.y < gridSize - 1) {
        playerPosition.y++;
      }
      break;
    case 'left':
      if (playerPosition.x > 0) {
        playerPosition.x--;
      }
      break;
    case 'right':
      if (playerPosition.x < gridSize - 1) {
        playerPosition.x++;
      }
      break;
  }
  updatePlayerPosition();
  checkCollision();
}

// 检查碰撞
function checkCollision() {
  for (let i = 0; i < ghosts.length; i++) {
    const ghost = ghosts[i];
    if (playerPosition.x === ghost.x && playerPosition.y === ghost.y) {
      // 玩家碰到鬼魂
      alert('你被捉到了！游戏结束！');
      resetGame();
      return;
    }
  }
}

// 重置游戏
function resetGame() {
  score = 0;
  scoreElement.textContent = `分数：${score}`;
  ghosts = [];
  gameBoard.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('ghost', 'player');
  });
  initPlayerPosition();
}

// 开始游戏
startButton.addEventListener('click', () => {
  resetGame();
  for (let i = 0; i < 3; i++) {
    generateGhost();
  }
  // 添加键盘事件监听
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        handlePlayerMove('up');
        break;
      case 'ArrowDown':
        handlePlayerMove('down');
        break;
      case 'ArrowLeft':
        handlePlayerMove('left');
        break;
      case 'ArrowRight':
        handlePlayerMove('right');
        break;
    }
  });
});

// 初始化游戏
initGameBoard();
initPlayerPosition();