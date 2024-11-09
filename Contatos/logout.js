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
            console.error('Erro ao tentar fazer logout');
        }
    })
    .catch(error => {
        console.error('Erro de rede ao tentar fazer logout:', error);
    });
}

// Detecta o botão de logout e adiciona o evento de clique
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});
