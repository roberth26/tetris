import { shrinkWrapShape } from './utils.js';

export function hasCollision({ activeShape, matrix, stageWidth, stageHeight }) {
  if (activeShape == null) {
    return false;
  }

  const shape = shrinkWrapShape(activeShape);
  const shapeLeft = shape.x;
  const shapeWidth = shape.matrix[0].length;
  const shapeRight = shapeLeft + shapeWidth;
  const shapeTop = shape.y;
  const shapeHeight = shape.matrix.length;
  const shapeBottom = shapeTop + shapeHeight;

  return (
    // stage left
    shapeLeft < 0 ||
    // stage right
    shapeRight > stageWidth ||
    // stage bottom
    shapeBottom > stageHeight ||
    // another shape
    shape.matrix.some((row, y) => {
      return row.some((cell, x) => {
        return cell && matrix[shapeTop + y]?.[shapeLeft + x];
      });
    })
  );
}

export function isGameOver({ isGameOver }) {
  return isGameOver;
}

export function isTopOut({ activeShape }) {
  return shrinkWrapShape(activeShape).y < 0;
}

export function tickRate({ score }) {
  return Math.floor(0.25 * score) + 1.5;
}
