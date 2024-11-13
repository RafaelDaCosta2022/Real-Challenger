// utils.js

// Exibe uma mensagem de erro em um elemento específico
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
        element.textContent = message;
    }
}

// Verifica se o usuário está autenticado
function isAuthenticated() {
    return fetch(`${BASE_URL}/usuario/perfil`, { credentials: 'include' })
        .then(response => response.ok)
        .catch(() => false);
}

// Exporta as funções para uso em outros scripts
export { showError, isAuthenticated };


// utils.js
function protectPage() {
    isAuthenticated().then(authenticated => {
        if (!authenticated) {
            window.location.href = 'login.html';
        }
    });
}

export { protectPage };import { showError, isAuthenticated, protectPage } from './utils.js';



