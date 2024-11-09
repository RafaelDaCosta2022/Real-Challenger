document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const errorMessage = document.getElementById('errorMessage');

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "../Home/home.html"; // Redireciona para home.html
        } else {
            errorMessage.style.display = 'block'; // Mostra a mensagem de erro
            errorMessage.textContent = 'Email ou senha incorretos.';
        }
    })
    .catch(error => {
        console.error('Erro no login:', error);
        errorMessage.textContent = 'Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.';
        errorMessage.style.display = 'block'; // Exibe uma mensagem de erro geral
    });
});
