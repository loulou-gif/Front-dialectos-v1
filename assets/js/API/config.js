/**
 * ============================================
 * CONFIG.JS - Configuration de l'application
 * ============================================
 * Configuration centralisée pour l'application
 * 
 * @version 1.0.0
 * @author Dialektos Team
 */

const CONFIG = {
  // URL de base de l'API
  BASE_URL: "https://annexedb.space",
  
  // Version de l'API
  API_VERSION: "v1",
  
  // Timeout pour les requêtes (en millisecondes)
  TIMEOUT: 30000, // 30 secondes
  
  // Endpoints de l'API (centralisés pour éviter les erreurs de typage)
  ENDPOINTS: {
    // Authentification
    AUTH: {
      LOGIN: "/api/dj_rest_auth/login/",
      LOGOUT: "/api/dj_rest_auth/logout/",
      USER_INFO: "/api/user/me/complete-info",
      USER_ME: "/api/user/me/"
    },
    
    // Gestion des utilisateurs
    USERS: "/api/users/",
    STUDENTS: "/api/students/",
    TEACHERS: "/api/teachers/",
    
    // Gestion des classes
    CLASSES: "/api/classes/",
    
    // Gestion des cours
    COURSES: "/api/courses/",
    COURSES_AFFECTATION: "/api/courses-affectation/",
    
    // Gestion des devoirs et tests
    HOMEWORK: "/api/homework/",
    RESULTS: "/api/result-homework/",
    QUESTIONS: "/api/Questions/",
    CATEGORIES: "/api/categorie/",
    
    // Gestion des niveaux et rôles
    LEVELS: "/api/level/",
    ROLES: "/api/roles/",
    
    // Affectations
    AFFECTATION_STUDENTS: "/api/affectationStudents/",
    
    // Communication
    SEND_EMAIL: "/api/sendEmail/"
  },
  
  // Messages de l'application
  MESSAGES: {
    SUCCESS: {
      CREATE: "Élément créé avec succès !",
      UPDATE: "Élément modifié avec succès !",
      DELETE: "Élément supprimé avec succès !",
      LOAD: "Données chargées avec succès !",
      SAVE: "Sauvegarde réussie !",
      SEND: "Envoyé avec succès !"
    },
    ERROR: {
      CREATE: "Erreur lors de la création",
      UPDATE: "Erreur lors de la modification",
      DELETE: "Erreur lors de la suppression",
      LOAD: "Erreur lors du chargement des données",
      REQUIRED_FIELDS: "Tous les champs sont requis",
      NETWORK: "Erreur de connexion au serveur",
      GENERIC: "Une erreur est survenue"
    },
    WARNING: {
      UNSAVED_CHANGES: "Vous avez des modifications non sauvegardées",
      CONFIRM_DELETE: "Êtes-vous sûr de vouloir supprimer cet élément ?",
      INVALID_DATA: "Les données saisies sont invalides"
    },
    INFO: {
      LOADING: "Chargement en cours...",
      PROCESSING: "Traitement en cours...",
      PLEASE_WAIT: "Veuillez patienter..."
    }
  },
  
  // Codes de statut HTTP
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
  },
  
  // Configuration DataTables
  DATATABLE_DEFAULTS: {
    pageLength: 10,
    responsive: true,
    searching: true,
    ordering: true,
    info: true,
    lengthChange: true,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json"
    }
  }
};

// Configuration globale d'axios
axios.defaults.timeout = CONFIG.TIMEOUT;
axios.defaults.baseURL = CONFIG.BASE_URL;

// Log de confirmation du chargement
console.log("✅ config.js chargé - Configuration disponible");