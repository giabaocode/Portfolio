"""Prepare responsive copies of existing screenshots and code-drawn brand assets."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import reportlab

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
DEST = ASSETS / 'optimized'


def main():
    DEST.mkdir(exist_ok=True)
    names = ['sstc-chat', 'sstc-intake', 'sstc-inspection', 'sstc-lookup', 'lunfa-chat', 'lunfa-login']
    for name in names:
        source = Image.open(ASSETS / 'photo_prod' / (name + '.png')).convert('RGB')
        for width in [800, 1600, 2000]:
            image = source.copy()
            image.thumbnail((width, 3000), Image.Resampling.LANCZOS)
            suffix = f'-{width}' if width != 2000 else ''
            image.save(DEST / f'{name}{suffix}.webp', quality=86, method=6)
    (ASSETS / 'favicon.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#d1f87b"/><text x="8" y="43" fill="#18220c" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="35" letter-spacing="-4">gb.</text></svg>''')
    font_root = Path(reportlab.__file__).parent/'fonts'
    font_path = str(font_root/'Vera.ttf')
    bold_path = str(font_root/'VeraBd.ttf')
    def font(size, bold=False):
        return ImageFont.truetype(bold_path if bold else font_path, size)
    mark = Image.new('RGB', (512, 512), '#d1f87b')
    d = ImageDraw.Draw(mark)
    d.text((50, 106), 'gb.', font=font(260, True), fill='#18220c', stroke_width=0)
    for size, name in [(180, 'apple-touch-icon.png'), (192, 'android-chrome-192x192.png'), (512, 'android-chrome-512x512.png')]:
        mark.resize((size, size), Image.Resampling.LANCZOS).save(ASSETS / name)
    mark.save(ROOT / 'favicon.ico', sizes=[(16,16), (32,32), (48,48)])
    image = Image.new('RGB', (1200, 630), '#101211')
    d = ImageDraw.Draw(image)
    for x in range(740, 1170, 26):
        for y in range(65, 570, 26):
            d.ellipse((x,y,x+1,y+1),fill='#35412e')
    d.text((70, 55), 'GIA BAO / JAVA BACKEND DEVELOPER', font=font(15), fill='#a7afa7')
    d.text((63, 161), 'Complex logic.', font=font(88,True), fill='#f0f0e7')
    d.text((63, 265), 'Clear outcomes.', font=font(88,True), fill='#d1f87b')
    d.text((70, 441), 'Thoughtful APIs. Explicit workflows. Dependable software.', font=font(21), fill='#a7afa7')
    d.line((70, 526, 1130, 526), fill='#303730')
    d.text((70, 554), 'SPRING BOOT / POSTGRESQL / TRANSACTION CORRECTNESS', font=font(12), fill='#a7afa7')
    d.text((1002, 530), 'gb.', font=font(58,True), fill='#d1f87b')
    image.save(ASSETS/'og-preview.png', optimize=True)
    print(f'Prepared {len(names)} screenshot sets, brand icons and social preview.')


if __name__ == '__main__':
    main()
