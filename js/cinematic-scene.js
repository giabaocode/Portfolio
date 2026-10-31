import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

import { loadStudioEnvironment } from './studio-environment.js';

export async function startScene({ canvas, state, onReady, onError }) {
const yieldToBrowser = () => globalThis.scheduler?.yield ? scheduler.yield() : new Promise(resolve => setTimeout(resolve, 0));
const compact = state.mobile;
let requestFrame = () => {};
const frame = globalThis.requestAnimationFrame?.bind(globalThis) || (callback => setTimeout(() => callback(performance.now()), 1000 / 30));
const cancelFrame = globalThis.cancelAnimationFrame?.bind(globalThis) || clearTimeout;
const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const smooth = value => { value = clamp(value); return value * value * (3 - 2 * value); };
const mix = (a, b, t) => a + (b - a) * t;
try {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060a10, 0.037);
  const studio = await loadStudioEnvironment(compact ? 128 : 256);
  await yieldToBrowser();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !compact, powerPreference: 'default' });
  renderer.setClearColor(0x060a10, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.78;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const camera = new THREE.PerspectiveCamera(35, state.width / state.height, 0.1, 80);
  camera.position.set(0, 1.35, 9.2);
  scene.environment = studio;
  scene.environmentIntensity = 0.38;
  await yieldToBrowser();

  scene.add(new THREE.AmbientLight(0x718aab, 0.16));
  const topLight = new THREE.DirectionalLight(0xe5f1ff, 1.65);
  topLight.position.set(-3, 6, 5); scene.add(topLight);
  const rimLight = new THREE.DirectionalLight(0x619aff, 2.2);
  rimLight.position.set(4, 1.5, -3); scene.add(rimLight);
  const warmLight = new THREE.DirectionalLight(0xffd8af, 0.45);
  warmLight.position.set(-4, 1.5, 0); scene.add(warmLight);
  const coreLight = new THREE.PointLight(0x6ebaff, 1.8, 5, 2);
  coreLight.position.set(0, 0, 0); scene.add(coreLight);

  const sculpture = new THREE.Group();
  sculpture.position.x = 2.1;
  scene.add(sculpture);
  const body = new THREE.Group();
  sculpture.add(body);
  const MetalMaterial = compact ? THREE.MeshStandardMaterial : THREE.MeshPhysicalMaterial;
  const metal = new MetalMaterial({ color: 0x43566b, metalness: 1, roughness: 0.2, ...(compact ? {} : { clearcoat: 0.65, clearcoatRoughness: 0.16 }), envMapIntensity: 0.95 });
  const darkMetal = new MetalMaterial({ color: 0x0e1926, metalness: 0.9, roughness: 0.3, ...(compact ? {} : { clearcoat: 1 }), envMapIntensity: 1.2 });
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x6397bb, metalness: 0.4, roughness: 0.2, emissive: 0x153f68, emissiveIntensity: 0.75 });
  const innerMaterial = new THREE.MeshStandardMaterial({ color: 0x255d8d, metalness: 0.25, roughness: 0.18, emissive: 0x3b91df, emissiveIntensity: 1.9 });
  const paleMaterial = new THREE.MeshStandardMaterial({ color: 0x8dacc6, metalness: 0.97, roughness: 0.16, envMapIntensity: 1.1 });

  function roundedPath(path, width, height, radius, reverse = false) {
    const x = -width / 2, y = -height / 2;
    path.moveTo(x + radius, y);
    path.lineTo(x + width - radius, y);
    path.quadraticCurveTo(x + width, y, x + width, y + radius);
    path.lineTo(x + width, y + height - radius);
    path.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    path.lineTo(x + radius, y + height);
    path.quadraticCurveTo(x, y + height, x, y + height - radius);
    path.lineTo(x, y + radius);
    path.quadraticCurveTo(x, y, x + radius, y);
    return path;
  }
  const frameShape = roundedPath(new THREE.Shape(), 2.25, 1.86, 0.15);
  const aperture = roundedPath(new THREE.Path(), 1.38, 1.02, 0.13);
  frameShape.holes.push(aperture);
  const frameGeometry = new THREE.ExtrudeGeometry(frameShape, { depth: 0.08, bevelEnabled: true, bevelSegments: compact ? 1 : 3, steps: 1, bevelSize: 0.035, bevelThickness: 0.035, curveSegments: compact ? 6 : 12 });
  frameGeometry.center();
  frameGeometry.rotateX(-Math.PI / 2);
  await yieldToBrowser();
  const frames = [];
  const insetGeometry = new RoundedBoxGeometry(1.92, 0.065, 0.015, 2, 0.006);
  const lipGeometry = new RoundedBoxGeometry(2.2, 0.035, 1.81, 2, 0.014);
  const portGeometry = new THREE.CylinderGeometry(0.036, 0.036, 0.022, 8);
  const strips = [];
  const frameCount = 9;
  for (let index = 0; index < frameCount; index++) {
    const frame = new THREE.Group();
    const shell = new THREE.Mesh(frameGeometry, index === 0 || index === frameCount - 1 ? paleMaterial : metal);
    frame.add(shell);
    const inset = new THREE.Mesh(insetGeometry, edgeMaterial);
    inset.position.set(0, -0.025, 0.925);
    frame.add(inset);
    const darkLip = new THREE.Mesh(lipGeometry, darkMetal);
    darkLip.position.y = -0.095;
    // The lip only covers the back edge: the central luminous column stays visible.
    darkLip.scale.z = 0.15;
    darkLip.position.z = -0.77;
    frame.add(darkLip);
    for (const x of [-0.98, 0.98]) {
      const port = new THREE.Mesh(portGeometry, darkMetal);
      port.position.set(x, 0.08, 0.68); frame.add(port);
    }
    const baseY = (index - (frameCount - 1) / 2) * 0.265;
    frame.position.y = baseY;
    frame.rotation.y = index * 0.035;
    frame.userData = { index, baseY };
    body.add(frame); frames.push(frame); strips.push(inset);
    if (index % 3 === 2) await yieldToBrowser();
  }
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 2.35, 48), innerMaterial);
  core.rotation.z = 0.015; body.add(core);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 2.55, 48, 1, true), new THREE.MeshBasicMaterial({ color: 0x7ec4f7, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }));
  body.add(glass);
  const caps = [];
  for (const y of [-1.35, 1.35]) {
    const cap = new THREE.Mesh(new RoundedBoxGeometry(2.32, 0.13, 1.94, 4, 0.055), metal);
    cap.position.y = y;
    cap.userData.baseY = y; caps.push(cap);
    body.add(cap);
    const stamp = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.008, 0.3, 3, 0.003), darkMetal);
    stamp.position.set(0.45, y + (y > 0 ? 0.071 : -0.071), 0.35);
    stamp.userData.baseY = stamp.position.y; caps.push(stamp);
    body.add(stamp);
  }
  // Four vertical tie-rods make the exploded architecture read as one assembled object.
  const tieRods = new THREE.Group();
  for (const x of [-1.02, 1.02]) for (const z of [-0.78, 0.78]) {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 2.75, 12), paleMaterial);
    rod.position.set(x, 0, z); tieRods.add(rod);
  }
  body.add(tieRods);

  await yieldToBrowser();
  const rings = new THREE.Group();
  sculpture.add(rings);
  function orbit(radius, tilt, color, opacity, y = 0) {
    const geometry = new THREE.TorusGeometry(radius, 0.006, 6, 180);
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.set(tilt[0], tilt[1], tilt[2]);ring.position.y = y;rings.add(ring);
    return ring;
  }
  orbit(2.8, [1.14, 0.28, 0.1], 0x4377a8, 0.42, -0.1);
  orbit(3.05, [1.32, -0.25, -0.23], 0x5f8aad, 0.2, -0.2);
  orbit(2.1, [0.35, 0.95, 0.4], 0x7fb4df, 0.18);
  const flowCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.6, 0.1, 0.5),new THREE.Vector3(-3.2, 0.25, 1),
    new THREE.Vector3(-1.9, 0.75, 1.7),new THREE.Vector3(0, 0.3, 1.8),
    new THREE.Vector3(2.2, 0.1, 0.9),new THREE.Vector3(3.2, 1.3, -0.5),new THREE.Vector3(3.7, 2.5, -1.8)
  ]);
  const flowMaterial = new THREE.MeshBasicMaterial({ color: 0x517594, transparent: true, opacity: 0.3 });
  const flowTube = new THREE.Mesh(new THREE.TubeGeometry(flowCurve, 140, 0.004, 5, false), flowMaterial);
  rings.add(flowTube);
  const flowCount = 28;
  const motes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.023, 7, 5), new THREE.MeshBasicMaterial({ color: 0xb5dfff }), flowCount);
  rings.add(motes);
  const dummy = new THREE.Object3D();

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), new THREE.MeshStandardMaterial({ color: 0x020407, metalness: 0.12, roughness: 0.88, envMapIntensity: 0.04 }));
  floor.rotation.x = -Math.PI / 2;floor.position.y = -1.85;scene.add(floor);
  const grid = new THREE.GridHelper(90, 90, 0x25364b, 0x162233);
  grid.position.y = -1.841; grid.material.transparent = true;grid.material.opacity = 0.25;scene.add(grid);
  const floorHalo = new THREE.Mesh(new THREE.RingGeometry(2.9, 2.905, 160),new THREE.MeshBasicMaterial({color:0x466988,transparent:true,opacity:0.3,side:THREE.DoubleSide}));
  floorHalo.rotation.x = -Math.PI / 2;floorHalo.position.set(2.1,-1.838,0);scene.add(floorHalo);
  const dustPositions = new Float32Array(130 * 3);
  let seed = 1537;
  const random = () => { seed = (seed * 16807) % 2147483647;return (seed - 1) / 2147483646; };
  for (let i = 0; i < dustPositions.length; i += 3) {
    dustPositions[i] = (random() - 0.5) * 16;
    dustPositions[i + 1] = random() * 8 - 2;
    dustPositions[i + 2] = random() * 10 - 5;
  }
  const dustGeometry = new THREE.BufferGeometry();dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0x8aabc8, size: 0.013, transparent: true, opacity: 0.36, depthWrite: false }));scene.add(dust);

  await yieldToBrowser();
  let width = state.width, height = state.height, mobile = state.mobile;
  function resize() {
    width = state.width; height = state.height; mobile = state.mobile;
    renderer.setPixelRatio(state.pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = mobile ? 36 : 35;
    camera.updateProjectionMatrix();
  }
  const pointer = { get x() { return state.pointerX; }, get y() { return state.pointerY; } };
  let time = 0, previous = performance.now(), animation = null, explosion = 0;
  let rendered = false, lastRender = 0;
  const lookAt = new THREE.Vector3(0, 0.1, 0);
  const accent = new THREE.Color(0x3b91df);
  const targetAccent = new THREE.Color(0x3b91df);
  function draw(now) {
    animation = null;
    if (!state.visible || state.hidden) return;
    const { paused, expanded } = state;
    if (rendered && !paused && now - lastRender < (mobile ? 1000 / 30 : 1000 / 60) - 1) {
      animation = frame(draw); return;
    }
    lastRender = now;
    const delta = Math.max(0, Math.min((now - previous) / 1000, 0.05));previous = now;
    if (!paused && !state.hidden) time += delta;
    const y = state.scroll;
    const layer = mobile ? 0 : smooth((y - state.heroHeight * 0.38) / (state.heroHeight * 0.8));
    const work = mobile ? 0 : smooth((y - state.workTop + state.viewportHeight * 0.4) / (state.viewportHeight * 0.75));
    const contact = mobile ? 0 : smooth((y - state.contactTop + state.viewportHeight * 0.65) / state.viewportHeight);
    const shouldExplode = expanded ? 1 : layer * (1 - work) * 0.92;
    const lerp = paused || state.reducedMotion ? 1 : 1 - Math.exp(-delta * 5.5);
    explosion = mix(explosion, shouldExplode, lerp);
    const float = paused ? 0 : Math.sin(time * 0.55) * 0.055;
    const heroX = mobile ? 0 : 2.15;
    const layerX = mobile ? 0.05 : -2.45;
    sculpture.position.x = mix(mix(heroX, layerX, layer), mobile ? 1 : 3.8, work) * (1 - contact);
    sculpture.position.y = (mobile ? 0.1 : 0.08) + float + work * 0.5;
    sculpture.position.z = -work * 3.3 + contact * 1.4;
    const targetScale = mix(mobile ? 0.92 : 1, 0.75, work) + contact * 0.15;
    sculpture.scale.setScalar(targetScale);
    body.rotation.y = -0.5 + time * 0.055 + pointer.x * (mobile ? 0 : 0.1) + layer * 0.7;
    body.rotation.z = -0.12 + Math.sin(time * 0.3) * 0.022;
    body.rotation.x = 0.05 + pointer.y * 0.025;
    for (const frame of frames) {
      const { index, baseY } = frame.userData;
      frame.position.y = baseY * (1 + explosion * 0.9);
      frame.rotation.y = index * 0.035 + explosion * Math.sin(index * 0.7) * 0.16;
      frame.position.x = explosion * Math.sin(index * 0.65) * 0.18;
    }
    for (const cap of caps) cap.position.y = cap.userData.baseY * (1 + explosion * 0.9);
    tieRods.scale.y = 1 + explosion * 0.9;
    glass.scale.y = core.scale.y = 1 + explosion * 0.72;
    coreLight.position.copy(sculpture.position);
    floorHalo.position.x = sculpture.position.x;
    floorHalo.material.opacity = 0.23 * (1 - work * 0.8);
    rings.rotation.y = time * 0.022;
    rings.rotation.z = Math.sin(time * 0.22) * 0.035;
    for (let index = 0; index < flowCount; index++) {
      const progress = ((index / flowCount + time * 0.045) % 1 + 1) % 1;
      dummy.position.copy(flowCurve.getPointAt(progress));
      dummy.scale.setScalar(0.4 + Math.sin(progress * Math.PI) * 0.6);
      dummy.updateMatrix();motes.setMatrixAt(index, dummy.matrix);
    }
    motes.instanceMatrix.needsUpdate = true;
    dust.rotation.y = time * 0.009;
    if (expanded) targetAccent.set(0x51baff); else targetAccent.set(0x3b91df);
    accent.lerp(targetAccent, lerp);
    innerMaterial.emissive.copy(accent);
    edgeMaterial.emissive.copy(accent).multiplyScalar(0.3);
    const baseCameraZ = mobile ? (expanded ? 9.0 : 6.7) : 9.2;
    camera.position.x = mix(camera.position.x, paused ? 0 : pointer.x * 0.16, lerp);
    camera.position.y = mix(camera.position.y, (mobile ? 0.65 : 1.35) + layer * 0.1 - pointer.y * 0.08, lerp);
    camera.position.z = mix(camera.position.z, baseCameraZ - layer * 0.35 + work * 0.4, lerp);
    // On phones the sculpture occupies the open space between the title and description.
    lookAt.set(0, mobile ? 0.08 + layer * 0.65 : 0.1, 0);
    camera.lookAt(lookAt);
    renderer.render(scene, camera);
    if (!rendered) {
      rendered = true;
      onReady({ drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles });
    }
    const settling = Math.abs(explosion - shouldExplode) > 0.002;
    if (state.visible && !state.hidden && (!paused || settling)) animation = frame(draw);
  }
  requestFrame = () => {
    if (animation === null && state.visible && !state.hidden) { previous = performance.now(); animation = frame(draw); }
  };
  const dispose = () => {
    if (animation !== null) cancelFrame(animation);
    studio.dispose(); renderer.dispose();
    const geometries = new Set(), materials = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) materials.add(object.material);
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
  };
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    if (animation !== null) cancelFrame(animation);
    animation = null;
    onError('context-lost');
  });
  resize();
  // Warm the visible shaders without synchronously waiting for GPU compilation.
  await renderer.compileAsync(scene, camera);
  await yieldToBrowser();
  requestFrame();
  return {
    invalidate() {
      if (state.hidden || !state.visible) {
        if (animation !== null) cancelFrame(animation);
        animation = null;
        return;
      }
      if (width !== state.width || height !== state.height || mobile !== state.mobile) resize();
      requestFrame();
    },
    dispose,
  };
} catch (error) {
  onError(error.name);
}
}
