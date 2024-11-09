document.getElementById('cadastroForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Usuário cadastrado com sucesso!');
            window.location.href = 'index.html'; // Redireciona para a página de login
        } else {
            alert('Erro ao cadastrar. Tente novamente.');
        }
    })
    .catch(error => console.error('Erro no cadastro:', error));
});


document.getElementById('cadastroForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            successMessage.style.display = 'block';
            successMessage.textContent = data.message;
            setTimeout(() => {
                window.location.href = '../Home/home.htm'; // Redireciona para a página de login após o cadastro
            }, 2000);
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Erro no cadastro:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Erro ao cadastrar. Tente novamente mais tarde.';
    });
});
