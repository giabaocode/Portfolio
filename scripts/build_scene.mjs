import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await build({
  absWorkingDir: root,
  entryPoints: ['js/scene-worker.js'],
  outfile: 'js/cinematic-3d.min.js',
  bundle: true,
  format: 'esm',
  target: ['es2022'],
  minify: true,
  legalComments: 'linked',
  alias: {
    'three/addons': path.join(root, 'vendor/three/examples/jsm'),
    'three': path.join(root, 'vendor/three/build/three.module.js'),
  },
});
console.log('Built compact, self-contained 3D module.');
