// Import nodes from CSV
LOAD CSV WITH HEADERS FROM 'file:///home/aprilia/Projects/nodejs/game-of-thrones/neo4j-source/nodes.csv' AS row
MERGE (n:Person {id: row.id})  // Adjust label and properties as needed
SET n.name = row.name         // Add more properties if needed
RETURN n;

// Import relationships from CSV
LOAD CSV WITH HEADERS FROM 'file:///home/aprilia/Projects/nodejs/game-of-thrones/neo4j-source/relationships.csv' AS row
MATCH (a:Person {id: row.startId}), (b:Person {id: row.endId})  // Adjust labels if needed
MERGE (a)-[r:RELATIONSHIP_TYPE {type: row.type}]->(b)  // Replace RELATIONSHIP_TYPE with your relationship type
RETURN r;
