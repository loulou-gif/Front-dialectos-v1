/**
 * Profile Loader - Charge et affiche les informations de l'utilisateur connecté
 * Ce fichier doit être inclus dans toutes les pages qui affichent le profil utilisateur
 */

function loadUserProfile() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.warn("Aucun token trouvé. L'utilisateur n'est pas connecté.");
    return;
  }

  axios.get(CONFIG.BASE_URL + '/api/user/me/complete-info', {
    headers: { Authorization: `Token ${token}` }
  })
  .then(response => {
    const userData = response.data;
    updateUserProfileUI(userData);
  })
  .catch(error => {
    console.error("Erreur lors du chargement du profil utilisateur :", error);
    
    // Si l'erreur est 401 ou 403, rediriger vers la page de login
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Session expirée ou non autorisé. Redirection vers la page de login.");
      // Optionnel : décommenter pour redirection automatique
      // localStorage.removeItem("token");
      // window.location.href = "../login.html";
    }
  });
}

function updateUserProfileUI(data) {
  // Mettre à jour le nom d'affichage dans le header
  const displayNameElement = document.getElementById("userDisplayName");
  if (displayNameElement) {
    const displayName = data.first_name || data.username || "Utilisateur";
    displayNameElement.textContent = displayName;
  }
  
  // Mettre à jour le nom complet dans le dropdown
  const fullNameElement = document.getElementById("userFullName");
  if (fullNameElement) {
    const fullName = data.first_name && data.last_name 
      ? `${data.first_name} ${data.last_name}` 
      : data.username || "Utilisateur";
    fullNameElement.textContent = fullName;
  }
  
  // Mettre à jour l'email
  const emailElement = document.getElementById("userEmail");
  if (emailElement) {
    emailElement.textContent = data.email || "email@example.com";
  }
}

// Charger automatiquement le profil quand le DOM est prêt
document.addEventListener("DOMContentLoaded", function() {
  loadUserProfile();
});

