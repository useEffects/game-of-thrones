import json
import os
from langchain_community.agent_toolkits.json.base import create_json_agent
from langchain_community.agent_toolkits.json.toolkit import JsonToolkit
from langchain_community.tools.json.tool import JsonSpec
from langchain_ollama.llms import OllamaLLM

characters_json_path = "../../../assets/data/nodes.json"
with open(characters_json_path, "r", encoding="utf-8-sig") as f:
    data = json.load(f)

spec = JsonSpec(dict_={"data": data}, max_value_length=4000)
toolkit = JsonToolkit(spec=spec)
agent = create_json_agent(
    llm=OllamaLLM(model="llama3.1"),
    toolkit=toolkit,
    max_iterations=1000,
    verbose=True,
    agent_executor_kwargs={"handle_parsing_errors": True},
)
print(
    agent.run(
        "Who killed Tywin Lannister?",
    )
)
