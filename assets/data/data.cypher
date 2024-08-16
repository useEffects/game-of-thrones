// Step 1: Delete everything in the database
MATCH (n)
DETACH DELETE n;

// Step 2: Load JSON and create nodes
CALL apoc.load.json("file:///home/aprilia/Projects/nodejs/game-of-thrones/assets/data/characters-final.json") YIELD value AS character
MERGE (c:Character {name: character.name})
SET c.houseName = coalesce(character.houseName, []),
    c.characterImageThumb = coalesce(character.characterImageThumb, ""),
    c.characterImageFull = coalesce(character.characterImageFull, ""),
    c.characterLink = coalesce(character.characterLink, ""),
    c.actorName = coalesce(character.actorName, ""),
    c.actorLink = coalesce(character.actorLink, ""),
    c.royal = coalesce(character.royal, false),
    c.gender = coalesce(character.gender, ""),
    c.born = coalesce(character.born, ""),
    c.origin = coalesce(character.origin, ""),
    c.death = coalesce(character.death, ""),
    c.status = coalesce(character.status, ""),
    c.culture = coalesce(character.culture, ""),
    c.religion = coalesce(character.religion, ""),
    c.titles = coalesce(character.titles, []),
    c.house = coalesce(character.house, ""),
    c.actor = coalesce(character.actor, "");

// Step 3: Create relationships (optional, as explained earlier)
WITH c, character
UNWIND coalesce(character.parents, []) AS parent
MERGE (p:Character {name: parent})
MERGE (p)-[:PARENT_OF]->(c);

WITH c, character
UNWIND coalesce(character.siblings, []) AS sibling
MERGE (s:Character {name: sibling})
MERGE (c)-[:SIBLING_OF]->(s);

WITH c, character
UNWIND coalesce(character.killed, []) AS killed
MERGE (k:Character {name: killed})
MERGE (c)-[:KILLED]->(k);

WITH c, character
UNWIND coalesce(character.killedBy, []) AS killer
MERGE (k:Character {name: killer})
MERGE (k)-[:KILLED]->(c);
