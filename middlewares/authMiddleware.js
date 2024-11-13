// REAL-CHALLENGER/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'sua_chave_secreta'; // Mantenha isso seguro em uma variável de ambiente

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token ausente' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = decoded;
        next();
    });
}
// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

module.exports = authenticateToken;
