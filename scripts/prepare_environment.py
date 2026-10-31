"""Quantize the original reflection bake; preserve HDR and every prefiltered level."""
from pathlib import Path
import array
import argparse
import gzip
import struct

parser = argparse.ArgumentParser()
parser.add_argument('bake', type=Path)
args = parser.parse_args()
raw = gzip.decompress(args.bake.read_bytes())
magic, version, size, levels = struct.unpack('<4I', raw[:16])
if (magic, version, size, levels) != (0x504d524d, 1, 256, 6):
    raise ValueError('Expected the original 256px, six-level reflection bake')
dest = Path(__file__).resolve().parents[1]/'assets/3d'
dest.mkdir(exist_ok=True)
for target in [128, 256]:
    skip = 256*256*6*8 if target == 128 else 0
    data = array.array('H', raw[16+skip:])
    for i in range(len(data)):
        data[i] &= 0xffe0
    payload = struct.pack('<4I', magic, version, target, levels-int(target == 128)) + data.tobytes()
    path = dest/f'studio-{target}.bin.gz'
    path.write_bytes(gzip.compress(payload, 9, mtime=0))
    print(f'{path.name}: {path.stat().st_size:,} bytes')
