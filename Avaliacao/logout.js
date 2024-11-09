// Função para realizar o logout
function logout() {
    fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include' // Inclui cookies para manter a sessão
    })
    .then(response => {
        if (response.ok) {
            // Redireciona para a página de login após o logout
            window.location.href = '/Login/login.html';
        } else {
            return response.json().then(data => {
                console.error('Erro ao tentar fazer logout:', data.message || 'Erro desconhecido');
            });
        }
    })
    .catch(error => {
        console.error('Erro de rede ao tentar fazer logout:', error);
    });
}

// Adiciona o evento de clique ao botão de logout quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Previne o comportamento padrão do botão
            logout();
        });
    } else {
        console.warn('Botão de logout não encontrado na página.');
    }
});
