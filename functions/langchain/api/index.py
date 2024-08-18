from http.server import BaseHTTPRequestHandler
import json
from chain import get_chain

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)
        json_data = json.loads(post_data.decode("utf-8"))
        input = json_data.get("input")
        api_key = json_data.get("api_key")
        chain = get_chain(api_key)
        response = chain.invoke(input)
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
            self.send_header("Access-Control-Allow-Methods", "GET, POST")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
