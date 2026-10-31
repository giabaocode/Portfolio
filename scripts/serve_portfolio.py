"""Serve only the public artifact, on loopback."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
import argparse

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=4321)
args = parser.parse_args()
directory = root/'dist'
if not (directory/'index.html').is_file():
    raise SystemExit('Build the public artifact first: npm run build')
handler = partial(SimpleHTTPRequestHandler, directory=str(directory))
server = ThreadingHTTPServer(('127.0.0.1', args.port), handler)
print(f'Portfolio: http://127.0.0.1:{args.port}', flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    server.server_close()
