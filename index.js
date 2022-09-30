import { createRenderer, bindControls } from './view.js';
import { createStore } from './store.js';
import { nextFrame } from './utils.js';
import { tickRate, isGameOver } from './selectors.js';

const root = document.getElementById('root');

init({ root, width: 10, height: 20, resolution: 32 });

function init({ root, width, height, resolution }) {
  const stageWidth = Math.max(4, Math.ceil(width));
  const stageHeight = Math.max(4, Math.ceil(height));
  const unit = Math.ceil(resolution);

  const bufferWidth = stageWidth * unit;
  const bufferHeight = stageHeight * unit;

  const canvas = document.createElement('canvas');
  canvas.width = bufferWidth;
  canvas.height = bufferHeight;

  root.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const store = createStore(stageWidth, stageHeight);
  const render = createRenderer({ ctx, bufferWidth, bufferHeight, unit });

  bindControls(store);
  store.subscribe(render);

  startLoop(store, render);
}

async function startLoop(store) {
  while (true) {
    if (isGameOver(store.getState())) {
      return;
    }
    store.dispatch({ type: 'TICK' });
    await nextFrame(tickRate(store.getState()));
  }
}
