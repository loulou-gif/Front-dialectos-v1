/**
 * ============================================
 * BASE.JS - Configuration de base d'Axios
 * ============================================
 * Configuration globale d'axios avec intercepteurs
 * pour gérer automatiquement les erreurs d'authentification
 * 
 * @version 2.0.0
 * @author Dialektos Team
 * @requires axios
 */

// ===================================================
// CONFIGURATION CSRF
// ===================================================

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
  axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
}
axios.defaults.withCredentials = true;

// ===================================================
// INTERCEPTEUR DE REQUÊTES
// ===================================================

/**
 * Intercepteur pour les requêtes sortantes
 * Ajoute automatiquement le token si disponible
 */
axios.interceptors.request.use(
  (config) => {
    // Ajouter un timestamp pour le debugging
    config.metadata = { startTime: new Date() };
    
    // Log de la requête en mode développement
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Erreur lors de la préparation de la requête:', error);
    return Promise.reject(error);
  }
);

// ===================================================
// INTERCEPTEUR DE RÉPONSES
// ===================================================

/**
 * Intercepteur pour les réponses entrantes
 * Gère automatiquement les erreurs d'authentification globales
 */
axios.interceptors.response.use(
  (response) => {
    // Calculer le temps de réponse
    if (response.config.metadata) {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      
      // Log en mode développement
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} (${duration}ms)`);
      }
    }
    
    return response;
  },
  (error) => {
    // Gestion centralisée des erreurs d'authentification
    if (error.response) {
      const status = error.response.status;
      
      // Session expirée ou non autorisée
      if (status === 401 || status === 403) {
        console.warn('⚠️  Session expirée ou non autorisée - Redirection vers login');
        
        // Éviter les redirections multiples
        if (!window.location.pathname.includes('login.html')) {
          localStorage.clear();
          
          // Afficher une notification avant de rediriger
          if (window.AppUtils && window.AppUtils.showNotification) {
            AppUtils.showNotification(
              'warning',
              'Votre session a expiré. Veuillez vous reconnecter.',
              'Session expirée'
            );
          }
          
          // Rediriger après un court délai
          setTimeout(() => {
            window.location.href = '/pages/login.html';
          }, 1500);
        }
      }
      
      // Log de l'erreur en mode développement
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error(`❌ ${error.config.method?.toUpperCase()} ${error.config.url} - Status: ${status}`);
      }
    } else if (error.request) {
      // Erreur réseau
      console.error('❌ Erreur réseau - Pas de réponse du serveur');
    } else {
      // Erreur de configuration
      console.error('❌ Erreur de configuration de la requête:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ===================================================
// FONCTION SHOWNOTIFICATION (Rétrocompatibilité)
// ===================================================

/**
 * Fonction showNotification pour la rétrocompatibilité
 * Redirige vers AppUtils.showNotification si disponible
 * 
 * @deprecated Utilisez plutôt AppUtils.showNotification()
 * Cette fonction est maintenue pour la compatibilité avec l'ancien code
 */
function showNotification(type, message, title = "") {
  if (window.AppUtils && window.AppUtils.showNotification) {
    // Utiliser la nouvelle fonction si utilities.js est chargé
    window.AppUtils.showNotification(type, message, title);
  } else {
    // Fallback si utilities.js n'est pas encore chargé
    $.notify(
      {
        title: title,
        message: message,
        icon: type === "success" ? "fa fa-check-circle" : "fa fa-exclamation-circle",
      },
      {
        type: type,
        placement: {
          from: "top",
          align: "right",
        },
        delay: 3000,
        timer: 500,
      }
    );
  }
}

// Log de confirmation du chargement
console.log("✅ base.js chargé - Intercepteurs axios configurés");
