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
function loadClasses() {
    axios.get(CONFIG.BASE_URL + '/api/user/me/profile/', {
        headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
        }
    })
    .then(response => {
        const tableBody = document.getElementById("classe-list");
        tableBody.innerHTML = "";
        
        // Traiter la réponse comme un objet unique
        const userData = response.data;
        
        // Vérifier si class_info existe
        if (userData.class_info) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${userData.class_info.class_name || 'N/A'}</td>
                <td>${userData.class_info.level || 'N/A'}</td>
                <td>${userData.class_info.teacher_name || 'N/A'}</td>
                <td>
                <div class="d-flex justify-content-around">
                    <!-- Modifier (ouvre la modale de modification) -->
                    <button class="btn p-0 btn-details btn-primary row" data-id="${userData.id}" data-bs-toggle="modal" data-bs-target="#classe-info" title="Modifier">
                        <i class="fa fa-eye text-white"> Détails </i>
                    </button>

                </div>
            </td>
            `;
            tableBody.appendChild(row);
        } else {
            // Si pas d'informations de classe, afficher un message
            const row = document.createElement("tr");
            row.innerHTML = `
                <td colspan="4" class="text-center">Aucune information de classe disponible</td>
            `;
            tableBody.appendChild(row);
        }
        
        // Mettre à jour les blocs de statistiques
        updateStatistics(userData);
        
        // Initialiser ou réinitialiser la DataTable
        if ($.fn.DataTable.isDataTable('#basic-datatables')) {
            $('#basic-datatables').DataTable().destroy();
        }
        $('#basic-datatables').DataTable({

            "pageLength": 10,
            "responsive": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "lengthChange": true
        });
    })
    .catch(error => {
        console.error("Erreur GET :", error);
        showNotification("error", "Erreur lors du chargement des classes.", "Action échouée");
    });
}
    
// Fonction pour mettre à jour les blocs de statistiques
function updateStatistics(userData) {
    // Mise à jour du niveau de la classe
    const levelElement = document.getElementById('level-count');
    if (levelElement && userData.class_info && userData.class_info.level) {
        levelElement.textContent = userData.class_info.level;
    } else if (levelElement) {
        levelElement.textContent = 'N/A';
    }

    // Mise à jour du nombre d'étudiants
    const studentsElement = document.getElementById('students-count');
    if (studentsElement && userData.class_info && userData.class_info.students_count !== undefined && userData.class_info.students_count !== null) {
        studentsElement.textContent = userData.class_info.students_count;
    } else if (studentsElement) {
        studentsElement.textContent = 'N/A';
    }

    // Mise à jour du nombre de modules (pour l'instant, valeur par défaut)
    const modulesElement = document.getElementById('modules-count');
    if (modulesElement && userData.class_info && userData.class_info.modules_count !== undefined && userData.class_info.modules_count !== null) {
        modulesElement.textContent = userData.class_info.modules_count;
    } else if (modulesElement) {
        modulesElement.textContent = 'N/A';
    }

    // Mise à jour de la moyenne actuelle (pour l'instant, valeur par défaut)
    const averageElement = document.getElementById('average-count');
    if (averageElement && userData.class_info && userData.class_info.average_score) {
        averageElement.textContent = userData.class_info.average_score;
    } else if (averageElement) {
        averageElement.textContent = 'N/A';
    }
}

// Initialiser les statistiques à "N/A" au chargement
function initializeStatistics() {
    const levelElement = document.getElementById('level-count');
    if (levelElement) levelElement.textContent = 'N/A';
    
    const studentsElement = document.getElementById('students-count');
    if (studentsElement) studentsElement.textContent = 'N/A';
    
    const modulesElement = document.getElementById('modules-count');
    if (modulesElement) modulesElement.textContent = 'N/A';
    
    const averageElement = document.getElementById('average-count');
    if (averageElement) averageElement.textContent = 'N/A';
}

// Initialiser les statistiques au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStatistics);
} else {
    initializeStatistics();
}

loadClasses();


document.addEventListener("click", function (e) {
    if (e.target.closest(".btn-details")) {
      const classId = e.target.closest(".btn-details").dataset.id;
  
      // Récupérer les informations détaillées de la classe
      axios.get(CONFIG.BASE_URL + `/api/user/me/profile/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      }).then(response => {
        const userData = response.data;
        
        
        // Remplir la modal avec les informations de la classe
        if (userData.class_info) {
          showNotification("success", "Détails de la classe chargés avec succès !", "Action réussie");
          document.getElementById("classe-name").textContent = userData.class_info.class_name || 'N/A';
          document.getElementById("classe-level").textContent = userData.class_info.level || 'N/A';
          document.getElementById("classe-teacher").textContent = userData.class_info.teacher_name || 'N/A';
          document.getElementById("classe-created-at").textContent = userData.class_info.created_at || 'N/A';
        } else {
          // Si pas d'informations de classe
          document.getElementById("classe-name").textContent = 'Aucune information';
          document.getElementById("classe-level").textContent = 'N/A';
          document.getElementById("classe-teacher").textContent = 'N/A';
          document.getElementById("classe-created-at").textContent = 'N/A';
        }
      }).catch(error => {
        console.error("Erreur lors du chargement des détails de la classe :", error);
        showNotification("error", "Erreur lors du chargement des détails de la classe.", "Action échouée");
        // Afficher un message d'erreur dans la modal
        document.getElementById("classe-name").textContent = 'Erreur de chargement';
        document.getElementById("classe-level").textContent = 'N/A';
        document.getElementById("classe-teacher").textContent = 'N/A';
        document.getElementById("classe-created-at").textContent = 'N/A';
      });
    }
  });