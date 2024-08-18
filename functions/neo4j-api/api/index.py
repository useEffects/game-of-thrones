from http.server import BaseHTTPRequestHandler
import json
from lib import fetch_response


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.add_cors_headers()
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.add_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps({"message": "Hello, world!"}).encode("utf-8"))

    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)
        json_data = json.loads(post_data.decode("utf-8"))
        query = json_data.get("query")
        response = fetch_response(query)
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.add_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps({"response": response}).encode("utf-8"))

    def add_cors_headers(self):
        allowed_origins = [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5173",
            "https://got.joelsamuel.me",
        ]
        origin = self.headers.get("Origin")
        if origin in allowed_origins:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
