document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const errorMessage = document.getElementById('errorMessage');

            // Esconde qualquer erro anterior
            errorMessage.style.display = 'none';

            // Verifica se os campos estão preenchidos
            if (!email || !senha) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Por favor, preencha todos os campos.';
                return;
            }

            fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            })
            .then(response => {
                if (!response.ok) {
                    // Se o servidor retornar um erro de autenticação, exibe mensagem
                    if (response.status === 401) {
                        throw new Error('Email ou senha incorretos.');
                    } else if (response.status === 404) {
                        throw new Error('Endpoint de login não encontrado. Verifique o servidor.');
                    } else {
                        throw new Error('Erro ao conectar com o servidor. Tente novamente mais tarde.');
                    }
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Login bem-sucedido!');
                    window.location.href = '../Home/home.html';  // Certifique-se de que o caminho está correto
                } else {
                    // Exibe mensagem personalizada ou padrão
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = data.message || 'Erro desconhecido. Tente novamente.';
                }
            })
            .catch(error => {
                // Tratamento de erro para diversos cenários
                console.error('Erro no login:', error);
                errorMessage.style.display = 'block';

                // Verifica o tipo de erro e exibe uma mensagem adequada
                if (error.message === 'Email ou senha incorretos.') {
                    errorMessage.textContent = 'Email ou senha incorretos. Verifique seus dados.';
                } else if (error.message === 'Endpoint de login não encontrado. Verifique o servidor.') {
                    errorMessage.textContent = 'Erro no servidor. E-mail de login não encontrado.';
                } else if (error.message === 'Erro ao conectar com o servidor. Tente novamente mais tarde.') {
                    errorMessage.textContent = 'Erro de conexão. Verifique sua rede ou tente mais tarde.';
                } else {
                    errorMessage.textContent = 'Erro ao tentar fazer login. E-mail não cadastrado.';
                }
            });
        });
    }
});
