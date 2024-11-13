document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Capturando os valores dos campos
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmSenha = document.getElementById("confirmSenha").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const ra = document.getElementById("ra").value.trim();
    let dataNascimento = document.getElementById("dataNascimento").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    // Exibindo cada campo individualmente para depuração
    console.log("Nome:", nome);
    console.log("Email:", email);
    console.log("Senha:", senha);
    console.log("Confirme a Senha:", confirmSenha);
    console.log("RA:", ra); // Verifique que o valor de RA é o correto
    console.log("Telefone:", telefone);
    console.log("Endereço:", endereco);
    console.log("Data de Nascimento:", dataNascimento);

    // Validação dos campos vazios
    if (!nome || !email || !senha || !confirmSenha || !telefone || !endereco || !dataNascimento || !ra) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Preencha todos os campos.";
        return;
    }

    if (senha !== confirmSenha) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "As senhas não coincidem. Por favor, verifique.";
        return;
    }

    // Formatar a data para YYYY-MM-DD, caso esteja no formato DD/MM/YYYY
    if (dataNascimento.includes("/")) {
        const [day, month, year] = dataNascimento.split("/");
        dataNascimento = `${year}-${month}-${day}`;
    }

    // Criando o objeto `data` a ser enviado
    const data = {
        nome: nome,
        email: email,
        senha: senha,
        telefone: telefone,
        endereco: endereco,
        ra: ra,  // Certifique-se de que `ra` está sendo passado corretamente
        data_nascimento: dataNascimento
    };

    // Exibindo o objeto completo para verificar se o `ra` e os outros campos estão presentes
    console.log("Dados a serem enviados:", JSON.stringify(data));

    // Envio dos dados para o servidor
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
        errorMessage.textContent = error.message || 'Erro ao cadastrar. Tente novamente mais tarde.';
    });
});
