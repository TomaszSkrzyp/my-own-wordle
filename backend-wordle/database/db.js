
import pkg from 'pg';
const { Pool } = pkg;


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'wordle_clone',
    password: 'Haslopg123',
    port: 5432,
});

export default pool;
