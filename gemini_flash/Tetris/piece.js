// piece.js
import { boardWidth } from './board.js';
import { isValidMove } from './utils.js';

const shapes = [
  // I
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // J
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  // L
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  // O
  [
    [1, 1],
    [1, 1],
  ],
  // S
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  // T
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  // Z
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
];

// 生成随机方块
export function generatePiece() {
  const randomIndex = Math.floor(Math.random() * shapes.length);
  const shape = shapes[randomIndex];
  return {
    shape: shape,
    x: Math.floor((boardWidth - shape[0].length) / 2),
    y: 0,
    color: getRandomColor(),
  };
}

// 获取随机颜色
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 移动方块
export function movePiece(xOffset, yOffset) {
  if (isValidMove(currentPiece.x + xOffset, currentPiece.y + yOffset, currentPiece.shape)) {
    currentPiece.x += xOffset;
    currentPiece.y += yOffset;
  }
}

// 旋转方块
export function rotatePiece() {
  const newShape = [];
  for (let i = 0; i < currentPiece.shape[0].length; i++) {
    newShape[i] = [];
    for (let j = 0; j < currentPiece.shape.length; j++) {
      newShape[i][j] = currentPiece.shape[currentPiece.shape.length - 1 - j][i];
    }
  }
  if (isValidMove(currentPiece.x, currentPiece.y, newShape)) {
    currentPiece.shape = newShape;
  }
}