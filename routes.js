const express = require('express');
const router = express.Router();
const db = require('./Avaliacao/db');
const bcrypt = require('bcrypt');

// Rota para agendar
router.post('/agendar', (req, res) => {
    const { titulo, data, horario, local, lembrarEmail, lembrarSms } = req.body;

    const sql = 'INSERT INTO agendamentos (titulo, data, horario, local, lembrarEmail, lembrarSms) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [titulo, data, horario, local, lembrarEmail, lembrarSms], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados no banco:', err);
            return res.status(500).json({ error: 'Erro ao agendar a avaliação' });
        }
        res.json({ success: true, message: 'Agendamento criado com sucesso!', data: result });
    });
});

// Rota para editar um agendamento
router.put('/avaliacoes/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, data, horario, local } = req.body;

    const sql = 'UPDATE agendamentos SET titulo = ?, data = ?, horario = ?, local = ? WHERE id = ?';
    db.query(sql, [titulo, data, horario, local, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar agendamento:', err);
            return res.status(500).json({ error: 'Erro ao atualizar agendamento' });
        }
        res.json({ success: true, message: 'Agendamento atualizado com sucesso!' });
    });
});

// Rota para excluir um agendamento
router.delete('/avaliacoes/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM agendamentos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir agendamento:', err);
            return res.status(500).json({ error: 'Erro ao excluir agendamento' });
        }
        res.json({ success: true, message: 'Agendamento excluído com sucesso!' });
    });
});

// Rota para buscar todos os agendamentos
router.get('/avaliacoes', (req, res) => {
    const sqlQuery = 'SELECT * FROM agendamentos ORDER BY data ASC, horario ASC';
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Erro ao buscar avaliações:', err);
            res.status(500).send('Erro ao buscar avaliações');
        } else {
            res.json(results);
        }
    });
});

// Rota para buscar um agendamento específico pelo ID
router.get('/avaliacoes/:id', (req, res) => {
    const { id } = req.params;

    const sqlQuery = 'SELECT * FROM agendamentos WHERE id = ?';
    db.query(sqlQuery, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar o agendamento:', err);
            return res.status(500).json({ error: 'Erro ao buscar o agendamento' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        res.json(results[0]); // Retorna o primeiro (e único) resultado
    });
});

module.exports = router;
