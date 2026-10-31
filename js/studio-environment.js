import { CompressedCubeTexture, RGBAFormat, HalfFloatType, LinearSRGBColorSpace, LinearMipmapLinearFilter, LinearFilter } from 'three';

// Already filtered at build time. Never run PMREM generation on a visitor's GPU.
export async function loadStudioEnvironment(size) {
  const response = await fetch(new URL(`../assets/3d/studio-${size}.bin.gz`, import.meta.url), { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Studio reflections unavailable');
  const download = await response.arrayBuffer();
  const bytes = new Uint8Array(download, 0, 2);
  // Some static hosts decode .gz responses themselves; avoid decoding twice.
  const buffer = bytes[0] === 0x1f && bytes[1] === 0x8b
    ? await new Response(new Blob([download]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()
    : download;
  const header = new Uint32Array(buffer, 0, 4);
  if (header[0] !== 0x504d524d || header[1] !== 1 || header[2] !== size) throw new Error('Invalid studio reflections');
  const levels = [];
  let offset = 16;
  for (let lod = 0; lod < header[3]; lod++) {
    const width = size >> lod;
    const count = width * width * 4;
    const faces = [];
    for (let face = 0; face < 6; face++) {
      faces.push({ data: new Uint16Array(buffer, offset, count), width, height: width });
      offset += count * 2;
    }
    levels.push(faces);
  }
  if (offset !== buffer.byteLength) throw new Error('Incomplete studio reflections');
  // This container supports explicit RGBA mip chains as well as GPU-compressed ones.
  const images = Array.from({ length: 6 }, (_, face) => ({ width: size, height: size, mipmaps: levels.map(level => level[face]) }));
  const texture = new CompressedCubeTexture(images, RGBAFormat, HalfFloatType);
  texture.colorSpace = LinearSRGBColorSpace;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.isPMREMTexture = true;
  texture.needsUpdate = true;
  return texture;
}
