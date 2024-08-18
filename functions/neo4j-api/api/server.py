from http.server import HTTPServer
from index import handler

if __name__ == "__main__":
    server_address = ("", 8001)
    httpd = HTTPServer(server_address, handler)
    print("Starting server...")
    httpd.serve_forever()
