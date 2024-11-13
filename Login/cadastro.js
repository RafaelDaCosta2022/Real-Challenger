document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmSenha = document.getElementById("confirmSenha").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const ra = document.getElementById("ra").value.trim();
    let dataNascimento = document.getElementById("dataNascimento").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    console.log("Valores dos campos:", { nome, email, senha, confirmSenha, telefone, endereco, dataNascimento, ra });

    let missingFields = [];
    if (!nome) missingFields.push("Nome");
    if (!email) missingFields.push("Email");
    if (!senha) missingFields.push("Senha");
    if (!confirmSenha) missingFields.push("Confirmação de Senha");
    if (!telefone) missingFields.push("Telefone");
    if (!endereco) missingFields.push("Endereço");
    if (!dataNascimento) missingFields.push("Data de Nascimento");
    if (!ra) missingFields.push("RA");

    if (missingFields.length > 0) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Preencha os seguintes campos: " + missingFields.join(", ");
        return;
    }

    if (senha !== confirmSenha) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "As senhas não coincidem. Por favor, verifique.";
        return;
    }

    if (dataNascimento.includes("/")) {
        const [day, month, year] = dataNascimento.split("/");
        dataNascimento = `${year}-${month}-${day}`;
    }

    errorMessage.style.display = "none";

    const data = {
        nome,
        email,
        senha,
        telefone,
        endereco,
        ra,
        data_nascimento: dataNascimento
    };

    console.log("Dados enviados:", data);

    fetch('http://localhost:3001/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => { 
                throw new Error(data.message || "Erro ao cadastrar. Verifique os dados e tente novamente."); 
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Usuário cadastrado com sucesso!');
            window.location.href = 'login.html';
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.message || 'Erro ao cadastrar. Tente novamente.';
        }
    })
    .catch(error => {
        console.error('Erro no cadastro:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Erro ao cadastrar. Tente novamente mais tarde.';
    });
});