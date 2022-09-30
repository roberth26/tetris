import {
  createMatrix,
  randomRotateMatrix,
  rotateMatrixLeft,
  randomShapeMatrix,
  rotateMatrixRight,
  getMatrixBounds,
  randomFill,
  pipe,
} from './utils.js';
import { hasCollision, isTopOut } from './selectors.js';

export function createStore(stageWidth, stageHeight) {
  const subscribers = new Set();

  let state = {
    stageWidth,
    stageHeight,
    activeShape: null,
    matrix: createMatrix(stageWidth, stageHeight),
    score: 0,
    isGameOver: false,
  };

  const reducer = (state, event) => {
    switch (event.type) {
      case 'TICK':
      case 'MOVE_DOWN':
        return state.activeShape == null
          ? spawn(state)
          : pipe(state, moveDown, hasCollision)
          ? isTopOut(state)
            ? endGame(state)
            : spawn(state)
          : pipe(state, moveDown, clearFullRows);

      case 'MOVE_RIGHT':
        return pipe(state, moveRight, hasCollision) ? state : moveRight(state);

      case 'MOVE_LEFT':
        return pipe(state, moveLeft, hasCollision) ? state : moveLeft(state);

      case 'ROTATE_RIGHT':
        return pipe(state, rotateRight, hasCollision)
          ? state
          : rotateRight(state);

      case 'ROTATE_LEFT':
        return pipe(state, rotateLeft, hasCollision)
          ? state
          : rotateLeft(state);

      default:
        return state;
    }
  };

  return {
    getState: () => state,
    dispatch: event => {
      const newState = reducer(state, event);
      if (newState !== state) {
        state = newState;
        subscribers.forEach(subscriber => {
          subscriber(state);
        });
      }
    },
    subscribe: subscriber => {
      subscribers.add(subscriber);
      subscriber(state);
      return () => subscribers.delete(subscriber);
    },
  };
}

function spawn(state) {
  const {
    activeShape: prevActiveShape,
    matrix,
    stageWidth,
    stageHeight,
  } = state;
  const activeShapeMatrix = randomRotateMatrix(randomShapeMatrix());
  const [[xMin], [xMax, yMax]] = getMatrixBounds(activeShapeMatrix);
  const width = xMax - xMin + 1;
  const activeShape = {
    x: Math.floor(stageWidth / 2 - width / 2) - xMin,
    y: -yMax - 1,
    fill: randomFill(),
    matrix: activeShapeMatrix,
  };

  return {
    ...state,
    activeShape,
    matrix:
      prevActiveShape == null
        ? matrix
        : createMatrix(stageWidth, stageHeight).map((row, y) => {
            return row.map((_cell, x) => {
              const localX = x - prevActiveShape.x;
              const localY = y - prevActiveShape.y;
              return prevActiveShape.matrix[localY]?.[localX]
                ? prevActiveShape.fill
                : matrix[y][x] ?? null;
            });
          }),
  };
}

function clearFullRows(state) {
  const { matrix, stageWidth, stageHeight } = state;
  const clearedMatrix = matrix.filter(row => !row.every(Boolean)).reverse();
  const clearedRows = matrix.length - clearedMatrix.length;
  const score = state.score + clearedRows;

  return {
    ...state,
    score,
    matrix: createMatrix(stageWidth, stageHeight)
      .map((row, y) => {
        return row.map((cell, x) => {
          return clearedMatrix[y]?.[x];
        });
      })
      .reverse(),
  };
}

function moveDown(state) {
  return state.activeShape == null
    ? state
    : {
        ...state,
        activeShape: {
          ...state.activeShape,
          y: state.activeShape.y + 1,
        },
      };
}

function moveRight(state) {
  return state.activeShape == null
    ? state
    : {
        ...state,
        activeShape: {
          ...state.activeShape,
          x: state.activeShape.x + 1,
        },
      };
}

function moveLeft(state) {
  return state.activeShape == null
    ? state
    : {
        ...state,
        activeShape: {
          ...state.activeShape,
          x: state.activeShape.x - 1,
        },
      };
}

function rotateRight(state) {
  return state.activeShape == null
    ? state
    : {
        ...state,
        activeShape: {
          ...state.activeShape,
          matrix: rotateMatrixRight(state.activeShape.matrix),
        },
      };
}

function rotateLeft(state) {
  return state.activeShape == null
    ? state
    : {
        ...state,
        activeShape: {
          ...state.activeShape,
          matrix: rotateMatrixLeft(state.activeShape.matrix),
        },
      };
}

function endGame(state) {
  return {
    ...state,
    isGameOver: true,
  };
}
