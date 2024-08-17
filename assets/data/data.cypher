// Step 1: Clean the database
MATCH (n)
DETACH DELETE n;

// Step 2: Load and create Characters
CALL apoc.load.json("https://raw.githubusercontent.com/useEffects/game-of-thrones/main/assets/data/characters-final.json") YIELD value AS character
MERGE (c:Character { name: character.characterName })
SET c.house = coalesce(character.house, ""),
    c.characterImageThumb = coalesce(character.characterImageThumb, ""),
    c.characterImageFull = coalesce(character.characterImageFull, ""),
    c.characterLink = coalesce(character.characterLink, ""),
    c.actorName = coalesce(character.actorName, ""),
    c.actorLink = coalesce(character.actorLink, ""),
    c.royal = coalesce(character.royal, false ),
    c.gender = coalesce(character.gender, ""),
    c.born = coalesce(character.born, ""),
    c.origin = coalesce(character.origin, ""),
    c.death = coalesce(character.death, ""),
    c.status = coalesce(character.status, ""),
    c.culture = coalesce(character.culture, ""),
    c.religion = coalesce(character.religion, ""),
    c.titles = coalesce(character.titles, []),
    c.seasons = coalesce(character.seasons, []);

// Step 3: Load and create Houses
CALL apoc.load.json("https://raw.githubusercontent.com/useEffects/game-of-thrones/main/assets/data/houses.json") YIELD value AS house
MERGE (h:House { name: house.name })
SET h.sigil = coalesce(h.sigil, ""),
    h.words = coalesce(h.words, ""),
    h.seat = coalesce(h.seat, ""),
    h.region = coalesce(h.region, ""),
    h.founder = coalesce(h.founder, "");

// Step 4: Load and create Places
CALL apoc.load.json("https://raw.githubusercontent.com/useEffects/game-of-thrones/main/assets/data/places.json") YIELD value AS place
MERGE (p:Place { name: place.name })
SET p.type = coalesce(place.type, ""),
    p.location = coalesce(place.location, ""),
    p.rulers = coalesce(place.rulers, "");

// Step 5: Create Relationships
// Unidirectional Relationships
CALL apoc.load.json("https://raw.githubusercontent.com/useEffects/game-of-thrones/main/assets/data/characters-final.json") YIELD value AS character
MATCH (c:Character { name: character.characterName })
FOREACH (victim IN character.killed |
MERGE (k:Character { name: victim })
MERGE (c)-[:KILLED]->(k)
)
FOREACH (parent IN character.parents |
MERGE (p:Character { name: parent })
MERGE (c)<-[:PARENT]-(p)
)
FOREACH (serve IN character.serves |
MERGE (s:Character { name: serve })
MERGE (c)-[:SERVES]->(s)
)
FOREACH (guardianOf IN character.guardianOf |
MERGE (g:Character { name: guardianOf })
MERGE (c)-[:GUARDIAN_OF]->(g)
)
FOREACH (ally IN character.allies |
MERGE (a:Character { name: ally })
MERGE (c)-[:ALLY]->(a)
)

// Bi-Directional Relationships
FOREACH (sibling IN character.siblings |
MERGE (s:Character { name: sibling })
MERGE (c)-[:SIBLING]->(s)
MERGE (s)-[:SIBLING]->(c)
)
FOREACH (lover IN character.lovers |
MERGE (l:Character { name: lover })
MERGE (c)-[:LOVER]->(l)
MERGE (l)-[:LOVER]->(c)
)
FOREACH (spouse IN character.marriedEngaged |
MERGE (s:Character { name: spouse })
MERGE (c)-[:SPOUSE]->(s)
MERGE (s)-[:SPOUSE]->(c)
);

// Relationships between Characters and Houses
CALL apoc.load.json("https://raw.githubusercontent.com/useEffects/game-of-thrones/main/assets/data/characters-final.json") YIELD value AS character
MATCH (c:Character { name: character.characterName })
MATCH (h:House { name: character.house })
MERGE (c)-[:BELONGS_TO]->(h)
WITH c, character
MATCH (p:Place { rulers: character.house })
MERGE (c)-[:LIVES_IN]->(p);

// Relationships between Houses
CALL apoc.load.json("https://raw.githubusercontent.com/useEffects/game-of-thrones/main/assets/data/houses.json") YIELD value AS house
MATCH (h:House { name: house.name })
FOREACH (vassal IN house.vassals |
MERGE (v:House { name: vassal })
MERGE (v)-[:VASSAL_OF]->(h)
);
