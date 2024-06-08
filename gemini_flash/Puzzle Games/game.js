const board = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');

// 游戏配置
const gridSize = 4; // 网格大小
const shuffleCount = 100; // 洗牌次数

// 初始化游戏
let tiles = [];
let emptyTileIndex = gridSize * gridSize - 1;
let isGameStarted = false;

// 创建游戏网格
function createBoard() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    let tile = document.createElement('div');
    tile.classList.add('tile');
    tile.textContent = i + 1;
    tile.dataset.index = i;

    if (i === emptyTileIndex) {
      tile.classList.add('empty');
    }

    tile.addEventListener('click', handleTileClick);
    board.appendChild(tile);
    tiles.push(tile);
  }
}

// 处理点击事件
function handleTileClick(event) {
  if (!isGameStarted) {
    startGame();
  }

  const clickedTileIndex = parseInt(event.target.dataset.index);
  const emptyTileIndex = findEmptyTileIndex();

  // 检查是否可以移动
  if (canMove(clickedTileIndex, emptyTileIndex)) {
    // 交换瓷砖
    swapTiles(clickedTileIndex, emptyTileIndex);

    // 检查是否已完成
    if (isGameCompleted()) {
      alert("恭喜你，你完成了游戏！")
    }
  }
}

// 检查是否可以移动
function canMove(clickedTileIndex, emptyTileIndex) {
  const rowDiff = Math.abs(Math.floor(clickedTileIndex / gridSize) - Math.floor(emptyTileIndex / gridSize));
  const colDiff = Math.abs(clickedTileIndex % gridSize - emptyTileIndex % gridSize);
  return (rowDiff + colDiff === 1);
}

// 交换瓷砖
function swapTiles(clickedTileIndex, emptyTileIndex) {
  tiles[clickedTileIndex].textContent = tiles[emptyTileIndex].textContent;
  tiles[emptyTileIndex].textContent = '';
  tiles[emptyTileIndex].classList.add('empty');
  tiles[clickedTileIndex].classList.remove('empty');
}

// 查找空瓷砖的索引
function findEmptyTileIndex() {
  return tiles.findIndex(tile => tile.classList.contains('empty'));
}

// 开始游戏
function startGame() {
  shuffleTiles();
  isGameStarted = true;
}

// 洗牌
function shuffleTiles() {
  for (let i = 0; i < shuffleCount; i++) {
    let randomIndex = Math.floor(Math.random() * (gridSize * gridSize - 1));
    if (canMove(randomIndex, emptyTileIndex)) {
      swapTiles(randomIndex, emptyTileIndex);
    }
  }
}

// 检查游戏是否完成
function isGameCompleted() {
  for (let i = 0; i < gridSize * gridSize - 1; i++) {
    if (parseInt(tiles[i].textContent) !== i + 1) {
      return false;
    }
  }
  return true;
}

// 重置游戏
function resetGame() {
  tiles.forEach(tile => {
    tile.textContent = '';
    tile.classList.remove('empty');
  });
  emptyTileIndex = gridSize * gridSize - 1;
  tiles[emptyTileIndex].classList.add('empty');
  isGameStarted = false;
}

// 初始化游戏
createBoard();
resetButton.addEventListener('click', resetGame);