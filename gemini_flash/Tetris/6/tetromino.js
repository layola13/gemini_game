export class Tetromino {
  constructor(game, index) {
    this.game = game;
    this.index = index;
    this.shape = this.game.tetrominoShapes[this.index]; 
    this.color = this.game.colors[this.index];
    this.x = Math.floor(this.game.gameBoardWidth / 2) - Math.floor(this.shape.length / 2); 
    this.y = 0; 
  }

  /**
   * 旋转方块
   */
  rotate() {
    const newShape = [];
    for (let row = 0; row < this.shape.length; row++) {
      newShape[row] = [];
      for (let col = 0; col < this.shape.length; col++) {
        newShape[row][col] = this.shape[this.shape.length - 1 - col][row];
      }
    }
    if (!this.game.checkCollision(0, 0, newShape)) { 
      this.shape = newShape;
    }
  }
}