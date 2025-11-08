// Vérification d'authentification pour toutes les pages protégées
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        window.location.href = '../../login.html';
        return false;
    }
    
    // Vérifier si le token est encore valide
    try {
        const userData = JSON.parse(user);
        return userData;
    } catch (error) {
        localStorage.clear();
        window.location.href = '../../login.html';
        return false;
    }
}

// Redirection basée sur le rôle
function redirectByRole(userData) {
    const role = userData.role;
    const currentPath = window.location.pathname;
    
    // Vérifier si l'utilisateur accède à la bonne section
    if (role === 'student' && !currentPath.includes('/student/')) {
        window.location.href = 'student/index.html';
    } else if (role === 'teacher' && !currentPath.includes('/teacher/')) {
        window.location.href = 'teacher/index.html';
    } else if (role === 'admin' && !currentPath.includes('/administration/')) {
        window.location.href = 'administration/index.html';
    }
}

// Vérifier la validité du token
function validateToken() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Vérifier la structure du token (optionnel)
    return token.length > 10; // Exemple simple
}

// Initialiser la protection d'authentification
document.addEventListener('DOMContentLoaded', function() {
    const userData = checkAuth();
    if (userData) {
        redirectByRole(userData);
    }
});

