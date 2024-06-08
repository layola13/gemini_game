// board.js
export class GameBoard {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.gridSize = this.getGridSize(difficulty);
    this.minesCount = this.getMinesCount(difficulty);
    this.cells = this.createCells();
    this.mines = this.placeMines();
    this.revealedCells = 0;
    this.gameOver = false;
    this.onGameOver = null;
    this.firstClick = true;
  }

  // 获取网格大小
  getGridSize(difficulty) {
    switch (difficulty) {
      case "easy":
        return { rows: 8, cols: 8 };
      case "medium":
        return { rows: 16, cols: 16 };
      case "hard":
        return { rows: 16, cols: 30 };
      default:
        return { rows: 8, cols: 8 };
    }
  }

  // 获取炸弹数量
  getMinesCount(difficulty) {
    switch (difficulty) {
      case "easy":
        return 10;
      case "medium":
        return 40;
      case "hard":
        return 99;
      default:
        return 10;
    }
  }

  // 创建单元格
  createCells() {
    const cells = [];
    for (let i = 0; i < this.gridSize.rows; i++) {
      const row = [];
      for (let j = 0; j < this.gridSize.cols; j++) {
        row.push({
          x: j,
          y: i,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        });
      }
      cells.push(row);
    }
    return cells;
  }

  // 随机放置炸弹
  placeMines(firstClickX, firstClickY) {
    const mines = [];
    while (mines.length < this.minesCount) {
      const x = Math.floor(Math.random() * this.gridSize.cols);
      const y = Math.floor(Math.random() * this.gridSize.rows);
      // 确保炸弹不放置在首次点击的位置
      if (!this.cells[y][x].isMine && !mines.some(mine => mine.x === x && mine.y === y) && (x !== firstClickX || y !== firstClickY)) {
        this.cells[y][x].isMine = true;
        mines.push({ x, y });
      }
    }
    return mines;
  }

  // 计算每个单元格的相邻炸弹数量
  calculateAdjacentMines() {
    for (let i = 0; i < this.gridSize.rows; i++) {
      for (let j = 0; j < this.gridSize.cols; j++) {
        if (this.cells[i][j].isMine) continue;
        this.cells[i][j].adjacentMines = this.countAdjacentMines(j, i);
      }
    }
  }

  // 统计相邻炸弹数量
  countAdjacentMines(x, y) {
    let count = 0;
    for (let i = y - 1; i <= y + 1; i++) {
      for (let j = x - 1; j <= x + 1; j++) {
        if (i >= 0 && i < this.gridSize.rows && j >= 0 && j < this.gridSize.cols && this.cells[i][j].isMine) {
          count++;
        }
      }
    }
    return count;
  }

  // 渲染游戏面板
  render(element) {
    element.innerHTML = "";
    const table = document.createElement("table");
    for (let i = 0; i < this.gridSize.rows; i++) {
      const row = table.insertRow();
      for (let j = 0; j < this.gridSize.cols; j++) {
        const cell = row.insertCell();
        cell.dataset.x = j;
        cell.dataset.y = i;
        cell.addEventListener("click", this.handleCellClick.bind(this));
        cell.addEventListener("contextmenu", this.handleRightClick.bind(this));
        this.updateCellDisplay(cell, this.cells[i][j]);
      }
    }
    element.appendChild(table);
  }

  // 更新单元格显示
  updateCellDisplay(cell, cellData) {
    cell.classList.remove("revealed", "flagged", "mine");
    if (cellData.isRevealed) {
      cell.classList.add("revealed");
      if (cellData.isMine) {
        cell.classList.add("mine");
        cell.textContent = "💣";
      } else if (cellData.adjacentMines > 0) {
        cell.textContent = cellData.adjacentMines;
      } else {
        cell.textContent = "";
      }
    } else if (cellData.isFlagged) {
      cell.classList.add("flagged");
      cell.textContent = "🚩";
    } else {
      cell.textContent = "";
    }
  }

  // 处理左键点击
  handleCellClick(event) {
    if (this.gameOver) return;
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);

    // 首次点击时，先放置炸弹
    if (this.firstClick) {
      this.placeMines(x, y);
      this.calculateAdjacentMines();
      this.firstClick = false;
    }
    this.revealCell(x, y);
  }

  // 处理右键点击
  handleRightClick(event) {
    event.preventDefault();
    if (this.gameOver) return;
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    this.toggleFlag(x, y);
  }

  // 揭开单元格
  revealCell(x, y) {
    const cell = this.cells[y][x];
    if (cell.isRevealed || cell.isFlagged) return;
    cell.isRevealed = true;
    this.revealedCells++;

    // 揭开炸弹
    if (cell.isMine) {
      this.gameOver = true;
      this.revealAllMines();
      this.onGameOver(false);
      return;
    }

    // 揭开空单元格
    if (cell.adjacentMines === 0) {
      this.revealAdjacentCells(x, y);
    }

    // 检查游戏是否结束
    if (this.revealedCells === this.gridSize.rows * this.gridSize.cols - this.minesCount) {
      this.gameOver = true;
      this.onGameOver(true);
    }
  }

  // 揭开所有炸弹
  revealAllMines() {
    for (let i = 0; i < this.gridSize.rows; i++) {
      for (let j = 0; j < this.gridSize.cols; j++) {
        if (this.cells[i][j].isMine) {
          this.cells[i][j].isRevealed = true;
        }
      }
    }
  }

  // 揭开相邻单元格
  revealAdjacentCells(x, y) {
    for (let i = y - 1; i <= y + 1; i++) {
      for (let j = x - 1; j <= x + 1; j++) {
        if (i >= 0 && i < this.gridSize.rows && j >= 0 && j < this.gridSize.cols && !this.cells[i][j].isRevealed && !this.cells[i][j].isFlagged) {
          this.revealCell(j, i);
        }
      }
    }
  }

  // 切换旗帜
  toggleFlag(x, y) {
    const cell = this.cells[y][x];
    cell.isFlagged = !cell.isFlagged;
  }

  // 重置游戏
  reset() {
    this.cells = this.createCells();
    this.mines = this.placeMines();
    this.revealedCells = 0;
    this.gameOver = false;
    this.firstClick = true; // 重置首次点击状态
  }

  // 放置炸弹，避免首次点击到雷
  placeMines(firstClickX, firstClickY) {
    const mines = [];
    while (mines.length < this.minesCount) {
      const x = Math.floor(Math.random() * this.gridSize.cols);
      const y = Math.floor(Math.random() * this.gridSize.rows);
      // 确保炸弹不放置在首次点击的位置
      if (!this.cells[y][x].isMine && !mines.some(mine => mine.x === x && mine.y === y) && (x !== firstClickX || y !== firstClickY)) {
        this.cells[y][x].isMine = true;
        mines.push({ x, y });
      }
    }
    return mines;
  }
}