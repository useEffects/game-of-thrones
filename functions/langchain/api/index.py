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

API_KEY = os.environ.get("API_KEY")

graph = Neo4jGraph(
    url=NEO4J_URI,
    username=NEO4J_USERNAME,
    password=NEO4J_PASSWORD,
)


def get_chain():
    ollama_model = ChatOllama(temperature=0, model="llama3.1")
    openai_model = ChatOpenAI(temperature=0, model="gpt-3.5-turbo", api_key=API_KEY)
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
        self.send_response(200)
        self.add_cors_headers()
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
        chain = get_chain()
        response = chain.invoke(input)
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.add_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps({"response": response}).encode("utf-8"))


    def add_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
