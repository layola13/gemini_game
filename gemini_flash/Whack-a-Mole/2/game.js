import { Mole } from './mole.js';

const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const guideScreen = document.getElementById('guide');
const startGuideButton = document.getElementById('start-guide');

let score = 0;
let moles = [];
let gameRunning = false;
let timerInterval;
let timeRemaining = 60;
let difficulty = 1; // 难度级别，默认简单

// 加载图片，并添加错误处理
const moleImage = new Image();
moleImage.src = 'mole.png';
moleImage.onerror = () => {
    console.error("地鼠图片加载失败");
    // 显示默认图片或提示信息
};

class Game {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.createMoles();
        // 初始化游戏状态
        this.resetGame();
    }

    createMoles() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const mole = new Mole(i, j);
                moles.push(mole);
                gameBoard.appendChild(mole.element);
            }
        }
    }

    startGame() {
        gameRunning = true;
        score = 0;
        timeRemaining = 60;
        scoreElement.textContent = `分数：${score}`;
        timerElement.textContent = `时间：${timeRemaining}`;
        this.updateTimer();
        this.randomMoleAppear();
        startButton.disabled = true;
        pauseButton.disabled = false;
    }

    randomMoleAppear() {
        if (gameRunning) {
            const randomIndex = Math.floor(Math.random() * moles.length);
            moles[randomIndex].appear();
            setTimeout(() => {
                moles[randomIndex].hide();
                this.randomMoleAppear();
            }, 1000 - Math.floor(score / 10) * difficulty); // 难度递增
        }
    }

    handleMoleClick(mole) {
        if (mole.isUp) {
            score++;
            scoreElement.textContent = `分数：${score}`;
            mole.hide();
            // 添加点击地鼠的音效
            const clickSound = new Audio('click.mp3'); // 替换为实际的音效文件路径
            clickSound.play();
        }
    }

    endGame() {
        gameRunning = false;
        clearInterval(timerInterval);
        gameOverScreen.style.display = 'block';
        finalScoreElement.textContent = score;
        startButton.disabled = false;
        pauseButton.disabled = true;
    }

    updateTimer() {
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerElement.textContent = `时间：${timeRemaining}`;
            if (timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    pauseGame() {
        gameRunning = false;
        clearInterval(timerInterval);
        startButton.disabled = false;
        pauseButton.disabled = true;
    }

    resumeGame() {
        gameRunning = true;
        this.updateTimer();
        this.randomMoleAppear();
        startButton.disabled = true;
        pauseButton.disabled = false;
    }

    resetGame() {
        score = 0;
        timeRemaining = 60;
        scoreElement.textContent = `分数：${score}`;
        timerElement.textContent = `时间：${timeRemaining}`;
        moles.forEach(mole => mole.hide()); // 隐藏所有地鼠
        gameRunning = false;
        clearInterval(timerInterval);
        startButton.disabled = false;
        pauseButton.disabled = true;
        gameOverScreen.style.display = 'none';
        guideScreen.style.display = 'block'; // 显示游戏说明
    }
}

const game = new Game(5);

startButton.addEventListener('click', () => {
    game.startGame();
    guideScreen.style.display = 'none';
});

pauseButton.addEventListener('click', () => {
    if (gameRunning) {
        game.pauseGame();
    } else {
        game.resumeGame();
    }
});

gameBoard.addEventListener('click', (event) => {
    if (event.target.classList.contains('mole')) {
        game.handleMoleClick(event.target);
    }
});

restartButton.addEventListener('click', () => {
    game.resetGame();
});

startGuideButton.addEventListener('click', () => {
    game.resetGame(); // 重置游戏状态，隐藏说明
    guideScreen.style.display = 'none';
});