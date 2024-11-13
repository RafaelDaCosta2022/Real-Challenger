// db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',           // Substitua pelo usuário do banco de dados
    password: 'rafa',       // Substitua pela senha do banco de dados
    database: 'Unifaa',     // Substitua pelo nome do banco de dados
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db; // Exporta o pool de conexões
