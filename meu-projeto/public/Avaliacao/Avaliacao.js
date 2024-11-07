document.addEventListener("DOMContentLoaded", function() {
    carregarAvaliacoes();
});

function carregarAvaliacoes() {
    fetch('http://localhost:3000/avaliacoes')
        .then(response => response.json())
        .then(data => {
            exibirAvaliacoes(data); // Exibe as avaliações retornadas
        })
        .catch(error => {
            console.error('Erro ao carregar avaliações:', error);
            const avaliacoesContainer = document.getElementById('avaliacoesContainer');
            avaliacoesContainer.innerHTML = '<p>Erro ao carregar as avaliações. Tente novamente mais tarde.</p>';
        });
}

function exibirAvaliacoes(avaliacoes) {
    const avaliacoesContainer = document.getElementById('avaliacoesContainer');
    avaliacoes.forEach(avaliacao => {
        const avaliacaoElement = document.createElement('div');
        avaliacaoElement.className = 'provas';
        avaliacaoElement.innerHTML = `
            <img src="${avaliacao.imagem}" alt="${avaliacao.titulo}">
            <div class="info">
                <h3>${avaliacao.titulo}</h3>
                <p><strong>Data:</strong> ${avaliacao.data}</p>
                <p><strong>Horário:</strong> ${avaliacao.horario}</p>
                <p><strong>Local:</strong> ${avaliacao.local}</p>
                <div class="btn-class">
                    <button type="button" class="editar">Editar</button>
                    <button type="button" class="agendar">Agendar</button>
                </div>
            </div>
        `;
        avaliacoesContainer.appendChild(avaliacaoElement);
    });
}
