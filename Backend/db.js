import pg from 'pg';
import  dotenv  from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), 
    database: process.env.DB_NAME,
});

const db = {
    query: (text, params) => pool.query(text, params),
};

export default db;
