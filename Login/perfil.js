// perfil.js

document.addEventListener("DOMContentLoaded", () => {
    carregarPerfil();
});

function carregarPerfil() {
    fetch('http://localhost:3001/usuario/perfil', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('nomePerfil').textContent = data.nome;
                document.getElementById('raPerfil').textContent = `RA: ${data.ra}`;
                document.getElementById('fotoPerfil').src = data.foto || "/Images/default-profile.png";
            } else {
                console.error("Erro ao carregar dados do perfil:", data.message);
            }
        })
        .catch(error => console.error("Erro de rede ao carregar perfil:", error));
}
function verificaAutenticacao(req, res, next) {
    if (req.session && req.session.userId) {
        // Se a sessão e o userId estiverem definidos, o usuário está autenticado
        next();
    } else {
        // Se não estiver autenticado, retorne o erro 401
        res.status(401).json({ success: false, message: 'Usuário não autenticado' });
        
    }
}
