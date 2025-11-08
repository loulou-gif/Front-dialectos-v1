// Fonction pour charger les cours de l'étudiant
function loadMyCourses() {
    axios.get(CONFIG.BASE_URL + '/api/my-courses/', {
        headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
        }
    })
    .then(response => {
        const courses = response.data;
        displayCoursesList(courses);
    })
    .catch(error => {
        console.error("Erreur lors du chargement des cours :", error);
        // Afficher des cours d'exemple en cas d'erreur
        const sampleCourses = [
            {
                "id": 1,
                "name": "Mathématiques de base",
                "level_name": "Débutant",
                "descriptions": "Cours de mathématiques pour débutants",
                "meeting_link": "https://meet.google.com/abc-defg-hij",
                "pdf": "https://example.com/courses/math-basic.pdf",
                "created_at": "2025-01-15"
            },
            {
                "id": 2,
                "name": "Français avancé",
                "level_name": "Avancé",
                "descriptions": "Cours de français pour niveau avancé",
                "meeting_link": "https://meet.google.com/xyz-uvw-rst",
                "pdf": "https://example.com/courses/french-advanced.pdf",
                "created_at": "2025-01-20"
            },
            {
                "id": 3,
                "name": "Anglais conversationnel",
                "level_name": "Intermédiaire",
                "descriptions": "Cours d'anglais pour améliorer la conversation",
                "meeting_link": "https://meet.google.com/mno-pqr-stu",
                "pdf": "https://example.com/courses/english-conversation.pdf",
                "created_at": "2025-01-25"
            }
        ];
        displayCoursesList(sampleCourses);
    });
}

// Afficher la liste des cours
function displayCoursesList(courses) {
    const coursesList = document.getElementById('classe-list');
    if (!coursesList) {
        console.error("Élément 'classe-list' non trouvé");
        return;
    }
    
    coursesList.innerHTML = '';
    
    if (courses && courses.length > 0) {
        courses.forEach(course => {
            const courseElement = createCourseElement(course);
            coursesList.appendChild(courseElement);
        });
    } else {
        coursesList.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    <i class="fas fa-book fa-2x mb-3"></i>
                    <p>Aucun cours trouvé</p>
                </td>
            </tr>
        `;
    }
    
    // Initialiser la DataTable
    initializeDataTable();
}

// Créer un élément de cours
function createCourseElement(course) {
    const row = document.createElement('tr');
    
    // Formater la description (limiter à 100 caractères)
    const shortDescription = course.descriptions && course.descriptions.length > 100 
        ? course.descriptions.substring(0, 100) + '...' 
        : course.descriptions || 'Aucune description';
    
    // Formater la date
    const formattedDate = formatDate(course.created_at);
    
    row.innerHTML = `
        <td>${course.name}</td>
        <td><span class="badge bg-info">${course.level_name}</span></td>
        <td>${shortDescription}</td>
        <td>
            ${course.meeting_link ? 
                `<a href="${course.meeting_link}" target="_blank" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-video"></i> Rejoindre
                </a>` : 
                '<span class="text-muted">Non disponible</span>'
            }
        </td>
        <td>
            ${course.pdf ? 
                `<a href="${course.pdf}" target="_blank" class="btn btn-sm btn-outline-success">
                    <i class="fas fa-file-pdf"></i> Télécharger
                </a>` : 
                '<span class="text-muted">Non disponible</span>'
            }
        </td>
        <td>${formattedDate}</td>
        <td>
            <div class="d-flex justify-content-around">
                <button class="btn btn-link p-0" title="Voir les détails" onclick="viewCourseDetails(${course.id})">
                    <i class="fa fa-eye text-primary"></i>
                </button>
                ${course.meeting_link ? 
                    `<button class="btn btn-link p-0" title="Rejoindre le meeting" onclick="joinMeeting('${course.meeting_link}')">
                        <i class="fa fa-video text-success"></i>
                    </button>` : ''
                }
                ${course.pdf ? 
                    `<button class="btn btn-link p-0" title="Télécharger le PDF" onclick="downloadPDF('${course.pdf}')">
                        <i class="fa fa-download text-info"></i>
                    </button>` : ''
                }
            </div>
        </td>
    `;
    
    return row;
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
        "order": [[5, "desc"]] // Trier par date (colonne 5) décroissant
    });
}

// Voir les détails d'un cours
function viewCourseDetails(courseId) {
    // Ici vous pouvez ajouter une modal pour afficher les détails du cours
    console.log(`Voir les détails du cours ${courseId}`);
    // Exemple : ouvrir une modal avec les détails
    // $('#courseDetailsModal').modal('show');
}

// Rejoindre un meeting
function joinMeeting(meetingLink) {
    if (meetingLink) {
        window.open(meetingLink, '_blank');
    }
}

// Télécharger un PDF
function downloadPDF(pdfLink) {
    if (pdfLink) {
        window.open(pdfLink, '_blank');
    }
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', function() {
    // Charger les cours au chargement de la page
    loadMyCourses();
});
