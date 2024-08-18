const isDev = process.env.NODE_ENV === 'development';

export const langchainServer = isDev ? "http://localhost:8000" : ""
export const neo4jApi = isDev ? "http://localhost:8001" : ""