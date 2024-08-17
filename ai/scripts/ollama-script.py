from langchain_ollama import OllamaEmbeddings

embed = OllamaEmbeddings(model="llama3.1")

input_text = "The quick brown fox jumps over the lazy dog."
vector = embed.embed_query(input_text)
print(vector)
