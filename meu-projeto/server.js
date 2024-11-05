const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rafa',
    database: 'Unifaa'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados!');
});

app.post('/api/reminder', (req, res) => {
    const { date, time, message, smsReminder } = req.body;

    const query = `INSERT INTO reminders (date, time, message, smsReminder) VALUES (?, ?, ?, ?)`;
    connection.query(query, [date, time, message, smsReminder], (error, results) => {
        if (error) {
            console.error('Erro ao inserir dados:', error);
            res.status(500).json({ message: 'Erro ao salvar o lembrete' });
            return;
        }
        res.status(200).json({ message: 'Lembrete salvo com sucesso!' });
    });
});

app.listen(3001, () => {
    console.log('Servidor rodando em http://localhost:3001');
});

// Rota para buscar todas as avaliações
app.get('/avaliacoes', (req, res) => {
    const sql = 'SELECT * FROM avaliacao';
 
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados na tabela `avaliacao`:', err);
            res.status(500).json({ error: 'Erro ao buscar dados' });
        } else {
            res.status(200).json(results);
        }
    });
 });
 