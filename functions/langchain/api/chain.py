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
    model = openai_model if (NODE_ENV == "production" or VERCEL_ENV == "production") else ollama_model
    return GraphCypherQAChain.from_llm(
        model,
        graph=graph,
        use_function_response=True,
        return_intermediate_steps=True,
    )
