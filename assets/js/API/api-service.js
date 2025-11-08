/**
 * ============================================
 * API-SERVICE.JS - Service d'abstraction pour les appels API
 * ============================================
 * Ce service centralise tous les appels HTTP à l'API
 * et gère automatiquement l'authentification et les erreurs.
 * 
 * @version 1.0.0
 * @author Dialektos Team
 * @requires utilities.js
 * @requires axios
 */

/**
 * Service API - Abstraction pour les appels HTTP avec gestion automatique
 * de l'authentification et des erreurs
 */
const ApiService = {
  
  // ===================================================
  // MÉTHODE GET
  // ===================================================
  
  /**
   * Effectue une requête GET
   * @param {string} endpoint - URL de l'endpoint (peut être relative ou absolue)
   * @param {Object} config - Configuration supplémentaire pour axios (optionnel)
   * @returns {Promise<any>} Les données de la réponse
   * @throws {Error} Lance une erreur si la requête échoue
   * 
   * @example
   * const users = await ApiService.get('/api/users/');
   * const user = await ApiService.get('/api/users/123/');
   */
  async get(endpoint, config = {}) {
    try {
      const response = await axios.get(endpoint, {
        ...AppUtils.getAuthHeaders(),
        ...config
      });
      return response.data;
    } catch (error) {
      AppUtils.handleApiError(error, `GET ${endpoint}`);
      throw error;
    }
  },
  
  // ===================================================
  // MÉTHODE POST
  // ===================================================
  
  /**
   * Effectue une requête POST (JSON)
   * @param {string} endpoint - URL de l'endpoint
   * @param {Object} data - Données à envoyer
   * @param {Object} config - Configuration supplémentaire (optionnel)
   * @returns {Promise<any>} Les données de la réponse
   * @throws {Error} Lance une erreur si la requête échoue
   * 
   * @example
   * const newUser = await ApiService.post('/api/users/', {
   *   username: 'john',
   *   email: 'john@example.com'
   * });
   */
  async post(endpoint, data, config = {}) {
    try {
      const response = await axios.post(endpoint, data, {
        ...AppUtils.getAuthHeaders(),
        ...config
      });
      return response.data;
    } catch (error) {
      AppUtils.handleApiError(error, `POST ${endpoint}`);
      throw error;
    }
  },
  
  // ===================================================
  // MÉTHODE PUT
  // ===================================================
  
  /**
   * Effectue une requête PUT (mise à jour complète)
   * @param {string} endpoint - URL de l'endpoint
   * @param {Object} data - Données à envoyer
   * @param {Object} config - Configuration supplémentaire (optionnel)
   * @returns {Promise<any>} Les données de la réponse
   * @throws {Error} Lance une erreur si la requête échoue
   * 
   * @example
   * const updatedUser = await ApiService.put('/api/users/123/', {
   *   username: 'john_updated',
   *   email: 'john.new@example.com'
   * });
   */
  async put(endpoint, data, config = {}) {
    try {
      const response = await axios.put(endpoint, data, {
        ...AppUtils.getAuthHeaders(),
        ...config
      });
      return response.data;
    } catch (error) {
      AppUtils.handleApiError(error, `PUT ${endpoint}`);
      throw error;
    }
  },
  
  // ===================================================
  // MÉTHODE PATCH
  // ===================================================
  
  /**
   * Effectue une requête PATCH (mise à jour partielle)
   * @param {string} endpoint - URL de l'endpoint
   * @param {Object} data - Données à envoyer
   * @param {Object} config - Configuration supplémentaire (optionnel)
   * @returns {Promise<any>} Les données de la réponse
   * @throws {Error} Lance une erreur si la requête échoue
   * 
   * @example
   * const partialUpdate = await ApiService.patch('/api/users/123/', {
   *   email: 'newemail@example.com'
   * });
   */
  async patch(endpoint, data, config = {}) {
    try {
      const response = await axios.patch(endpoint, data, {
        ...AppUtils.getAuthHeaders(),
        ...config
      });
      return response.data;
    } catch (error) {
      AppUtils.handleApiError(error, `PATCH ${endpoint}`);
      throw error;
    }
  },
  
  // ===================================================
  // MÉTHODE DELETE
  // ===================================================
  
  /**
   * Effectue une requête DELETE
   * @param {string} endpoint - URL de l'endpoint
   * @param {Object} config - Configuration supplémentaire (optionnel)
   * @returns {Promise<any>} Les données de la réponse
   * @throws {Error} Lance une erreur si la requête échoue
   * 
   * @example
   * await ApiService.delete('/api/users/123/');
   */
  async delete(endpoint, config = {}) {
    try {
      const response = await axios.delete(endpoint, {
        ...AppUtils.getAuthHeaders(),
        ...config
      });
      return response.data;
    } catch (error) {
      AppUtils.handleApiError(error, `DELETE ${endpoint}`);
      throw error;
    }
  },
  
  // ===================================================
  // MÉTHODE POST AVEC FORMDATA (Upload de fichiers)
  // ===================================================
  
  /**
   * Effectue une requête POST avec FormData (pour l'upload de fichiers)
   * @param {string} endpoint - URL de l'endpoint
   * @param {FormData} formData - FormData contenant les fichiers et données
   * @param {Object} config - Configuration supplémentaire (optionnel)
   * @returns {Promise<any>} Les données de la réponse
   * @throws {Error} Lance une erreur si la requête échoue
   * 
   * @example
   * const formData = new FormData();
   * formData.append('name', 'Cours 1');
   * formData.append('pdf', fileInput.files[0]);
   * const course = await ApiService.postFormData('/api/courses/', formData);
   */
  async postFormData(endpoint, formData, config = {}) {
    try {
      const response = await axios.post(endpoint, formData, {
        ...AppUtils.getAuthHeadersMultipart(),
        ...config
      });
      return response.data;
    } catch (error) {
      AppUtils.handleApiError(error, `POST FormData ${endpoint}`);
      throw error;
    }
  },
  
  // ===================================================
  // MÉTHODE PUT AVEC FORMDATA
  // ===================================================
  
  /**
   * Effectue une requête PUT avec FormData (pour l'upload de fichiers)
   * @param {string} endpoint - URL de l'endpoint
   * @param {FormData} formData - FormData contenant les fichiers et données
   * @param {Object} config - Configuration supplémentaire (optionnel)
   * @returns {Promise<any>} Les données de la réponse
   * @throws {Error} Lance une erreur si la requête échoue
   * 
   * @example
   * const formData = new FormData();
   * formData.append('name', 'Cours 1 Updated');
   * if (newFile) formData.append('pdf', newFile);
   * const course = await ApiService.putFormData('/api/courses/123/', formData);
   */
  async putFormData(endpoint, formData, config = {}) {
    try {
      const response = await axios.put(endpoint, formData, {
        ...AppUtils.getAuthHeadersMultipart(),
        ...config
      });
      return response.data;
    } catch (error) {
      AppUtils.handleApiError(error, `PUT FormData ${endpoint}`);
      throw error;
    }
  },
  
  // ===================================================
  // MÉTHODES UTILITAIRES
  // ===================================================
  
  /**
   * Effectue plusieurs requêtes GET en parallèle
   * @param {Array<string>} endpoints - Tableau des endpoints à appeler
   * @returns {Promise<Array>} Tableau des réponses
   * @throws {Error} Lance une erreur si une requête échoue
   * 
   * @example
   * const [users, classes, courses] = await ApiService.getMultiple([
   *   '/api/users/',
   *   '/api/classes/',
   *   '/api/courses/'
   * ]);
   */
  async getMultiple(endpoints) {
    try {
      const promises = endpoints.map(endpoint => this.get(endpoint));
      return await Promise.all(promises);
    } catch (error) {
      console.error("❌ Erreur lors des requêtes multiples:", error);
      throw error;
    }
  },
  
  /**
   * Effectue une requête sans authentification (pour le login par exemple)
   * @param {string} method - Méthode HTTP (GET, POST, etc.)
   * @param {string} endpoint - URL de l'endpoint
   * @param {Object} data - Données à envoyer (optionnel)
   * @param {Object} config - Configuration supplémentaire (optionnel)
   * @returns {Promise<any>} Les données de la réponse
   * @throws {Error} Lance une erreur si la requête échoue
   * 
   * @example
   * const loginResponse = await ApiService.requestWithoutAuth(
   *   'POST',
   *   '/api/dj_rest_auth/login/',
   *   { username: 'john', password: 'secret' }
   * );
   */
  async requestWithoutAuth(method, endpoint, data = null, config = {}) {
    try {
      const response = await axios({
        method,
        url: endpoint,
        data,
        ...config
      });
      return response.data;
    } catch (error) {
      AppUtils.handleApiError(error, `${method} ${endpoint} (sans auth)`);
      throw error;
    }
  }
};

// ===================================================
// EXPORT GLOBAL
// ===================================================

/**
 * Exporter le service API globalement
 * Accessible partout via window.ApiService
 */
window.ApiService = ApiService;

// Log de confirmation du chargement
console.log("✅ api-service.js chargé - ApiService disponible globalement");


