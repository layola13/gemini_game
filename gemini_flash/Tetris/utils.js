// utils.js
import { boardWidth, boardHeight, board } from './board.js';

// 判断移动是否有效
export function isValidMove(x, y, shape) {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[0].length; col++) {
      if (shape[row][col] === 1) {
        // 检查是否超出游戏板边界
        if (x + col < 0 || x + col >= boardWidth || y + row >= boardHeight) {
          return false;
        }
        // 检查是否与其他方块碰撞
        if (y + row >= 0 && board[y + row][x + col] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}