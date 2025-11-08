let testIdToDelete = null; // variable globale

// Fonction pour obtenir l'ID de l'étudiant actuel
function getCurrentStudentId() {
  // Cette fonction devrait récupérer l'ID de l'étudiant connecté
  // Pour l'instant, on utilise une valeur par défaut ou on peut l'obtenir du localStorage
  return localStorage.getItem("student_id") || null;
}

// Fonction pour rafraîchir automatiquement les devoirs disponibles
function refreshAvailableHomework() {
  // Cette fonction peut être appelée périodiquement pour mettre à jour les devoirs disponibles
  if (typeof loadTests === 'function') {
    loadTests();
  }
}

// Démarrer la vérification périodique des devoirs disponibles (toutes les 5 minutes)
function startHomeworkRefresh() {
  // Vérifier immédiatement
  refreshAvailableHomework();
  
  // Puis vérifier toutes les 5 minutes
  setInterval(refreshAvailableHomework, 300000); // 300000ms = 5 minutes
}

function loadTests() {
  axios.get(CONFIG.BASE_URL + '/api/homework/', {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` }
  })
  .then(response => {
    const tableBody = document.getElementById("modules-list");
    tableBody.innerHTML = "";

    response.data.results.forEach(devoir => {
      // Filtrer les devoirs : ne montrer que ceux qui sont disponibles pour les étudiants
      let shouldShow = false;
      
      if (devoir.is_sent) {
        // Vérifier si le devoir est disponible (non expiré)
        shouldShow = isHomeworkAvailableForStudents(devoir);
      } else if (devoir.is_scheduled && devoir.scheduled_date) {
        // Pour les devoirs programmés, vérifier si la date d'envoi est arrivée
        const now = new Date();
        shouldShow = new Date(devoir.scheduled_date) <= now;
        
        // Si c'est un devoir programmé qui vient d'être envoyé, vérifier aussi la date limite
        if (shouldShow && devoir.end_date) {
          shouldShow = new Date(devoir.end_date) >= now;
        }
      }
      
      // Pour les devoirs individuels, vérifier que l'étudiant correspond
      const isForCurrentStudent = !devoir.is_individual || devoir.student === getCurrentStudentId();
      
      if (shouldShow && isForCurrentStudent) {
        const row = document.createElement("tr");
        
        // Ajouter une indication si c'est un devoir individuel
        const typeIndicator = devoir.is_individual ? ' <span class="badge bg-info">Individuel</span>' : '';
        
        row.innerHTML = ` 
          <td>${devoir.name}${typeIndicator}</td>
          <td>${devoir.level_name}</td>
          <td>${devoir.course_name}</td>
          <td>${devoir.class_name}</td>
          <td>
            <div class="d-flex justify-content-around">
              <button class="btn btn-detail p-0" data-id="${devoir.id}" data-bs-toggle="modal" data-bs-target="#devoirs-info" title="voir">
                <i class="fa fa-eye text-primary"></i>
              </button>
            </div>
          </td>`;
        tableBody.appendChild(row);
      }
    });

    // Reinit DataTable
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#basic-datatables')) {
        $('#basic-datatables').DataTable().destroy();
      }
      $('#basic-datatables').DataTable({
        "pageLength": 5,
        "responsive": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "lengthChange": true
      });
    }, 100);
  })
  .catch(error => {
    console.error("Erreur GET :", error);
    showNotification("error", "Erreur lors du chargement des devoirs.", "Action échouée");
  });
}

document.addEventListener("click", function (e) {
    if (e.target.closest(".btn-detail")) {
      const devoirId = e.target.closest(".btn-detail").dataset.id;
      console.log("Devoir ID :", devoirId);
  
      axios.get(CONFIG.BASE_URL + `/api/homework/${devoirId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
          })
          .then(response => {
            const devoir = response.data;
            document.getElementById("devoir-name").textContent = devoir.name;
            document.getElementById("devoir-description").textContent = devoir.description;
            document.getElementById("devoir-cours").textContent = devoir.course_name;
            document.getElementById("devoir-level").textContent = devoir.level_name;
            document.getElementById("devoir-created-at").textContent = devoir.created_at_formatted;
            document.getElementById("devoir-url-info").innerHTML = `<a class="text-white" href="${devoir.form_link}" target="_blank"><i class="fa fa-link "></i> Procéder au devoir</a>`;  
          })
            .catch(error => {
            console.error("Erreur lors du chargement du devoir :", error);
            showNotification("error", "Erreur lors du chargement du devoir.", "Action échouée");
          });
      }
    }
  );
loadTests();

// Initialiser la vérification périodique des devoirs disponibles
startHomeworkRefresh();
