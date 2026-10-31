import { startScene } from './cinematic-scene.js';

// Shader compilation, geometry and drawing live off the page's main thread.
let state, scene;
self.addEventListener('message', async event => {
  const message = event.data;
  if (message.type === 'init') {
    state = message.state;
    scene = await startScene({
      canvas: message.canvas,
      state,
      onReady: stats => self.postMessage({ type: 'ready', stats }),
      onError: reason => self.postMessage({ type: 'fallback', reason }),
    });
    if (scene) self.postMessage({ type: 'initialized' });
  } else if (message.type === 'state' && state) {
    Object.assign(state, message.state);
    scene?.invalidate();
  } else if (message.type === 'dispose') {
    scene?.dispose();
    self.close();
  }
});
