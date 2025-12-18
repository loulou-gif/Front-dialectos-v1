// Fonction pour afficher les messages
function showMessage(message, type = 'success') {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.getElementById('message');
    
    // Masquer le message précédent
    messageContainer.style.display = 'none';
    
    // Configurer le message
    messageElement.className = `alert alert-${type === 'success' ? 'success' : 'danger'}`;
    messageElement.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Afficher le message
    messageContainer.style.display = 'block';
    
    // Masquer automatiquement après 5 secondes pour les messages de succès
    if (type === 'success') {
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }
}
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

// Fonction pour gérer l'état de chargement
function setLoadingState(isLoading) {
    const submitBtn = document.getElementById('submit');
    if (isLoading) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Connexion en cours...';
        submitBtn.disabled = true;
    } else {
        submitBtn.innerHTML = 'Se connecter';
        submitBtn.disabled = false;
    }
}

// Vérification que CONFIG est disponible
if (typeof CONFIG === 'undefined') {
    console.error('❌ CONFIG n\'est pas défini ! Assurez-vous que config.js est chargé avant login.js');
    showMessage('Erreur de configuration. Veuillez recharger la page.', 'error');
}

// Détection email
function isEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

// Gestionnaire de soumission du formulaire
document.getElementById("login").addEventListener("submit", function (e) {
    e.preventDefault();

    // Vérification que CONFIG est disponible avant de continuer
    if (typeof CONFIG === 'undefined') {
        showMessage('Erreur de configuration. Veuillez recharger la page.', 'error');
        return;
    }

    const username = e.target.username.value.trim();
    const password = e.target.password.value;
    

    // Validation des champs
    if (!username || !password) {
        showMessage('Veuillez remplir tous les champs', 'error');
        return;
    }

    // Activer l'état de chargement
    setLoadingState(true);

    // Masquer les messages précédents
    document.getElementById('message-container').style.display = 'none';

    const isEmailValue = isEmail(username);

    // Construire dynamiquement les données envoyées
    const requestData = isEmailValue
        ? { email: username, password }
        : { username: username, password };
    // Appel à l'API
    // Note: axios.defaults.baseURL est configuré dans config.js
    // Donc on peut utiliser directement l'endpoint ou CONFIG.BASE_URL + endpoint
    const loginUrl = CONFIG.BASE_URL + CONFIG.ENDPOINTS.AUTH.LOGIN;
    console.log('🔗 URL de connexion:', loginUrl);
    
    axios.post(loginUrl, requestData)
    .then(res => {
        console.log('Connexion réussie:', res.data);
        
        
        const token = res.data.key;
        // Stocker le token
        localStorage.setItem('token', token);
        
        // Stocker les informations utilisateur si disponibles
        if (token) {
            localStorage.setItem('user', JSON.stringify(token));
        }

        const userInfoUrl = CONFIG.BASE_URL + CONFIG.ENDPOINTS.AUTH.USER_INFO;
        console.log('🔗 URL info utilisateur:', userInfoUrl);
        
        return axios.get(userInfoUrl, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        
    }).then(userRes => {
        const userData = userRes.data;
        console.log("Infos utilisateur :", userData);

        localStorage.setItem('user', JSON.stringify(userData));

        // Vérification du rôle
        const role = userData.role;

        let redirectUrl = '/pages/student/classe.html'; // fallback par défaut
        if (role === 'student') {
            redirectUrl = '/pages/student/classe.html';
        } else if (role === 'teacher') {
            redirectUrl = '/pages/teacher/classes.html';
        } else if (role === 'admin') {
            redirectUrl = '/pages/administration/classes.html';
        }

        showNotification(`success`, `Redirection vers l'espace ${role}...`, 'Connexion réussie');

        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1500);
    }).catch(error => {
        console.error('Erreur de connexion:', error);
        
        // Désactiver l'état de chargement
        setLoadingState(false);
        
        // Gestion des différents types d'erreurs
        let errorMessage = 'Une erreur est survenue lors de la connexion';
        
        if (error.response) {
            // Erreur de réponse du serveur
            const status = error.response.status;
            const data = error.response.data;
            
            if (status === 400) {
                if (data.non_field_errors) {
                    errorMessage = data.non_field_errors[0];
                } else if (data.username) {
                    errorMessage = data.username[0];
                } else if (data.password) {
                    errorMessage = data.password[0];
                } else {
                    errorMessage = 'Identifiants invalides';
                }
            } else if (status === 401) {
                errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
            } else if (status === 403) {
                errorMessage = 'Accès refusé. Votre compte pourrait être désactivé.';
            } else if (status === 500) {
                errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
            }
        } else if (error.request) {
            // Erreur de réseau
            errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
        } else {
            // Autre erreur
            errorMessage = error.message || 'Une erreur inattendue s\'est produite';
        }
        
        showNotification('danger', errorMessage, 'Echec de la connexion');
    });
});

// Masquer les messages quand l'utilisateur commence à taper
document.querySelectorAll('#login input').forEach(input => {
    input.addEventListener('input', function() {
        document.getElementById('message-container').style.display = 'none';
    });
});

