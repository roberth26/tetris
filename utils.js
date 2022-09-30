import fills from './fills.json' assert { type: 'json' };
import shapeMatrices from './shapes.json' assert { type: 'json' };

export function pipe(arg, ...fns) {
  return fns.reduce((v, f) => f(v), arg);
}

export function nextFrame(hz) {
  return new Promise(resolve => setTimeout(resolve, 1000 / hz));
}

export function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomFill() {
  return randomPick(fills);
}

export function randomShapeMatrix() {
  return randomPick(shapeMatrices);
}

export function createMatrix(width, height) {
  return new Array(height).fill().map(() => {
    return new Array(width).fill(null);
  });
}

export function rotateMatrixRight(matrix) {
  return matrix[0].map((_col, colIndex) =>
    matrix.map(row => row[colIndex]).reverse(),
  );
}

export function rotateMatrixLeft(matrix) {
  return matrix[0]
    .map((_col, colIndex) => matrix.map(row => row[colIndex]))
    .reverse();
}

export function getMatrixBounds(matrix) {
  let xMin = matrix[0].length;
  let xMax = 0;
  let yMin = matrix.length;
  let yMax = 0;

  matrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) {
        return;
      }
      if (x < xMin) {
        xMin = x;
      } else if (x > xMax) {
        xMax = x;
      }
      if (y < yMin) {
        yMin = y;
      } else if (y > yMax) {
        yMax = y;
      }
    });
  });

  return [
    [xMin, yMin],
    [xMax, yMax],
  ];
}

export function shrinkWrapShape(shape) {
  const [[xMin, yMin], [xMax, yMax]] = getMatrixBounds(shape.matrix);

  return {
    ...shape,
    x: shape.x + xMin,
    y: shape.y + yMin,
    matrix: shape.matrix.slice(yMin, yMax + 1).map(row => {
      return row.slice(xMin, xMax + 1);
    }),
  };
}

export function randomRotateMatrix(matrix) {
  return pipe(
    matrix,
    ...new Array(Math.floor(Math.random() * 3)).fill(rotateMatrixRight),
  );
}
