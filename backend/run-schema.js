require('dotenv').config();

const fs = require('fs');
const mysql = require('mysql2/promise');

async function runSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
      rejectUnauthorized: false,
    },

    multipleStatements: true,
  });

  console.log('Connected to Aiven MySQL');

  const sql = fs.readFileSync('schema.sql', 'utf8');

  await connection.query(sql);

  console.log('Database tables created successfully!');

  await connection.end();
}

runSchema().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
