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

let studentData = null; // Variable globale pour stocker les données de l'étudiant

function loadStudentDashboard() {
  // Détruire le DataTable existant si présent
  if ($.fn.DataTable.isDataTable('#basic-datatables')) {
    $('#basic-datatables').DataTable().destroy();
  }

  axios.get(CONFIG.BASE_URL + '/api/user/me/complete-info', {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` }
  })
  .then(response => {
    studentData = response.data;
    
    // Mettre à jour les informations de l'utilisateur dans le profil
    updateUserProfile(studentData);
    
    // Mettre à jour les statistiques
    updateStatistics(studentData);
    
    // Charger les notes dans le tableau
    loadNotesTable(studentData.test_results);
  })
  .catch(error => {
    console.error("Erreur GET :", error);
    showNotification("error", "Erreur lors du chargement des données.", "Action échouée");
  });
}

function updateUserProfile(data) {
  // Mettre à jour le nom d'affichage dans le header
  const displayName = data.first_name || data.username;
  document.getElementById("userDisplayName").textContent = displayName;
  
  // Mettre à jour le nom complet dans le dropdown
  const fullName = `${data.first_name} ${data.last_name}`;
  document.getElementById("userFullName").textContent = fullName;
  
  // Mettre à jour l'email
  document.getElementById("userEmail").textContent = data.email;
}

function updateStatistics(data) {
  // Nombre total de tests
  const modulesCountEl = document.getElementById("modules-count");
  if (modulesCountEl) {
    modulesCountEl.textContent = data.total_tests ? data.total_tests : "N/A";
  }
  
  // Modules validés (tests avec note >= 50, par exemple)
  const validatedCountEl = document.getElementById("validated-count");
  if (validatedCountEl) {
    if (data.test_results && Array.isArray(data.test_results)) {
      const validatedTests = data.test_results.filter(test => test.result >= 50).length;
      validatedCountEl.textContent = validatedTests;
    } else {
      validatedCountEl.textContent = "N/A";
    }
  }
  
  // Moyenne générale
  const averageScoreEl = document.getElementById("average-score");
  if (averageScoreEl) {
    averageScoreEl.textContent = data.average_score ? parseFloat(data.average_score).toFixed(2) : "N/A";
  }
  
  // Tests en attente (on peut considérer qu'un test est en attente si l'observation contient certains mots-clés)
  const pendingCountEl = document.getElementById("pending-count");
  if (pendingCountEl) {
    if (data.test_results && Array.isArray(data.test_results)) {
      const pendingTests = data.test_results.filter(test => 
        test.observation && test.observation.toLowerCase().includes("attente")
      ).length;
      pendingCountEl.textContent = pendingTests;
    } else {
      pendingCountEl.textContent = "N/A";
    }
  }
}

function loadNotesTable(testResults) {
  const tableBody = document.getElementById("notes-list");
  tableBody.innerHTML = "";

  if (!testResults || testResults.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5" class="text-center">Aucune note disponible</td>`;
    tableBody.appendChild(row);
    return;
  }

  testResults.forEach(note => {
    const row = document.createElement("tr");
    row.innerHTML = ` 
      <td>${studentData.first_name} ${studentData.last_name}</td>
      <td>${note.homework_name}</td>
      <td>${note.created_at}</td>
      <td><span class="badge ${getBadgeClass(note.result)}">${note.result}</span></td>
      <td>
        <div class="d-flex justify-content-around">
          <button class="btn btn-link p-0 btn-detail" data-note-id="${note.id}" data-bs-toggle="modal" data-bs-target="#note-info" title="Voir les détails">
            <i class="fa fa-eye text-primary"></i>
          </button>
        </div>
      </td>`;
    tableBody.appendChild(row);
  });

  // Initialiser DataTable après l'ajout des données
  $('#basic-datatables').DataTable({
    "pageLength": 10,
    "responsive": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "lengthChange": true,
    "order": [[2, 'desc']] // Trier par date décroissante
  });
}

// Fonction pour obtenir la classe de badge selon la note
function getBadgeClass(result) {
  if (result >= 75) return "badge-success";
  if (result >= 50) return "badge-warning";
  return "badge-danger";
}

// Initialiser les statistiques à "N/A" au chargement
function initializeStatistics() {
  const modulesCountEl = document.getElementById("modules-count");
  if (modulesCountEl) modulesCountEl.textContent = "N/A";
  
  const validatedCountEl = document.getElementById("validated-count");
  if (validatedCountEl) validatedCountEl.textContent = "N/A";
  
  const averageScoreEl = document.getElementById("average-score");
  if (averageScoreEl) averageScoreEl.textContent = "N/A";
  
  const pendingCountEl = document.getElementById("pending-count");
  if (pendingCountEl) pendingCountEl.textContent = "N/A";
}

// Attendre que le DOM soit chargé avant d'appeler les fonctions
document.addEventListener("DOMContentLoaded", function() {
  initializeStatistics();
  loadStudentDashboard();
});

// Gestion du clic sur le bouton "Voir les détails"
document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-detail")) {
    const noteId = parseInt(e.target.closest(".btn-detail").dataset.noteId);
    
    // Trouver la note correspondante dans les données
    const note = studentData.test_results.find(test => test.id === noteId);
    
    if (note) {
      // Remplir le modal avec les informations
      document.getElementById("note-name").textContent = note.homework_name;
      document.getElementById("note-student").textContent = `${studentData.first_name} ${studentData.last_name}`;
      document.getElementById("note-observation").textContent = note.observation || "Aucune observation";
      document.getElementById("note-classes").textContent = studentData.class_info ? studentData.class_info.class_name : "N/A";
      document.getElementById("note-devoir").textContent = note.result;
      document.getElementById("note-created-at").textContent = note.created_at;
    } else {
      showNotification("error", "Impossible de trouver les détails de cette note.", "Erreur");
    }
  }
});
