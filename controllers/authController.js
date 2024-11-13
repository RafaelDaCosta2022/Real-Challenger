// controllers/authController.js
const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.login = async (req, res) => {
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

        req.session.userId = user.id;
        res.json({ success: true, message: 'Login realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
};

exports.register = async (req, res) => {
    const { nome, email, senha, telefone, endereco, ra, data_nascimento } = req.body;

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
            res.status(500).json({ success: false, message: 'Erro ao cadastrar.' });
        }
    }
};
