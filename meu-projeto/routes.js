const express = require('express');
const db = require('./db'); // Importa a conexão com o banco
const router = express.Router();

// Rota para receber dados do formulário (agendar)
router.post('/agendar', (req, res) => {
    let { titulo, data, horario, local, lembrarEmail, lembrarSms } = req.body;

    lembrarEmail = lembrarEmail ? 1 : 0;
    lembrarSms = lembrarSms ? 1 : 0;

    const sql = 'INSERT INTO agendamentos (titulo, data, horario, local, lembrarEmail, lembrarSms) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [titulo, data, horario, local, lembrarEmail, lembrarSms], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados no banco:', err);
            res.status(500).send('Erro ao agendar a avaliação');
            return;
        }
        res.json({ titulo, data, horario, local, lembrarEmail, lembrarSms });
    });
});

// Rota para obter todas as avaliações
router.get('/avaliacoes', (req, res) => {
    const sqlQuery = 'SELECT * FROM agendamentos';
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Erro ao buscar avaliações:', err);
            res.status(500).send('Erro ao buscar avaliações');
        } else {
            res.json(results);
        }
    });
});

// Rota para atualizar um agendamento
router.put('/avaliacoes/:id', (req, res) => {
    const { id } = req.params;
    const { data, horario, local } = req.body;
    const sql = 'UPDATE agendamentos SET data = ?, horario = ?, local = ? WHERE id = ?';
    db.query(sql, [data, horario, local, id], (err) => {
        if (err) {
            console.error('Erro ao atualizar:', err);
            res.status(500).send('Erro ao atualizar');
        } else {
            res.send('Atualização realizada com sucesso');
        }
    });
});

// Rota para excluir um agendamento
router.delete('/avaliacoes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM agendamentos WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Erro ao excluir:', err);
            res.status(500).send('Erro ao excluir');
        } else {
            res.send('Agendamento excluído com sucesso');
        }
    });
});

// Exporta as rotas
module.exports = router;
