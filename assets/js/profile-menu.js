// Script pour mettre à jour le menu de profil avec les informations de l'utilisateur connecté
document.addEventListener('DOMContentLoaded', function() {
    updateProfileMenu();
});

function updateProfileMenu() {
    // Récupérer les informations utilisateur depuis localStorage
    const userData = localStorage.getItem('user');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            console.log('Données utilisateur:', user);
            
            // Mettre à jour le nom d'utilisateur dans le menu
            updateUserName(user);
            
            // Simplifier le menu dropdown
            simplifyProfileMenu();
            
        } catch (error) {
            console.error('Erreur lors du parsing des données utilisateur:', error);
            // En cas d'erreur, garder les valeurs par défaut
        }
    } else {
        console.log('Aucune donnée utilisateur trouvée dans localStorage');
    }
}

function updateUserName(user) {
    // Mettre à jour le nom affiché dans le bouton du menu
    const userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName) {
        // Utiliser le nom d'utilisateur ou le prénom/nom si disponibles
        let displayName = user.username || user.first_name || 'Utilisateur';
        if (user.first_name && user.last_name) {
            displayName = `${user.first_name} ${user.last_name}`;
        }
        userDisplayName.textContent = displayName;
    }
    
    // Mettre à jour le nom dans le dropdown
    const userNameInMenu = document.getElementById('userNameInMenu');
    if (userNameInMenu) {
        let displayName = user.username || user.first_name || 'Utilisateur';
        if (user.first_name && user.last_name) {
            displayName = `${user.first_name} ${user.last_name}`;
        }
        userNameInMenu.textContent = displayName;
    }
    
    // Mettre à jour l'email dans le dropdown
    const userEmailInMenu = document.getElementById('userEmailInMenu');
    if (userEmailInMenu && user.email) {
        userEmailInMenu.textContent = user.email;
    }
}

function simplifyProfileMenu() {
    // Le menu est déjà simplifié dans le HTML, cette fonction peut être vide
    // ou utilisée pour d'autres personnalisations si nécessaire
    console.log('Menu de profil simplifié');
}

// Fonction pour actualiser le menu si nécessaire
function refreshProfileMenu() {
    updateProfileMenu();
}
