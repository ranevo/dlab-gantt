import mysql from 'mysql2/promise';

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'dlab_gantt',
  DB_POOL_SIZE = '10',
} = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(DB_POOL_SIZE),
  queueLimit: 0,
  timezone: 'Z',
});

export default pool;
