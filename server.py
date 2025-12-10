import http.server
import socketserver
import sys

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def guess_type(self, path):
        mimetype = super().guess_type(path)
        if path.endswith(".js"):
            return "application/javascript"
        return mimetype

# Allow port reuse
socketserver.TCPServer.allow_reuse_address = True

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
except OSError:
    print(f"Port {PORT} is busy, trying {PORT+1}")
    with socketserver.TCPServer(("", PORT+1), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT+1}")
        httpd.serve_forever()
