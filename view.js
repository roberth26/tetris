export function createRenderer({ ctx, bufferWidth, bufferHeight, unit }) {
  const renderCell = (x, y, fill) => {
    const left = x * unit;
    const top = y * unit;
    const right = left + unit;
    const bottom = top + unit;

    ctx.fillStyle = fill;
    ctx.fillRect(left, top, unit, unit);

    ctx.globalCompositeOperation = 'multiply';

    // right triangle
    ctx.beginPath();
    ctx.moveTo(right, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.lineTo(right, top);
    ctx.closePath();
    ctx.fillStyle = 'rgba(60, 15, 0, .35)';
    ctx.fill();

    // left triangle
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.lineTo(left, top);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 30, 80, .2)';
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
  };

  return state => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, bufferWidth, bufferHeight);

    state.activeShape?.matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const xGlobal = state.activeShape.x + x;
          const yGlobal = state.activeShape.y + y;
          renderCell(xGlobal, yGlobal, state.activeShape.fill);
        }
      });
    });

    state.matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          renderCell(x, y, cell);
        }
      });
    });

    ctx.font = '24px verdana';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'black';
    ctx.fillText(state.score, bufferWidth - 12, 32);

    if (state.isGameOver) {
      ctx.fillStyle = 'rgba(255, 255, 255, .75)';
      ctx.fillRect(0, 0, bufferWidth, bufferHeight);
      ctx.font = '36px verdana';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'black';
      ctx.fillText('GAME OVER!', bufferWidth / 2, bufferHeight / 2);

      ctx.font = '24px verdana';
      ctx.fillStyle = 'black';
      ctx.fillText(
        `Score: ${state.score}`,
        bufferWidth / 2,
        bufferHeight / 2 + 32,
      );
    }
  };
}

export function bindControls(store) {
  document.addEventListener('keydown', keyboardEvent => {
    switch (keyboardEvent.key) {
      case 's':
        store.dispatch({ type: 'MOVE_DOWN' });
        break;
      case 'd':
        store.dispatch({ type: 'MOVE_RIGHT' });
        break;
      case 'a':
        store.dispatch({ type: 'MOVE_LEFT' });
        break;
      case 'ArrowRight':
        store.dispatch({ type: 'ROTATE_RIGHT' });
        break;
      case 'ArrowLeft':
        store.dispatch({ type: 'ROTATE_LEFT' });
        break;
    }
  });
}
