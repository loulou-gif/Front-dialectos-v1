// Fonction pour charger les emails de l'utilisateur connecté
function loadMyEmails() {
    axios.get(CONFIG.BASE_URL + '/api/my-emails/', {
        headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
        }
    })
    .then(response => {
        const emails = response.data;
        displayEmailsList(emails);
    })
    .catch(error => {
        console.error("Erreur lors du chargement des emails :", error);
        // Afficher des emails d'exemple en cas d'erreur
        const sampleEmails = [
            {
                "id": 30,
                "subject": "Comment s'inscrire en licence 3",
                "message": "ok",
                "from_email": "konankanjulius10@gmail.com",
                "to_email": "konankanjulius10@gmail.com",
                "sent_at": "06/08/2025 15:31:13",
                "criticality": "NEUTRE",
                "diffusion_list": null
            },
            {
                "id": 29,
                "subject": "DISPENCE DE COURS POUR DEMAIN",
                "message": "Bonjour à toutes et à tous,\n\nNous vous informons que les cours sont suspendus pour la journée du jeudi 07 août 2025, en raison de la célébration de la Fête de l'Indépendance en Côte d'Ivoire.\n\nLes activités reprendront normalement le vendredi 08 août 2025 selon l'emploi du temps habituel.\n\nMerci de prendre vos dispositions en conséquence.\n\nBien cordialement,\nL'équipe Dialektos",
                "from_email": "konankanjulius10@gmail.com",
                "to_email": "konankanjulius10@gmail.com",
                "sent_at": "06/08/2025 15:20:49",
                "criticality": "Normal",
                "diffusion_list": null
            }
        ];
        displayEmailsList(sampleEmails);
    });
}

// Afficher la liste des emails
function displayEmailsList(emails) {
    const emailsListContent = document.getElementById('annonces-list-content');
    if (!emailsListContent) {
        console.error("Élément 'annonces-list-content' non trouvé");
        return;
    }
    
    emailsListContent.innerHTML = '';
    
    if (emails && emails.length > 0) {
        // Trier les emails par date (plus récent en premier)
        const sortedEmails = emails.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
        
        sortedEmails.forEach(email => {
            const emailElement = createEmailElement(email);
            emailsListContent.appendChild(emailElement);
        });
    } else {
        emailsListContent.innerHTML = `
            <div class="text-center text-muted p-4">
                <i class="fas fa-inbox fa-2x mb-3"></i>
                <p>Aucun email trouvé</p>
            </div>
        `;
    }
}

// Créer un élément d'email
function createEmailElement(email) {
    const emailDiv = document.createElement('div');
    emailDiv.className = 'annonce-item p-3 border-bottom bg-white';
    emailDiv.setAttribute('data-email-id', email.id);
    emailDiv.onclick = () => selectEmail(email);
    
    // Déterminer la couleur selon la criticité
    let criticalityColor = 'bg-secondary';
    let criticalityIcon = 'fa-info-circle';
    
    if (email.criticality === 'URGENT' || email.criticality === 'CRITIQUE') {
        criticalityColor = 'bg-danger';
        criticalityIcon = 'fa-exclamation-triangle';
    } else if (email.criticality === 'IMPORTANT') {
        criticalityColor = 'bg-warning';
        criticalityIcon = 'fa-exclamation-circle';
    } else if (email.criticality === 'Normal') {
        criticalityColor = 'bg-info';
        criticalityIcon = 'fa-bullhorn';
    }
    
    emailDiv.innerHTML = `
        <div class="d-flex align-items-start">
            <div class="avatar-sm me-3 mt-1">
                <div class="avatar-img rounded-circle ${criticalityColor} d-flex align-items-center justify-content-center">
                    <i class="fas ${criticalityIcon} text-white"></i>
                </div>
            </div>
            <div class="flex-grow-1">
                <h6 class="mb-1 text-truncate">${email.subject}</h6>
                <small class="text-muted d-block">${formatDate(email.sent_at)}</small>
                <small class="text-muted">${email.from_email}</small>
            </div>
            <div class="badge ${criticalityColor} rounded-pill ms-2">${email.criticality}</div>
        </div>
    `;
    
    return emailDiv;
}

// Sélectionner un email
function selectEmail(email) {
    // Mettre à jour l'interface
    const titleElement = document.getElementById('annonce-title');
    const metaElement = document.getElementById('annonce-meta');
    const noSelectionElement = document.getElementById('no-annonce-selected');
    const contentDiv = document.getElementById('annonce-content');
    
    if (titleElement) titleElement.textContent = email.subject;
    if (metaElement) metaElement.textContent = `Envoyé le ${formatDate(email.sent_at)} par ${email.from_email}`;
    if (noSelectionElement) noSelectionElement.style.display = 'none';
    
    // Afficher le contenu
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div class="annonce-details">
                <div class="mb-3">
                    <span class="badge ${getCriticalityBadgeClass(email.criticality)}">${email.criticality}</span>
                </div>
                <div class="annonce-message">
                    ${formatMessage(email.message)}
                </div>
                <hr>
                <div class="annonce-footer text-muted">
                    <small>
                        <strong>De :</strong> ${email.from_email}<br>
                        <strong>À :</strong> ${email.to_email}<br>
                        <strong>Envoyé le :</strong> ${formatDate(email.sent_at)}
                    </small>
                </div>
            </div>
        `;
    }
    
    // Mettre à jour la sélection visuelle
    document.querySelectorAll('.annonce-item').forEach(item => {
        item.classList.remove('active', 'bg-light');
    });
    const selectedElement = document.querySelector(`[data-email-id="${email.id}"]`);
    if (selectedElement) {
        selectedElement.classList.add('active', 'bg-light');
    }
}

// Formater la date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString; // Retourner la chaîne originale si le parsing échoue
    }
}

// Formater le message (convertir les retours à la ligne)
function formatMessage(message) {
    if (!message) return '<i>(Aucun contenu)</i>';
    return message.replace(/\n/g, '<br>');
}

// Obtenir la classe CSS pour le badge de criticité
function getCriticalityBadgeClass(criticality) {
    switch(criticality) {
        case 'URGENT':
        case 'CRITIQUE':
            return 'bg-danger';
        case 'IMPORTANT':
            return 'bg-warning';
        case 'Normal':
            return 'bg-info';
        case 'NEUTRE':
            return 'bg-secondary';
        default:
            return 'bg-secondary';
    }
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter des styles pour les interactions
    const style = document.createElement('style');
    style.textContent = `
        .annonce-item {
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .annonce-item:hover {
            background-color: #f8f9fa !important;
        }
        .annonce-item.active {
            background-color: #e3f2fd !important;
            border-left: 3px solid #2196f3;
        }
        .annonce-message {
            line-height: 1.6;
            white-space: pre-line;
        }
        .text-truncate {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        /* Amélioration du scroll */
        #annonces-list {
            scrollbar-width: thin;
            scrollbar-color: #888 #f1f1f1;
        }
        
        #annonces-list::-webkit-scrollbar {
            width: 6px;
        }
        
        #annonces-list::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        
        #annonces-list::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
        }
        
        #annonces-list::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        
        #annonce-content {
            scrollbar-width: thin;
            scrollbar-color: #888 #f1f1f1;
        }
        
        #annonce-content::-webkit-scrollbar {
            width: 6px;
        }
        
        #annonce-content::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        
        #annonce-content::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
        }
        
        #annonce-content::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    `;
    document.head.appendChild(style);
    
    // Charger les emails au chargement de la page
    loadMyEmails();
});
