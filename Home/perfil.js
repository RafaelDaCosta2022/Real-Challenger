document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/dados-usuario', { credentials: 'include' })
        .then(response => {
            if (response.status === 401) {
                // Se o usuário não estiver autenticado, redireciona para a página de login
                window.location.href = '../Login/login.html';
            } else {
                return response.json();  // Retorna a resposta como JSON
            }
        })
        .then(data => {
            console.log('Dados recebidos do servidor:', data);  // Log para depuração

            // Se a resposta for bem-sucedida, insira os dados do usuário na interface
            if (data.success) {
                document.querySelector('.texto-perfil').innerHTML = `Aluno: ${data.nome} <br> RA: ${data.ra}`;
            } else {
                console.error('Falha ao carregar dados do usuário:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro ao obter dados do usuário:', error);
        });
});
