const board = document.getElementById('game-board');
const scoreValue = document.getElementById('score-value');

// 宝石类型
const gems = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

// 游戏配置
const boardWidth = 8;
const boardHeight = 8;

// 分数
let score = 0;

// 创建游戏面板
function createBoard() {
  for (let i = 0; i < boardHeight; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < boardWidth; j++) {
      const gem = document.createElement('div');
      gem.classList.add('gem');
      gem.style.backgroundColor = getRandomGem();
      gem.dataset.row = i;
      gem.dataset.col = j;
      row.appendChild(gem);
    }
    board.appendChild(row);
  }
}

// 随机生成宝石颜色
function getRandomGem() {
  return gems[Math.floor(Math.random() * gems.length)];
}

// 检查是否匹配
function checkMatches() {
  // 检查水平方向
  for (let i = 0; i < boardHeight; i++) {
    for (let j = 0; j < boardWidth - 2; j++) {
      if (checkMatch(i, j, 'horizontal')) {
        removeGems(i, j, 'horizontal');
      }
    }
  }

  // 检查垂直方向
  for (let i = 0; i < boardHeight - 2; i++) {
    for (let j = 0; j < boardWidth; j++) {
      if (checkMatch(i, j, 'vertical')) {
        removeGems(i, j, 'vertical');
      }
    }
  }
}

// 检查是否匹配，并返回匹配的宝石数量
function checkMatch(row, col, direction) {
  let matchCount = 1;
  let currentGem = document.querySelector(`.gem[data-row="${row}"][data-col="${col}"]`).style.backgroundColor;
  let nextGem;

  if (direction === 'horizontal') {
    for (let j = col + 1; j < boardWidth; j++) {
      nextGem = document.querySelector(`.gem[data-row="${row}"][data-col="${j}"]`).style.backgroundColor;
      if (nextGem === currentGem) {
        matchCount++;
      } else {
        break;
      }
    }
  } else if (direction === 'vertical') {
    for (let i = row + 1; i < boardHeight; i++) {
      nextGem = document.querySelector(`.gem[data-row="${i}"][data-col="${col}"]`).style.backgroundColor;
      if (nextGem === currentGem) {
        matchCount++;
      } else {
        break;
      }
    }
  }

  return matchCount >= 3;
}

// 删除匹配的宝石
function removeGems(row, col, direction) {
  let matchCount = 1;
  let currentGem = document.querySelector(`.gem[data-row="${row}"][data-col="${col}"]`).style.backgroundColor;
  let nextGem;

  if (direction === 'horizontal') {
    for (let j = col + 1; j < boardWidth; j++) {
      nextGem = document.querySelector(`.gem[data-row="${row}"][data-col="${j}"]`).style.backgroundColor;
      if (nextGem === currentGem) {
        matchCount++;
        document.querySelector(`.gem[data-row="${row}"][data-col="${j}"]`).remove();
      } else {
        break;
      }
    }
  } else if (direction === 'vertical') {
    for (let i = row + 1; i < boardHeight; i++) {
      nextGem = document.querySelector(`.gem[data-row="${i}"][data-col="${col}"]`).style.backgroundColor;
      if (nextGem === currentGem) {
        matchCount++;
        document.querySelector(`.gem[data-row="${i}"][data-col="${col}"]`).remove();
      } else {
        break;
      }
    }
  }

  // 删除起始宝石
  document.querySelector(`.gem[data-row="${row}"][data-col="${col}"]`).remove();

  // 更新分数
  score += matchCount * 10;
  scoreValue.textContent = score;

  // 下落宝石
  fallGems();
}

// 宝石下落
function fallGems() {
  // 遍历每一列
  for (let j = 0; j < boardWidth; j++) {
    // 从下往上遍历
    for (let i = boardHeight - 1; i >= 0; i--) {
      // 如果当前位置没有宝石
      if (!document.querySelector(`.gem[data-row="${i}"][data-col="${j}"]`)) {
        // 从上方查找宝石
        for (let k = i - 1; k >= 0; k--) {
          if (document.querySelector(`.gem[data-row="${k}"][data-col="${j}"]`)) {
            // 获取上方宝石
            const gem = document.querySelector(`.gem[data-row="${k}"][data-col="${j}"]`);

            // 更新宝石位置
            gem.dataset.row = i;

            // 移除宝石
            gem.remove();
            
            // 将宝石添加到正确位置
            const row = document.querySelector(`.row[data-row="${i}"]`);
            row.appendChild(gem);
          }
        }
      }
    }
  }

  // 补全空缺的宝石
  for (let i = 0; i < boardHeight; i++) {
    for (let j = 0; j < boardWidth; j++) {
      if (!document.querySelector(`.gem[data-row="${i}"][data-col="${j}"]`)) {
        const gem = document.createElement('div');
        gem.classList.add('gem');
        gem.style.backgroundColor = getRandomGem();
        gem.dataset.row = i;
        gem.dataset.col = j;
        const row = document.querySelector(`.row[data-row="${i}"]`);
        row.appendChild(gem);
      }
    }
  }
}

// 游戏开始
createBoard();
checkMatches();

// 添加点击事件
board.addEventListener('click', (event) => {
  if (event.target.classList.contains('gem')) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    checkMatches();
  }
});