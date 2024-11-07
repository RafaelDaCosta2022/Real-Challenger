const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',     // substitua pelo host do seu banco, se diferente
    user: 'root',          // substitua pelo seu nome de usuário do banco de dados
    password: 'rafa',      // substitua pela senha do banco de dados
    database: 'Unifaa'     // certifique-se de que o nome do banco está correto
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso');
});

// Rota para receber dados do formulário
app.post('/agendar', (req, res) => {
    let { titulo, data, horario, local, lembrarEmail, lembrarSms } = req.body;

    // Verificar se os checkboxes foram marcados, senão defina como 0
    lembrarEmail = lembrarEmail ? 1 : 0;
    lembrarSms = lembrarSms ? 1 : 0;

    const sql = 'INSERT INTO agendamentos (titulo, data, horario, local, lembrarEmail, lembrarSms) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [titulo, data, horario, local, lembrarEmail, lembrarSms], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados no banco:', err); // Log detalhado
            res.status(500).send('Erro ao agendar a avaliação');
            return;
        }
        // Retorne os dados enviados de volta para o cliente
        res.json({ titulo, data, horario, local, lembrarEmail, lembrarSms });
    });
});

// Rota para obter todas as avaliações
app.get('/avaliacoes', (req, res) => {
    const sqlQuery = 'SELECT * FROM agendamentos'; // Substitua pelo nome correto da sua tabela
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Erro ao buscar avaliações:', err);
            res.status(500).send('Erro ao buscar avaliações');
        } else {
            res.json(results); // Retorna as avaliações em formato JSON
        }
    });
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Função para carregar avaliações do backend
function carregarAvaliacoes() {
    fetch('http://localhost:3000/avaliacoes') // Endpoint para pegar as avaliações
        .then(response => response.json()) // Converte a resposta em JSON
        .then(data => {
            console.log(data); // Verifique se está carregando as avaliações
            exibirAvaliacoes(data); // Chama função para exibir as avaliações
        })
        .catch(error => {
            console.error('Erro ao carregar avaliações:', error);
        });
}
