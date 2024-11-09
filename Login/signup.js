document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Previne o envio imediato do formulário

    const senha = document.getElementById("senha").value;
    const confirmSenha = document.getElementById("confirmSenha").value;
    const errorMessage = document.getElementById("errorMessage");

    if (senha !== confirmSenha) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "As senhas não coincidem. Por favor, verifique.";
    } else {
        errorMessage.style.display = "none"; // Esconde a mensagem de erro
        this.submit(); // Envia o formulário após a validação
    }
});
