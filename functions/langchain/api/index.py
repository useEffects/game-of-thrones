from http.server import BaseHTTPRequestHandler
import json
import os
from langchain.chains import GraphCypherQAChain
from langchain_community.graphs import Neo4jGraph
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI

NEO4J_URI = os.environ.get("NEO4J_URI")
NEO4J_USERNAME = os.environ.get("NEO4J_USERNAME")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD")

NODE_ENV = os.environ.get("NODE_ENV")
VERCEL_ENV = os.environ.get("VERCEL_ENV")

graph = Neo4jGraph(
    url=NEO4J_URI,
    username=NEO4J_USERNAME,
    password=NEO4J_PASSWORD,
)


def get_chain(api_key):
    ollama_model = ChatOllama(temperature=0, model="llama3.1")
    openai_model = ChatOpenAI(temperature=0, model="gpt-4o", api_key=api_key)
    model = (
        openai_model
        if (NODE_ENV == "production" or VERCEL_ENV == "production")
        else ollama_model
    )
    return GraphCypherQAChain.from_llm(
        model,
        graph=graph,
        use_function_response=True,
        return_intermediate_steps=True,
    )


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
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
