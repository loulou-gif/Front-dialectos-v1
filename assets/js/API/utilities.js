/**
 * ============================================
 * UTILITIES.JS - Fonctions utilitaires centralisées
 * ============================================
 * Ce fichier contient toutes les fonctions réutilisables
 * utilisées dans l'application pour éviter la duplication.
 * 
 * @version 1.0.0
 * @author Dialektos Team
 */

// ===================================================
// NOTIFICATIONS
// ===================================================

/**
 * Affiche une notification à l'utilisateur
 * @param {string} type - Type de notification : success, error, warning, info, danger
 * @param {string} message - Message à afficher
 * @param {string} title - Titre de la notification (optionnel)
 */
function showNotification(type, message, title = "") {
  $.notify(
    {
      title: title,
      message: message,
      icon: type === "success" ? "fa fa-check-circle" : "fa fa-exclamation-circle",
    },
    {
      type: type, // success, info, warning, danger
      placement: {
        from: "top",
        align: "right",
      },
      delay: 3000,
      timer: 500,
    }
  );
}

// ===================================================
// GESTION DU TOKEN ET DES HEADERS
// ===================================================

/**
 * Récupère le token d'authentification depuis localStorage
 * @returns {string|null} Le token ou null s'il n'existe pas
 */
function getAuthToken() {
  return localStorage.getItem("token");
}

/**
 * Génère les headers d'authentification pour les requêtes JSON
 * @returns {Object} Configuration des headers avec Authorization et Content-Type
 */
function getAuthHeaders() {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    }
  };
}

/**
 * Génère les headers d'authentification pour les requêtes multipart (upload de fichiers)
 * @returns {Object} Configuration des headers avec Authorization uniquement
 */
function getAuthHeadersMultipart() {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Token ${token}`
      // Pas de Content-Type pour FormData (axios le gère automatiquement)
    }
  };
}

// ===================================================
// GESTION DES ERREURS
// ===================================================

/**
 * Gère les erreurs des appels API de manière centralisée
 * @param {Error} error - L'objet erreur d'axios
 * @param {string} context - Contexte de l'erreur (ex: "création utilisateur")
 */
function handleApiError(error, context = "") {
  console.error(`❌ Erreur API ${context}:`, error);
  
  // Erreur de réponse du serveur
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        // Erreur de validation
        const errorMsg = data.detail || data.message || "Données invalides";
        showNotification("warning", errorMsg, "Validation");
        break;
        
      case 401:
      case 403:
        // Session expirée ou non autorisée
        showNotification("error", "Session expirée. Veuillez vous reconnecter.", "Authentification");
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/pages/login.html";
        }, 2000);
        break;
        
      case 404:
        // Ressource non trouvée
        showNotification("warning", "Ressource non trouvée", "Erreur 404");
        break;
        
      case 500:
      case 502:
      case 503:
        // Erreur serveur
        showNotification("error", "Erreur serveur. Veuillez réessayer plus tard.", "Erreur serveur");
        break;
        
      default:
        showNotification("error", "Une erreur est survenue", "Erreur");
    }
  } else if (error.request) {
    // Pas de réponse du serveur (problème réseau)
    showNotification("error", "Impossible de contacter le serveur. Vérifiez votre connexion.", "Erreur de connexion");
  } else {
    // Erreur de configuration de la requête
    showNotification("error", "Erreur de configuration de la requête", "Erreur");
  }
}

// ===================================================
// VALIDATION
// ===================================================

/**
 * Valide que tous les champs d'un formulaire sont remplis
 * @param {Object} fields - Objet contenant les champs à valider {nom: valeur, ...}
 * @returns {boolean} true si tous les champs sont valides, false sinon
 */
function validateForm(fields) {
  for (const [name, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim() === "")) {
      showNotification("warning", `Le champ "${name}" est requis`, "Validation");
      return false;
    }
  }
  return true;
}

/**
 * Valide un email
 * @param {string} email - L'email à valider
 * @returns {boolean} true si l'email est valide
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un mot de passe (minimum 8 caractères)
 * @param {string} password - Le mot de passe à valider
 * @returns {boolean} true si le mot de passe est valide
 */
function validatePassword(password) {
  return password && password.length >= 8;
}

// ===================================================
// DATATABLES
// ===================================================

/**
 * Initialise ou réinitialise un DataTable
 * @param {string} tableId - L'ID de la table (sans le #)
 * @param {Object} options - Options personnalisées pour DataTable
 * @returns {Object} L'instance DataTable
 */
function initDataTable(tableId, options = {}) {
  // Détruire l'instance existante si présente
  if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
    $(`#${tableId}`).DataTable().destroy();
  }
  
  // Configuration par défaut
  const defaultOptions = {
    pageLength: 10,
    responsive: true,
    searching: true,
    ordering: true,
    info: true,
    lengthChange: true,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json"
    }
  };
  
  // Fusionner avec les options personnalisées
  const finalOptions = { ...defaultOptions, ...options };
  
  // Initialiser et retourner le DataTable
  return $(`#${tableId}`).DataTable(finalOptions);
}

