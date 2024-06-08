import { Mole } from './mole.js';

const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');

let score = 0;
let moles = [];
let gameRunning = false;
let timerInterval;
let timeRemaining = 60;

class Game {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.createMoles();
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
            }, 1000 - Math.floor(score / 10)); // 难度递增
        }
    }

    handleMoleClick(mole) {
        if (mole.isUp) {
            score++;
            scoreElement.textContent = `分数：${score}`;
            mole.hide();
        }
    }

    endGame() {
        gameRunning = false;
        clearInterval(timerInterval);
        alert(`游戏结束！你的分数是：${score}`);
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
}

const game = new Game(5);

startButton.addEventListener('click', () => {
    game.startGame();
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