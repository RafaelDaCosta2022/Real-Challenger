// Função para carregar e exibir todos os agendamentos
function carregarAvaliacoes() {
    fetch('http://localhost:3000/api/avaliacoes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar as avaliações');
            }
            return response.json();
        })
        .then(data => {
            const agendamentosList = document.getElementById('agendamentos-list');
            agendamentosList.innerHTML = ''; // Limpa a lista

            data.forEach(agendamento => {
                const agendamentoDiv = document.createElement('div');
                agendamentoDiv.classList.add('agendamento-item');
                agendamentoDiv.innerHTML = `
                    <h4>${agendamento.titulo}</h4>
                    <p>Data: <input type="date" value="${new Date(agendamento.data).toISOString().split('T')[0]}" id="data-${agendamento.id}"></p>
                    <p>Horário: <input type="time" value="${agendamento.horario}" id="horario-${agendamento.id}"></p>
                    <p>Local: <input type="text" value="${agendamento.local}" id="local-${agendamento.id}"></p>
                    <button onclick="salvarAvaliacao(${agendamento.id})">Salvar</button>
                    <button onclick="excluirAvaliacao(${agendamento.id})">Excluir</button>
                `;
                agendamentosList.appendChild(agendamentoDiv);
            });
        })
        .catch(error => console.error('Erro ao carregar avaliações:', error));
}

// Função para carregar e exibir todos os agendamentos
function carregarAvaliacoes() {
    console.log('Carregando avaliações...'); // Log para verificação
    fetch('http://localhost:3000/avaliacoes') // Certifique-se de que esta URL esteja correta
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar as avaliações'); // Gera um erro se a resposta não for ok
            }
            return response.json();
        })
        .then(data => {
            const agendamentosList = document.getElementById('agendamentos-list');
            agendamentosList.innerHTML = ''; // Limpa a lista

            data.forEach(agendamento => {
                const agendamentoDiv = document.createElement('div');
                agendamentoDiv.classList.add('agendamento-item');
                agendamentoDiv.innerHTML = `
                    <h4>${agendamento.titulo}</h4>
                    <p>Data: ${new Date(agendamento.data).toLocaleDateString()}</p>
                    <p>Horário: ${agendamento.horario}</p>
                    <p>Local: ${agendamento.local}</p>
                    <button onclick="editarAvaliacao(${agendamento.id})">Editar</button>
                    <button onclick="excluirAvaliacao(${agendamento.id})">Excluir</button>
                `;
                agendamentosList.appendChild(agendamentoDiv);
            });
        })
        .catch(error => console.error('Erro ao carregar avaliações:', error));
}


// Função para salvar as alterações em um agendamento
function salvarAvaliacao(id) {
    const data = document.getElementById(`data-${id}`).value;
    const horario = document.getElementById(`horario-${id}`).value;
    const local = document.getElementById(`local-${id}`).value;

    fetch(`http://localhost:3000/api/avaliacoes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: data,
            horario: horario,
            local: local
        })
    })
    .then(response => response.ok ? carregarAvaliacoes() : alert('Erro ao atualizar'))
    .catch(error => console.error('Erro ao atualizar avaliação:', error));
}
// Rota para obter todas as avaliações
app.get('/avaliacoes', (req, res) => {
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



fetch('http://localhost:3000/avaliacoes')


// Carregar as avaliações ao iniciar a página
window.onload = carregarAvaliacoes;
