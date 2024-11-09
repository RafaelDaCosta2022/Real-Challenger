const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rafa',
    database: 'Unifaa'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso');

    // Teste de consulta para verificar os dados
    db.query('SELECT * FROM agendamentos', (err, results) => {
        if (err) {
            console.error('Erro ao executar consulta:', err);
        } else {
            console.log('Resultados:', results);
        }
        db.end(); // Fecha a conexão após a consulta
    });
});
