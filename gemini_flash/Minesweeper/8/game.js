// game.js (ES6 & 类设计)
class Game {
    constructor(rows, cols, mines) {
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
        this.board = []; // 游戏面板二维数组，存储每个格子的状态
        this.cells = []; // 存储每个格子元素的数组
        this.gameStarted = false;
        this.minesLeft = mines; // 剩余地雷数量
        this.time = 0; // 游戏时间
        this.timerId = null; // 计时器ID
        this.gameOver = false;
        this.paused = false; // 游戏暂停状态
        this.clickCount = 0; // 点击次数

        this.initGame();
    }

    initGame() {
        this.createBoard();
        this.resetGameInfo();

        // 绑定按钮事件
        document.getElementById('reset-button').addEventListener('click', () => {
            this.resetGame();
        });
        document.getElementById('pause-button').addEventListener('click', () => {
            this.togglePause();
        });
        document.getElementById('play-again').addEventListener('click', () => {
            this.resetGame();
            document.getElementById('game-over').classList.add('hidden');
        });
    }

    createBoard() {
        const boardElement = document.getElementById('game-board');
        boardElement.innerHTML = ''; // 清除之前的游戏面板
        this.board = [];
        this.cells = [];
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = 0; // 初始化为没有雷
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', this.handleClick.bind(this));
                cell.addEventListener('contextmenu', this.handleRightClick.bind(this));
                boardElement.appendChild(cell);
                this.cells.push(cell);
            }
        }
    }

    // 首次点击生成雷区
    generateMines(clickRow, clickCol) {
        let minesPlaced = 0;
        while (minesPlaced < this.mines) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            // 保证首次点击位置和周围8个格子不是雷
            if (this.board[row][col] !== -1 && !(Math.abs(row - clickRow) <= 1 && Math.abs(col - clickCol) <= 1)) {
                this.board[row][col] = -1;
                minesPlaced++;
            }
        }
        this.calculateNumbers(); // 重新计算数字
        this.renderBoard();
    }

    calculateNumbers() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col] === -1) {
                    continue;
                }
                let count = 0;
                for (let i = row - 1; i <= row + 1; i++) {
                    for (let j = col - 1; j <= col + 1; j++) {
                        if (i >= 0 && i < this.rows && j >= 0 && j < this.cols && this.board[i][j] === -1) {
                            count++;
                        }
                    }
                }
                this.board[row][col] = count;
            }
        }
    }

    renderBoard() {
        this.cells.forEach((cell, index) => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            cell.classList.remove('mine', 'number', 'flag', 'revealed', 'empty'); // 清除之前的样式
            if (this.board[row][col] === -1) {
                cell.classList.add('mine'); // 地雷
            } else if (this.board[row][col] > 0) {
                cell.textContent = this.board[row][col];
                cell.classList.add('number'); // 数字
            } else if (cell.classList.contains('flag')) {
                cell.classList.add('flag'); // 标记
            } else if (cell.classList.contains('revealed')) {
                cell.classList.add('revealed'); // 已揭示
            } else {
                cell.classList.add('empty'); // 空白
            }
        });
    }

    handleClick(event) {
        if (this.gameOver || this.paused) return;
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (!this.gameStarted) {
            this.gameStarted = true;
            this.startTimer();
            this.generateMines(row, col); // 首次点击生成雷区
        }

        this.clickCount++; // 记录点击次数

        if (this.board[row][col] === -1) {
            this.gameOver = true;
            this.revealAllMines();
            this.stopTimer();
            this.showGameOver('你输了！');
        } else if (this.board[row][col] === 0) {
            this.revealEmptyCells(row, col);
        } else {
            cell.classList.remove('cell');
            cell.classList.add('revealed');
            this.minesLeft--;
            this.updateMinesLeft();
            this.checkWin();
        }
    }

    handleRightClick(event) {
        event.preventDefault();
        if (this.gameOver || this.paused) return;
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (cell.classList.contains('revealed')) return;

        if (cell.classList.contains('flag')) {
            cell.classList.remove('flag');
            this.minesLeft++;
        } else if (this.minesLeft > 0) {
            cell.classList.add('flag');
            this.minesLeft--;
        }
        this.updateMinesLeft();
    }

    revealEmptyCells(row, col) {
        if (this.board[row][col] !== 0) return;
        this.cells[row * this.cols + col].classList.remove('cell');
        this.cells[row * this.cols + col].classList.add('revealed');
        this.minesLeft--;
        this.updateMinesLeft();
        this.checkWin();

        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < this.rows && j >= 0 && j < this.cols) {
                    this.revealEmptyCells(i, j);
                }
            }
        }
    }

    revealAllMines() {
        this.cells.forEach((cell, index) => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (this.board[row][col] === -1) {
                cell.classList.remove('cell');
                cell.classList.add('mine');
            }
        });
    }

    startTimer() {
        this.timerId = setInterval(() => {
            if (!this.paused) {
                this.time++;
                document.getElementById('time').textContent = `时间: ${this.time}`;
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerId);
    }

    updateMinesLeft() {
        document.getElementById('mines-left').textContent = `剩余地雷: ${this.minesLeft}`;
    }

    resetGameInfo() {
        document.getElementById('mines-left').textContent = `剩余地雷: ${this.mines}`;
        document.getElementById('time').textContent = `时间: 0`;
        this.minesLeft = this.mines;
        this.time = 0;
        this.gameOver = false;
        this.paused = false;
        this.clickCount = 0;
    }

    checkWin() {
        let revealedCount = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col] !== -1 && this.cells[row * this.cols + col].classList.contains('revealed')) {
                    revealedCount++;
                }
            }
        }
        if (revealedCount === this.rows * this.cols - this.mines) {
            this.gameOver = true;
            this.stopTimer();
            this.showGameOver('你赢了！');
        }
    }

    showGameOver(result) {
        const gameOverElement = document.getElementById('game-over');
        const gameResultElement = document.getElementById('game-result');
        gameResultElement.textContent = result;
        gameOverElement.classList.remove('hidden');
    }

    resetGame() {
        this.createBoard();
        this.resetGameInfo();
        this.gameStarted = false;
        this.gameOver = false;
        this.paused = false;
        this.clickCount = 0;
    }

    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            this.stopTimer();
            document.getElementById('pause-button').textContent = '继续';
        } else {
            this.startTimer();
            document.getElementById('pause-button').textContent = '暂停';
        }
    }
}

const game = new Game(9, 9, 10); // 9x9 grid with 10 mines