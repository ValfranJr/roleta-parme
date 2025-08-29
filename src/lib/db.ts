import { Pool } from "pg";

// Verificar se a variável de ambiente está definida
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

// Criar pool de conexões em vez de cliente único
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo limite para conexões ociosas
  connectionTimeoutMillis: 2000, // Tempo limite para estabelecer conexão
});

// Função para verificar a conexão
async function testConnection() {
  try {
    await query("SELECT NOW()");
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

// Função para criar a tabela se não existir
async function createTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS coupon_users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(20) NOT NULL UNIQUE,
      coupon_won VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createTableQuery);
    console.log("Table coupon_users ensured to exist.");
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
}

// Função para inicializar o banco de dados
async function initializeDatabase() {
  try {
    await testConnection();
    await createTable();
  } catch (error) {
    console.error("Failed to initialize database:", error);
    // Não rejeitar a aplicação se o banco falhar, apenas logar o erro
  }
}

// Inicializar o banco quando o módulo for importado
initializeDatabase();

// Função para obter uma conexão do pool
export async function getClient() {
  return await pool.connect();
}

// Função para executar queries de forma segura
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Exportar o pool para uso direto se necessário
export { pool as client };
