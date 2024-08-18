from http.server import BaseHTTPRequestHandler
import json
import os
from neo4j import GraphDatabase, Result

NEO4J_URI = os.environ.get("NEO4J_URI")
NEO4J_USERNAME = os.environ.get("NEO4J_USERNAME")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD")

def fetch_response(query):
    with GraphDatabase.driver(
        NEO4J_URI, auth=(NEO4J_USERNAME, NEO4J_PASSWORD)
    ) as driver:
        driver.verify_connectivity()
        query_result = driver.execute_query(
            query_=query,
            database_="neo4j",
            result_transformer_=Result.graph,
        )
        nodes = []
        relationships = []
        for node in query_result._nodes.items():
            nodes.append(
                {
                    "id": node[1].id,
                    "labels": list(node[1].labels),
                    "properties": {key: value for key, value in node[1].items()},
                }
            )
        for relationship in query_result._relationships.items():
            relationships.append(
                {
                    "id": relationship[1].id,
                    "type": relationship[1].type,
                    "start_node": relationship[1].start_node.id,
                    "end_node": relationship[1].end_node.id,
                }
            )
        return {"nodes": nodes, "relationships": relationships}

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
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
