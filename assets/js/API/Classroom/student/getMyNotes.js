// Fonction pour charger les modules et notes de l'étudiant
function loadMyNotes() {
    axios.get(CONFIG.BASE_URL + '/api/my-notes/', {
        headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
        }
    })
    .then(response => {
        const modules = response.data;
        displayModulesList(modules);
        updateStatistics(modules);
    })
    .catch(error => {
        console.error("Erreur lors du chargement des modules :", error);
        // Afficher des modules d'exemple en cas d'erreur
        const sampleModules = [
            {
                "id": 1,
                "name": "Mathématiques",
                "level": "Débutant",
                "exam_link": "https://exam.example.com/math1",
                "status": "Validé",
                "date": "2025-01-15",
                "score": 85
            },
            {
                "id": 2,
                "name": "Français",
                "level": "Intermédiaire",
                "exam_link": "https://exam.example.com/french1",
                "status": "En cours",
                "date": "2025-01-20",
                "score": null
            },
            {
                "id": 3,
                "name": "Anglais",
                "level": "Avancé",
                "exam_link": "https://exam.example.com/english1",
                "status": "Validé",
                "date": "2025-01-10",
                "score": 92
            },
            {
                "id": 4,
                "name": "Histoire",
                "level": "Débutant",
                "exam_link": "https://exam.example.com/history1",
                "status": "En attente",
                "date": "2025-02-01",
                "score": null
            }
        ];
        displayModulesList(sampleModules);
        updateStatistics(sampleModules);
    });
}

// Afficher la liste des modules
function displayModulesList(modules) {
    const modulesList = document.getElementById('modules-list');
    if (!modulesList) {
        console.error("Élément 'modules-list' non trouvé");
        return;
    }
    
    modulesList.innerHTML = '';
    
    if (modules && modules.length > 0) {
        modules.forEach(module => {
            const moduleElement = createModuleElement(module);
            modulesList.appendChild(moduleElement);
        });
    } else {
        modulesList.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    <i class="fas fa-book fa-2x mb-3"></i>
                    <p>Aucun module trouvé</p>
                </td>
            </tr>
        `;
    }
    
    // Initialiser la DataTable
    initializeDataTable();
}

// Créer un élément de module
function createModuleElement(module) {
    const row = document.createElement('tr');
    
    // Déterminer la couleur du statut
    let statusClass = 'badge bg-secondary';
    let statusIcon = 'fa-clock';
    
    switch(module.status) {
        case 'Validé':
            statusClass = 'badge bg-success';
            statusIcon = 'fa-check-circle';
            break;
        case 'En cours':
            statusClass = 'badge bg-warning';
            statusIcon = 'fa-play-circle';
            break;
        case 'En attente':
            statusClass = 'badge bg-info';
            statusIcon = 'fa-hourglass-half';
            break;
        case 'Échoué':
            statusClass = 'badge bg-danger';
            statusIcon = 'fa-times-circle';
            break;
    }
    
    // Formater la note
    const scoreDisplay = module.score !== null ? `${module.score}/100` : 'N/A';
    const scoreClass = module.score !== null ? (module.score >= 50 ? 'text-success' : 'text-danger') : 'text-muted';
    
    row.innerHTML = `
        <td>${module.name}</td>
        <td>${module.level}</td>
        <td>
            <span class="${statusClass}">
                <i class="fas ${statusIcon}"></i> ${module.status}
            </span>
        </td>
        <td>${formatDate(module.date)}</td>
        <td class="${scoreClass} fw-bold">${scoreDisplay}</td>
        <td>
            <div class="d-flex justify-content-around">
                <button class="btn btn-link p-0" title="Voir les détails" onclick="viewModuleDetails(${module.id})">
                    <i class="fa fa-eye text-primary"></i>
                </button>
                ${module.exam_link ? 
                    `<button class="btn btn-link p-0" title="Passer l'examen" onclick="takeExam('${module.exam_link}')">
                        <i class="fa fa-edit text-success"></i> Passer l'examen
                    </button>` : 
                    `<span class="text-muted">Examen non disponible</span>`
                }
            </div>
        </td>
    `;
    
    return row;
}

// Mettre à jour les statistiques
function updateStatistics(modules) {
    // Nombre total de modules
    const modulesCountElement = document.getElementById('modules-count');
    if (modulesCountElement) {
        if (modules && modules.length > 0) {
            modulesCountElement.textContent = modules.length;
        } else {
            modulesCountElement.textContent = 'N/A';
        }
    }
    
    // Modules validés
    const validatedCountElement = document.getElementById('validated-count');
    if (validatedCountElement) {
        if (modules && modules.length > 0) {
            const validatedModules = modules.filter(module => module.status === 'Validé').length;
            validatedCountElement.textContent = validatedModules;
        } else {
            validatedCountElement.textContent = 'N/A';
        }
    }
    
    // Modules en attente
    const pendingCountElement = document.getElementById('pending-count');
    if (pendingCountElement) {
        if (modules && modules.length > 0) {
            const pendingModules = modules.filter(module => module.status === 'En attente').length;
            pendingCountElement.textContent = pendingModules;
        } else {
            pendingCountElement.textContent = 'N/A';
        }
    }
    
    // Moyenne générale
    const averageScoreElement = document.getElementById('average-score');
    if (averageScoreElement) {
        if (modules && modules.length > 0) {
            const scoredModules = modules.filter(module => module.score !== null);
            if (scoredModules.length > 0) {
                const totalScore = scoredModules.reduce((sum, module) => sum + module.score, 0);
                const averageScore = Math.round(totalScore / scoredModules.length);
                averageScoreElement.textContent = `${averageScore}/100`;
            } else {
                averageScoreElement.textContent = 'N/A';
            }
        } else {
            averageScoreElement.textContent = 'N/A';
        }
    }
}

// Formater la date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

// Initialiser la DataTable
function initializeDataTable() {
    if ($.fn.DataTable.isDataTable('#basic-datatables')) {
        $('#basic-datatables').DataTable().destroy();
    }
    
    $('#basic-datatables').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/French.json"
        },
        "pageLength": 10,
        "responsive": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "lengthChange": true,
        "order": [[3, "desc"]] // Trier par date (colonne 3) décroissant
    });
}

// Voir les détails d'un module
function viewModuleDetails(moduleId) {
    // Ici vous pouvez ajouter une modal pour afficher les détails du module
    console.log(`Voir les détails du module ${moduleId}`);
    // Exemple : ouvrir une modal avec les détails
    // $('#moduleDetailsModal').modal('show');
}

// Passer un examen
function takeExam(examLink) {
    if (examLink) {
        window.open(examLink, '_blank');
    }
}

// Initialiser les statistiques à "N/A" au chargement
function initializeStatistics() {
    const modulesCountElement = document.getElementById('modules-count');
    if (modulesCountElement) modulesCountElement.textContent = 'N/A';
    
    const validatedCountElement = document.getElementById('validated-count');
    if (validatedCountElement) validatedCountElement.textContent = 'N/A';
    
    const pendingCountElement = document.getElementById('pending-count');
    if (pendingCountElement) pendingCountElement.textContent = 'N/A';
    
    const averageScoreElement = document.getElementById('average-score');
    if (averageScoreElement) averageScoreElement.textContent = 'N/A';
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les statistiques à "N/A"
    initializeStatistics();
    // Charger les modules au chargement de la page
    loadMyNotes();
});
