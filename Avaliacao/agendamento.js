// Função para enviar o agendamento para o servidor
function enviarAgendamento() {
    const titulo = document.getElementById("tituloIA").value;
    const data = document.getElementById("dataIA").value;
    const horario = document.getElementById("horarioIA").value;
    const local = document.getElementById("localIA").value;
    const lembrarEmail = document.getElementById("lembrarEmail").checked ? 1 : 0;
    const lembrarSms = document.getElementById("lembrarSms").checked ? 1 : 0;

    if (!titulo || !data || !horario || !local) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const agendamento = { titulo, data, horario, local, lembrarEmail, lembrarSms };
    console.log("Enviando agendamento para o servidor:", agendamento);

    fetch("http://localhost:3001/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamento)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Resposta do servidor ao criar agendamento:", data);
        if (data.success) {
            alert("Agendamento criado com sucesso!");
            fetchAgendamentos();
        } else {
            alert("Erro ao criar agendamento.");
        }
    })
    .catch(error => console.error("Erro ao enviar agendamento:", error));
}

// Função para abrir o modal de edição com os dados preenchidos
let editId = null; // Variável global para armazenar o ID do agendamento a ser editado

function editarAgendamento(id) {
    console.log("Abrindo modal de edição para o ID:", id);
    editId = id; // Armazena o ID do agendamento

    fetch(`http://localhost:3001/avaliacoes/${id}`)
        .then(response => {
            console.log("Status da resposta (buscar dados para edição):", response.status);
            return response.json();
        })
        .then(data => {
            console.log("Dados recebidos para edição:", data);
            // Preenche os campos do modal com os dados do agendamento
            document.getElementById('editTitulo').value = data.titulo;
            document.getElementById('editData').value = data.data.split('T')[0]; // Remove a hora
            document.getElementById('editHorario').value = data.horario;
            document.getElementById('editLocal').value = data.local;

            // Exibe o modal de edição
            const modal = document.getElementById('editModal');
            if (modal) {
                modal.style.display = 'block';
            } else {
                console.error("Modal não encontrado.");
            }
        })
        .catch(error => console.error("Erro ao buscar dados para edição:", error));
}




// Função para fechar o modal de edição
function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
        editId = null; // Limpa o ID do agendamento
    } else {
        console.error("Modal não encontrado para fechar.");
    }
}


// Função para salvar as edições do modal
function saveEdits() {
    const titulo = document.getElementById('editTitulo').value;
    const data = document.getElementById('editData').value;
    const horario = document.getElementById('editHorario').value;
    const local = document.getElementById('editLocal').value;

    const dadosAtualizados = { titulo, data, horario, local };
    console.log("Salvando alterações para o ID:", editId, dadosAtualizados);

    fetch(`http://localhost:3001/avaliacoes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(response => {
        console.log("Status da resposta (salvar edições):", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Resposta do servidor ao editar agendamento:", data);
        if (data.success) {
            alert("Agendamento atualizado com sucesso!");
            closeModal(); // Fecha o modal
            fetchAgendamentos(); // Atualiza a lista de agendamentos
        } else {
            alert("Erro ao atualizar agendamento.");
        }
    })
    .catch(error => console.error("Erro ao atualizar agendamento:", error));
}


// Função para excluir um agendamento
function excluirAgendamento(id) {
    if (confirm("Tem certeza de que deseja excluir este agendamento?")) {
        console.log("Excluindo agendamento com ID:", id);

        fetch(`http://localhost:3001/avaliacoes/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Resposta do servidor ao excluir agendamento:", data);
            if (data.success) {
                alert("Agendamento excluído com sucesso!");
                fetchAgendamentos();
            } else {
                alert("Erro ao excluir agendamento.");
            }
        })
        .catch(error => console.error("Erro ao excluir agendamento:", error));
    }
}

// Função para buscar agendamentos do servidor e exibi-los
function fetchAgendamentos() {
    console.log("Buscando todos os agendamentos do servidor...");

    fetch("http://localhost:3001/avaliacoes")
        .then(response => response.json())
        .then(data => {
            console.log("Agendamentos recebidos:", data);
            const agendamentosList = document.getElementById("agendamentos-list");
            agendamentosList.innerHTML = "";
            data.forEach(item => {
                const dataObj = new Date(item.data);
                const horarioFormatado = item.horario.slice(0, 5);

                const div = document.createElement("div");
                div.classList.add("agendamento-item");
                div.innerHTML = `
                    <h3>${item.titulo}</h3>
                    <p><strong>Data:</strong> ${dataObj.toLocaleDateString('pt-BR')}</p>
                    <p><strong>Horário:</strong> ${horarioFormatado}</p>
                    <p><strong>Local:</strong> ${item.local}</p>
                    <div class="btn-class">
                        <button class="editar" onclick="editarAgendamento(${item.id})">Editar</button>
                        <button class="excluir" onclick="excluirAgendamento(${item.id})">Excluir</button>
                    </div>
                `;
                agendamentosList.appendChild(div);
            });
        })
        .catch(error => console.error("Erro ao buscar agendamentos:", error));
}

// Fecha o modal quando o usuário clica fora dele
window.onclick = function(event) {
    if (event.target === document.getElementById('editModal')) {
        closeModal();
    }
};

// Carrega os agendamentos ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    fetchAgendamentos();
});

document.getElementById('logoutButton').addEventListener('click', async () => {
    console.log("Iniciando logout...");
    try {
        const response = await fetch('http://localhost:3001/logout', {
            method: 'POST',
            credentials: 'include'
        });
        response.ok ? window.location.href = '/login' : console.error('Erro ao fazer logout');
    } catch (error) {
        console.error('Erro de rede ao tentar fazer logout:', error);
    }
});
