const express = require('express');
const router = express.Router();
const db = require('./config/db');
const bcrypt = require('bcrypt');

// Rota para agendar (Criar um novo agendamento)
router.post('/agendar', async (req, res) => {
    const { titulo, data, horario, local, lembrarEmail, lembrarSms } = req.body;
    console.log("Dados recebidos para agendamento:", { titulo, data, horario, local, lembrarEmail, lembrarSms });
    try {  
        const sql = 'INSERT INTO agendamentos (titulo, data, horario, local, lembrarEmail, lembrarSms) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [titulo, data, horario, local, lembrarEmail, lembrarSms]);
        res.json({ success: true, message: 'Agendamento criado com sucesso!', data: result });
    } catch (err) {
        console.error('Erro ao inserir dados no banco:', err);
        res.status(500).json({ error: 'Erro ao agendar a avaliação' });
    }
});

// Rota para buscar todos os agendamentos
router.get('/avaliacoes', async (req, res) => {
    try {
        const sqlQuery = 'SELECT * FROM agendamentos ORDER BY data ASC, horario ASC';
        const [results] = await db.query(sqlQuery);
        res.json(results);
    } catch (err) {
        console.error('Erro ao buscar avaliações:', err);
        res.status(500).json({ error: 'Erro ao buscar avaliações' });
    }
});

// Rota para buscar um agendamento específico
router.get('/avaliacoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sqlQuery = 'SELECT * FROM agendamentos WHERE id = ?';
        const [results] = await db.query(sqlQuery, [id]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Agendamento não encontrado.' });
        }

        res.json(results[0]); // Retorna o agendamento encontrado
    } catch (err) {
        console.error('Erro ao buscar agendamento:', err);
        res.status(500).json({ success: false, message: 'Erro ao buscar agendamento' });
    }
});

// Rota para editar um agendamento
router.put('/avaliacoes/:id', async (req, res) => {
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
});

// Rota para excluir um agendamento
router.delete('/avaliacoes/:id', async (req, res) => {
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
});

// Rota para login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
    }

    try {
        const sqlQuery = 'SELECT * FROM usuarios WHERE email = ?';
        const [results] = await db.query(sqlQuery, [email]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Email não cadastrado.' });
        }

        const user = results[0];
        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ success: false, message: 'Senha incorreta.' });
        }

        req.session.userId = user.id; // Armazena o ID do usuário na sessão
        res.json({ success: true, message: 'Login realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ success: false, message: 'Email não cadastrado no servidor. Tente novamente mais tarde.' });
    }
});

// Rota de CadastroEe
router.post('/cadastro', async (req, res) => {
    const { nome, email, senha, telefone, endereco, ra, data_nascimento } = req.body;

    console.log("Dados recebidos no backend para cadastro:", { ra });

    if (!nome || !email || !senha || !telefone || !endereco || !data_nascimento || !ra) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos.' });
    }

    try {
        const hashSenha = await bcrypt.hash(senha, 10);
        const query = `
            INSERT INTO usuarios 
            (nome, email, senha, telefone, endereco, ra, data_nascimento, status, papel, data_criacao) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'ativo', 'cliente', NOW())
        `;

        await db.execute(query, [nome, email, hashSenha, telefone, endereco, ra, data_nascimento]);

        res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: 'Este email ou RA já está cadastrado.' });
        } else {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ success: false, message: 'Erro ao cadastrar. Tente novamente.' });
        }
    }
});

// Rota de Logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao fazer logout.' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout realizado com sucesso.' });
    });
});



// Rota para buscar o perfil do usuário
router.get('/usuario/perfil', async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: "Usuário não autenticado" });
    }

    try {
        const sqlQuery = 'SELECT nome, ra FROM usuarios WHERE id = ?';
        const [user] = await db.query(sqlQuery, [userId]);

        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado" });
        }

        res.json({ success: true, nome: user[0].nome, ra: user[0].ra });
    } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        res.status(500).json({ success: false, message: "Erro ao buscar perfil" });
    }
});

// No perfilRoutes.js
router.get('/perfil', verificaAutenticacao, async (req, res) => {
    const userId = req.session.userId;
    try {
        const sqlQuery = 'SELECT nome, ra, foto FROM usuarios WHERE id = ?';
        const [results] = await db.query(sqlQuery, [userId]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }

        res.json({ success: true, ...results[0] });
    } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        res.status(500).json({ success: false, message: 'Erro ao buscar perfil' });
    }
});

// Middleware para verificar autenticação
function verificaAutenticacao(req, res, next) {
    if (req.session && req.session.userId) {
        // Usuário está autenticado, prossiga
        next();
    } else {
        // Usuário não autenticado, envie erro 401
        res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    }
}


// Middleware para verificar autenticação
function verificaAutenticacao(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    }
}

// Rota para agendar (Criar um novo agendamento)
router.post('/agendar', async (req, res) => {
    const { titulo, data, horario, local, lembrarEmail, lembrarSms } = req.body;
    console.log("Dados recebidos para agendamento:", { titulo, data, horario, local, lembrarEmail, lembrarSms });
    try {
        const sql = 'INSERT INTO agendamentos (titulo, data, horario, local, lembrarEmail, lembrarSms) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [titulo, data, horario, local, lembrarEmail, lembrarSms]);
        res.json({ success: true, message: 'Agendamento criado com sucesso!', data: result });
    } catch (err) {
        console.error('Erro ao inserir dados no banco:', err);
        res.status(500).json({ error: 'Erro ao agendar a avaliação' });
    }
});

// Outras rotas para agendamentos e login/cadastro...

// Rota para buscar o perfil do usuário autenticado
router.get('/usuario/perfil', verificaAutenticacao, async (req, res) => {
    const userId = req.session.userId;

    try {
        const sqlQuery = 'SELECT nome, ra, foto FROM usuarios WHERE id = ?';
        const [results] = await db.query(sqlQuery, [userId]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }

        res.json({ success: true, nome: results[0].nome, ra: results[0].ra, foto: results[0].foto });
    } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        res.status(500).json({ success: false, message: 'Erro ao buscar perfil' });
    }
});




module.exports = router;
