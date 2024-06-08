import { Mole } from './mole.js';

const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

let score = 0;
let moles = [];
let gameRunning = false;

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
        this.randomMoleAppear();
    }

    randomMoleAppear() {
        if (gameRunning) {
            const randomIndex = Math.floor(Math.random() * moles.length);
            moles[randomIndex].appear();
            setTimeout(() => {
                moles[randomIndex].hide();
                this.randomMoleAppear();
            }, 1000);
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
        alert(`游戏结束！你的分数是：${score}`);
    }
}

const game = new Game(5);

startButton.addEventListener('click', () => {
    game.startGame();
    startButton.disabled = true;
});

gameBoard.addEventListener('click', (event) => {
    if (event.target.classList.contains('mole')) {
        game.handleMoleClick(event.target);
    }
});