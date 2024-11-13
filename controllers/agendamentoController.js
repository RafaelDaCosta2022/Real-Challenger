// controllers/agendamentoController.js
const db = require('../config/db');

exports.create = async (req, res) => {
    const { titulo, data, horario, local, lembrarEmail, lembrarSms } = req.body;
    try {
        const sql = 'INSERT INTO agendamentos (titulo, data, horario, local, lembrarEmail, lembrarSms) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [titulo, data, horario, local, lembrarEmail, lembrarSms]);
        res.json({ success: true, message: 'Agendamento criado com sucesso!', data: result });
    } catch (err) {
        console.error('Erro ao inserir dados no banco:', err);
        res.status(500).json({ error: 'Erro ao agendar a avaliação' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const sqlQuery = 'SELECT * FROM agendamentos ORDER BY data ASC, horario ASC';
        const [results] = await db.query(sqlQuery);
        res.json(results);
    } catch (err) {
        console.error('Erro ao buscar avaliações:', err);
        res.status(500).json({ error: 'Erro ao buscar avaliações' });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const sqlQuery = 'SELECT * FROM agendamentos WHERE id = ?';
        const [results] = await db.query(sqlQuery, [id]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Agendamento não encontrado.' });
        }

        res.json(results[0]);
    } catch (err) {
        console.error('Erro ao buscar agendamento:', err);
        res.status(500).json({ success: false, message: 'Erro ao buscar agendamento' });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { titulo, data, horario, local } = req.body;
    try {
        const sql = 'UPDATE agendamentos SET titulo = ?, data = ?, horario = ?, local = ? WHERE id = ?';
        const [result] = await db.query(sql, [titulo, data, horario, local, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Agendamento não encontrado.' });
        }

        res.json({ success: true, message: 'Agendamento atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar agendamento' });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM agendamentos WHERE id = ?';
        const [result] = await db.query(sql, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Agendamento não encontrado.' });
        }

        res.json({ success: true, message: 'Agendamento excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        res.status(500).json({ success: false, message: 'Erro ao excluir agendamento' });
    }
};
