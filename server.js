const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const routes = require('./routes'); // Certifique-se de que o caminho está correto

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para interpretar JSON
app.use(express.json());

// Configuração de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true,
}));

// Configuração de sessão
app.use(session({
    secret: 'seu_segredo_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    }
}));

// Usa o roteador configurado em `routes.js`
app.use(routes);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'Login')));
app.use(express.static(path.join(__dirname, 'Home')));
app.use(express.static(path.join(__dirname, 'Avaliacao')));
app.use(express.static(path.join(__dirname, 'Contatos')));
app.use(express.static(path.join(__dirname, 'Boletim')));

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
