
import pkg from 'pg';
import { env } from '../config/validateEnv.js';
const { Pool } = pkg;

/*
Initialize and export a PostgreSQL connection pool.

Reads database credentials from validated environment variables,
creates a new `Pool` instance, and exports it for reuse across
all database modules.
*/

const pool = new Pool({
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.POSTGRES_PASSWORD,
    port: env.DB_PORT,
});

export default pool;
