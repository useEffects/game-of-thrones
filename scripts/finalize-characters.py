import json


with open("../assets/data/characters.json", "r") as file:
    characters = json.load(file)

with open("../assets/data/characters2.json", "r") as file:
    characters2 = json.load(file)

new_characters_data = []
for character in characters["characters"]:
    final_character = character
    character_in_character2 = [
        x for x in characters2 if x["name"] == character["characterName"]
    ]
    if len(character_in_character2) > 0:
        final_character = character | character_in_character2[0]

    new_characters_data.append(final_character)

with open("../assets/data/characters-final.json", "w") as file:
    json.dump(new_characters_data, file, indent=2)
