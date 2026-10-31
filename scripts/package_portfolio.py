"""Copy an explicit public allowlist into dist. Never publish the working directory."""
from pathlib import Path
import shutil
import argparse

ROOT = Path(__file__).resolve().parents[1]
FILES = ['index.html', 'styles.css', 'app.js', 'theme.js', 'favicon.ico', 'robots.txt', 'site.webmanifest', 'sitemap.xml']
ASSET_FILES = ['Resume.html', 'resume.css', 'resume.js', 'Pham_Ngoc_Gia_Bao_Java_Backend.pdf', 'favicon.svg', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png', 'og-preview.png']


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=ROOT/'dist')
    args = parser.parse_args()
    dest = args.output.resolve()
    if dest == ROOT or ROOT in dest.parents and dest.name not in ('dist',):
        raise ValueError('Output must be a dedicated dist directory')
    dest.mkdir(parents=True, exist_ok=True)
    # Only remove the generated artifact, never user source or application documents.
    for child in dest.iterdir():
        if child.is_dir(): shutil.rmtree(child)
        else: child.unlink()
    for name in FILES:
        shutil.copy2(ROOT/name, dest/name)
    (dest/'assets').mkdir()
    for name in ASSET_FILES:
        shutil.copy2(ROOT/'assets'/name, dest/'assets'/name)
    for name in ['fonts', 'optimized']:
        shutil.copytree(ROOT/'assets'/name, dest/'assets'/name)
    shutil.copytree(ROOT/'cases', dest/'cases')
    print('Public artifact:', dest)


if __name__ == '__main__': main()
