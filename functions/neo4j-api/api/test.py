from lib import fetch_response

query = "MATCH (n:Character {name: 'Tyrion Lannister'})-[r]-(m) RETURN n, r, m limit 10"

response = fetch_response(query)

print(response["relationships"])
