const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const routes = require('./routes'); // Importa o roteador configurado

const app = express(); // Define a instância do Express

// Configuração do CORS com credenciais permitidas para localhost:5500
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));

app.use(express.json());

// Configuração de sessão
app.use(session({
    secret: 'seu_segredo_seguro', // Use um segredo forte aqui
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Altere para true se estiver usando HTTPS
}));

// Aplica as rotas definidas no routes.js
app.use(routes);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'Login')));
app.use(express.static(path.join(__dirname, 'Home')));
app.use(express.static(path.join(__dirname, 'Avaliacao')));
app.use(express.static(path.join(__dirname, 'Contatos')));
app.use(express.static(path.join(__dirname, 'Boletim')));

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000.');
});
