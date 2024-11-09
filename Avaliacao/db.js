// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Insira o usuário correto
    password: 'rafa',    // Insira a senha correta
    database: 'Unifaa'   // Insira o nome correto do banco de dados
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso');
});

module.exports = db; // Exporta a conexão
