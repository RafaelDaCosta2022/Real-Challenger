// Função para enviar o agendamento para o servidor
function enviarAgendamento() {
    const titulo = document.getElementById("tituloIA").value;
    const data = document.getElementById("dataIA").value;
    const horario = document.getElementById("horarioIA").value;
    const local = document.getElementById("localIA").value;
    const lembrarEmail = document.getElementById("lembrarEmail").checked ? 1 : 0;
    const lembrarSms = document.getElementById("lembrarSms").checked ? 1 : 0;

    const agendamento = { titulo, data, horario, local, lembrarEmail, lembrarSms };

    fetch("http://localhost:3000/agendar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(agendamento)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Agendamento criado com sucesso!");
            fetchAgendamentos(); // Atualiza a lista de agendamentos
        } else {
            alert("Erro ao criar agendamento.");
        }
    })
    .catch(error => console.error("Erro ao enviar agendamento:", error));
}

// Função para abrir o modal de edição com os dados preenchidos
let editId = null;
function editarAgendamento(id) {
    console.log("Modal de edição aberto para o ID:", id); // Para confirmação no console
    editId = id;

    fetch(`http://localhost:3000/avaliacoes/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('editTitulo').value = data.titulo;
            document.getElementById('editData').value = data.data.split('T')[0]; // Remover a parte de hora
            document.getElementById('editHorario').value = data.horario;
            document.getElementById('editLocal').value = data.local;

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

    fetch(`http://localhost:3000/avaliacoes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Agendamento atualizado com sucesso!");
            closeModal();
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
        fetch(`http://localhost:3000/avaliacoes/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Agendamento excluído com sucesso!");
                fetchAgendamentos(); // Atualiza a lista de agendamentos
            } else {
                alert("Erro ao excluir agendamento.");
            }
        })
        .catch(error => console.error("Erro ao excluir agendamento:", error));
    }
}

// Função para buscar agendamentos do servidor e exibi-los
function fetchAgendamentos() {
    fetch("http://localhost:3000/avaliacoes")
        .then(response => response.json())
        .then(data => {
            const agendamentosList = document.getElementById("agendamentos-list");
            agendamentosList.innerHTML = "";
            data.forEach(item => {
                const dataObj = new Date(item.data);
                const horarioFormatado = item.horario.slice(0, 5); // Ajusta para exibir HH:MM sem fusos

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
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeModal();
    }
};

// Carrega os agendamentos ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    fetchAgendamentos();
});

document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            window.location.href = '/login'; // Redireciona para a página de login
        } else {
            console.error('Erro ao fazer logout');
        }
    } catch (error) {
        console.error('Erro de rede ao tentar fazer logout:', error);
    }
});
