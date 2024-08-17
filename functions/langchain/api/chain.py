import os
from langchain.chains import GraphCypherQAChain
from langchain_community.graphs import Neo4jGraph
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI

NEO4J_URI = os.environ.get("NEO4J_URI")
NEO4J_USERNAME = os.environ.get("NEO4J_USERNAME")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD")

graph = Neo4jGraph(
    url=NEO4J_URI,
    username=NEO4J_USERNAME,
    password=NEO4J_PASSWORD,
)

ollama_model = ChatOllama(temperature=0, model="llama3.1")
openai_model = ChatOpenAI(temperature=0, model="gpt-4o")

chain = GraphCypherQAChain.from_llm(
    ollama_model,
    graph=graph,
    use_function_response=True,
    return_intermediate_steps=True,
)
