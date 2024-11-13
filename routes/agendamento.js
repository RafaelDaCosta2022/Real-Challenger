// routes/agendamento.js
const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

// Rota para criar um novo agendamento
router.post('/agendar', agendamentoController.create);

// Rota para buscar todos os agendamentos
router.get('/avaliacoes', agendamentoController.getAll);

// Rota para buscar um agendamento específico
router.get('/avaliacoes/:id', agendamentoController.getById);

// Rota para editar um agendamento
router.put('/avaliacoes/:id', agendamentoController.update);

// Rota para excluir um agendamento
router.delete('/avaliacoes/:id', agendamentoController.delete);

// Código para buscar todos os agendamentos
fetch('http://localhost:3001/agendamento/avaliacoes') // Adicione o prefixo "/agendamento"
    .then(response => response.json())
    .then(data => {
        console.log('Agendamentos recebidos:', data);
        // Aqui você pode processar os dados e exibir no frontend
    })
    .catch(error => console.error('Erro ao buscar agendamentos:', error));


module.exports = router;
