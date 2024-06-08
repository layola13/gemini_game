import { Mole } from './mole.js';
import { Hammer } from './hammer.js';
import { Item } from './item.js';

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
const difficultySelect = document.getElementById('difficulty-select');
const comboCounterElement = document.getElementById('combo-counter');
const itemCounterElement = document.getElementById('item-counter');

let score = 0;
let moles = [];
let gameRunning = false;
let timerInterval;
let timeRemaining = 60;
let gameDifficulty = 1; // 难度级别，默认简单
let comboCounter = 0;
let hammer = null;
let items = [];
let itemCount = 3;
let timeStopActive = false;
let doubleScoreActive = false;

// 加载图片，并添加错误处理
const moleImage = new Image();
moleImage.src = 'mole.png';
moleImage.onerror = () => {
    console.error("地鼠图片加载失败");
    // 显示默认图片或提示信息
    moleImage.src = 'default_mole.png'; // 替换为默认图片路径
};

const holeImage = new Image();
holeImage.src = 'hole.png';
holeImage.onerror = () => {
    console.error("地洞图片加载失败");
    // 显示默认图片或提示信息
    holeImage.src = 'default_hole.png'; // 替换为默认图片路径
};

const hammerImage = new Image();
hammerImage.src = 'hammer.png';
hammerImage.onerror = () => {
    console.error("锤子图片加载失败");
    // 显示默认图片或提示信息
    hammerImage.src = 'default_hammer.png'; // 替换为默认图片路径
};

// 音效加载
const clickSound = new Audio('click.mp3'); // 替换为实际的音效文件路径
const appearSound = new Audio('appear.mp3'); // 替换为实际的音效文件路径
clickSound.onerror = () => {
    console.error("点击音效加载失败");
};
appearSound.onerror = () => {
    console.error("地鼠出现音效加载失败");
};

class Game {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.createMoles();
        this.createItems();
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

    createItems() {
        // 创建道具
        items.push(new Item('hammer', 'hammer.png', this.useHammer));
        items.push(new Item('time-stop', 'time-stop.png', this.useTimeStop));
        items.push(new Item('double-score', 'double-score.png', this.useDoubleScore));
    }

    startGame() {
        gameRunning = true;
        score = 0;
        timeRemaining = 60;
        comboCounter = 0;
        comboCounterElement.textContent = `连击：${comboCounter}`;
        scoreElement.textContent = `分数：${score}`;
        timerElement.textContent = `时间：${timeRemaining}`;
        itemCount = 3;
        itemCounterElement.textContent = `道具：${itemCount}`;
        this.updateTimer();
        this.randomMoleAppear();
        startButton.disabled = true;
        pauseButton.disabled = false;
    }

    randomMoleAppear() {
        if (gameRunning) {
            const randomIndex = Math.floor(Math.random() * moles.length);
            moles[randomIndex].appear();
            appearSound.play();
            setTimeout(() => {
                moles[randomIndex].hide();
                this.randomMoleAppear();
            }, 1000 - Math.floor(score / 10) * gameDifficulty); // 难度递增
        }
    }

    handleMoleClick(mole) {
        if (mole.isUp) {
            score += (doubleScoreActive ? 2 : 1);
            comboCounter++;
            comboCounterElement.textContent = `连击：${comboCounter}`;
            scoreElement.textContent = `分数：${score}`;
            mole.hide();
            clickSound.play();
            // 添加锤子效果
            if (hammer) {
                hammer.hit(mole.element);
            }
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
            if (timeStopActive) {
                return;
            }
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
        comboCounter = 0;
        comboCounterElement.textContent = `连击：${comboCounter}`;
        scoreElement.textContent = `分数：${score}`;
        timerElement.textContent = `时间：${timeRemaining}`;
        moles.forEach(mole => mole.hide()); // 隐藏所有地鼠
        gameRunning = false;
        clearInterval(timerInterval);
        startButton.disabled = false;
        pauseButton.disabled = true;
        gameOverScreen.style.display = 'none';
        guideScreen.style.display = 'block'; // 显示游戏说明
        // 移除锤子
        if (hammer) {
            gameBoard.removeChild(hammer.element);
            hammer = null;
        }
        // 移除所有道具
        items.forEach(item => {
            gameBoard.removeChild(item.element);
        });
        items = [];
        this.createItems();
        itemCount = 3;
        itemCounterElement.textContent = `道具：${itemCount}`;
        timeStopActive = false;
        doubleScoreActive = false;
    }

    // 道具使用函数
    useHammer() {
        if (hammer) return;
        hammer = new Hammer();
        gameBoard.appendChild(hammer.element);
        // 锤子点击事件
        hammer.element.addEventListener('click', () => {
            // 触发锤子效果
            hammer.hit();
        });
    }

    useTimeStop() {
        timeStopActive = true;
        setTimeout(() => {
            timeStopActive = false;
        }, 5000); // 时间停止持续 5 秒
    }

    useDoubleScore() {
        doubleScoreActive = true;
        setTimeout(() => {
            doubleScoreActive = false;
        }, 10000); // 双倍积分持续 10 秒
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
    } else if (event.target.classList.contains('item')) {
        const itemId = event.target.dataset.itemId;
        const item = items.find(item => item.id === itemId);
        if (item && itemCount > 0) {
            item.use();
            itemCount--;
            itemCounterElement.textContent = `道具：${itemCount}`;
            gameBoard.removeChild(item.element);
            items = items.filter(i => i.id !== itemId);
        }
    }
});

restartButton.addEventListener('click', () => {
    game.resetGame();
});

startGuideButton.addEventListener('click', () => {
    game.resetGame(); // 重置游戏状态，隐藏说明
    guideScreen.style.display = 'none';
});

difficultySelect.addEventListener('change', () => {
    gameDifficulty = parseInt(difficultySelect.value);
    // 可以根据难度级别调整其他参数，例如游戏时间、地鼠出现速度等
});