// ===================================================
// UTILITAIRES MODALES
// ===================================================

/**
 * Ferme une modale Bootstrap et réinitialise son formulaire
 * @param {string} modalId - L'ID de la modale (sans le #)
 * @param {string} formId - L'ID du formulaire à réinitialiser (optionnel)
 */
function closeModal(modalId, formId = null) {
  $(`#${modalId}`).modal("hide");
  
  if (formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.reset();
    }
  }
}

/**
 * Ouvre une modale Bootstrap
 * @param {string} modalId - L'ID de la modale (sans le #)
 */
function openModal(modalId) {
  $(`#${modalId}`).modal("show");
}

// ===================================================
// FORMATAGE
// ===================================================

/**
 * Formate une date au format français
 * @param {string|Date} date - La date à formater
 * @returns {string} Date formatée (JJ/MM/AAAA)
 */
function formatDate(date) {
  if (!date) return "N/A";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formate une date et heure au format français
 * @param {string|Date} datetime - La date/heure à formater
 * @returns {string} Date formatée (JJ/MM/AAAA HH:MM)
 */
function formatDateTime(datetime) {
  if (!datetime) return "N/A";
  const d = new Date(datetime);
  const date = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${date} ${hours}:${minutes}`;
}

/**
 * Tronque un texte à une longueur maximale
 * @param {string} text - Le texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte tronqué avec "..." si nécessaire
 */
function truncateText(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// ===================================================
// UTILITAIRES DIVERS
// ===================================================

/**
 * Attend un certain temps (pour async/await)
 * @param {number} ms - Temps en millisecondes
 * @returns {Promise} Promise qui se résout après le délai
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Recharge les données et actualise la page
 * @param {Function} loadFunction - Fonction de chargement des données (optionnel)
 */
function refreshData(loadFunction = null) {
  if (loadFunction && typeof loadFunction === 'function') {
    loadFunction();
  } else {
    location.reload();
  }
}

/**
 * Copie du texte dans le presse-papiers
 * @param {string} text - Texte à copier
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification("success", "Copié dans le presse-papiers", "Succès");
  } catch (error) {
    console.error("Erreur lors de la copie:", error);
    showNotification("error", "Impossible de copier", "Erreur");
  }
}

// ===================================================
// EXPORT GLOBAL
// ===================================================

/**
 * Objet global contenant toutes les fonctions utilitaires
 * Accessible partout via window.AppUtils
 */
window.AppUtils = {
  // Notifications
  showNotification,
  
  // Authentification
  getAuthToken,
  getAuthHeaders,
  getAuthHeadersMultipart,
  
  // Gestion erreurs
  handleApiError,
  
  // Validation
  validateForm,
  validateEmail,
  validatePassword,
  
  // DataTables
  initDataTable,
  
  // Modales
  closeModal,
  openModal,
  
  // Formatage
  formatDate,
  formatDateTime,
  truncateText,
  
  // Divers
  sleep,
  refreshData,
  copyToClipboard
};

// Log de confirmation du chargement
console.log("✅ utilities.js chargé - AppUtils disponible globalement");


