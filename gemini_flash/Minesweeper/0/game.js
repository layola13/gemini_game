// game.js
import { GameBoard } from "./board.js";

const gameBoardElement = document.getElementById("gameBoard");
const timerElement = document.getElementById("timer");
const minesElement = document.getElementById("mines");
const resetButton = document.getElementById("resetButton");

let gameBoard;
let timerInterval;
let startTime = 0;

// 初始化游戏
function initGame() {
  // 初始化游戏难度
  const difficulty = "easy"; // 可修改为 "easy", "medium", "hard"
  gameBoard = new GameBoard(difficulty);
  gameBoard.render(gameBoardElement);

  // 设置炸弹数量显示
  minesElement.textContent = gameBoard.minesCount;

  // 设置重置按钮事件
  resetButton.addEventListener("click", resetGame);

  // 开始游戏计时
  startTimer();
}

// 重置游戏
function resetGame() {
  clearInterval(timerInterval);
  timerElement.textContent = "0";
  startTime = 0;
  gameBoard.reset();
  gameBoard.render(gameBoardElement);
}

// 开始计时
function startTimer() {
  timerInterval = setInterval(() => {
    startTime++;
    timerElement.textContent = startTime;
  }, 1000);
}

// 游戏结束
function gameOver() {
  clearInterval(timerInterval);
  alert("游戏结束！");
}

// 监听游戏结束事件
gameBoard.onGameOver = gameOver;

// 初始化游戏
initGame();