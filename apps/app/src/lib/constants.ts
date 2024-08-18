const isDev = process.env.NODE_ENV === 'development';

export const langchainServer = isDev ? "http://localhost:8000" : "https://langchain.got.joelsamuel.me"
export const neo4jApi = isDev ? "http://localhost:8001" : "https://neo4j-api.got.joelsamuel.me"