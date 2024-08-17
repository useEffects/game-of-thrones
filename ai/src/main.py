from langchain.chains import GraphCypherQAChain
from langchain_community.graphs import Neo4jGraph
from langchain_ollama import ChatOllama
import constants.main

graph = Neo4jGraph(
    url=constants.main.NEO4J_URI,
    username=constants.main.NEO4J_USERNAME,
    password=constants.main.NEO4J_PASSWORD,
)

model = ChatOllama(temperature=0, model="llama3.1", format="json")

chain = GraphCypherQAChain.from_llm(model, graph=graph, verbose=True)

chain.run("Who is the parent of Tywin Lannister?")
