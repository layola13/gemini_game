// sound.js

export class Sound {
  constructor() {
    this.bounceSound = new Audio('bounce.mp3'); // 替换为您的音效文件
    this.scoreSound = new Audio('score.mp3'); // 替换为您的音效文件
    this.gameOverSound = new Audio('game_over.mp3'); // 替换为您的音效文件

    // 错误处理
    this.bounceSound.onerror = () => console.error("无法加载 bounce.mp3");
    this.scoreSound.onerror = () => console.error("无法加载 score.mp3");
    this.gameOverSound.onerror = () => console.error("无法加载 game_over.mp3");
  }

  playBounce() {
    this.bounceSound.currentTime = 0;
    this.bounceSound.play();
  }

  playScore() {
    this.scoreSound.currentTime = 0;
    this.scoreSound.play();
  }

  playGameOver() {
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play();
  }
}