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

let testIdToDelete = null; // variable globale

function loadTests() {
  // Détruire le DataTable existant si présent
  if ($.fn.DataTable.isDataTable('#basic-datatables')) {
    $('#basic-datatables').DataTable().destroy();
  }

  axios.get(CONFIG.BASE_URL + CONFIG.ENDPOINTS.RESULTS, {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` }
  })
  .then(response => {
    const tableBody = document.getElementById("notes-list");
    tableBody.innerHTML = "";

    response.data.results.forEach(note => {
      const row = document.createElement("tr");
      row.innerHTML = ` 
        <td>${note.student_name}</td>
        <td>${note.homework_name}</td>
        <td>${note.created_at_formatted}</td>
        <td>${note.result}</td>
        <td>
          <div class="d-flex justify-content-around">
            <button class="btn btn-link p-0 btn-detail" data-id="${note.id}" data-bs-toggle="modal" data-bs-target="#note-info" title="voir">
              <i class="fa fa-eye text-primary"></i>
            </button>
            <button class="btn btn-link p-0 btn-edit" data-id="${note.id}" data-bs-toggle="modal" data-bs-target="#modify-note" title="Modifier">
              <i class="fa fa-edit text-success"></i>
            </button>
            <button class="btn btn-link p-0 btn-delete" data-id="${note.id}" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal" title="Supprimer">
              <i class="fa fa-trash text-danger"></i>
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
      "language": {
        "url": "//cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json"
      }
    });
  })
  .catch(error => {
    console.error("Erreur GET :", error);
    showNotification("error", "Erreur lors du chargement des notes.", "Action échouée");
  });
}




function loadEtudiantSelectOptions() {
  axios.get(CONFIG.BASE_URL + CONFIG.ENDPOINTS.STUDENTS, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  })
  .then(response => {
    const etudiantSelect = document.getElementById("student");
    const etudiantModifSelect = document.getElementById("student-modif");

    // Vérifier que les éléments existent avant de les manipuler
    if (etudiantSelect && etudiantModifSelect) {
        // Nettoyer les options existantes sauf le premier
      etudiantSelect.innerHTML = '<option value="">Sélectionne un etudiant</option>';
      etudiantModifSelect.innerHTML = '<option value="">Sélectionne un etudiant</option>';

      // Remplir les deux select avec les niveaux
      response.data.forEach(etudiant => {
        const option = new Option(etudiant.last_name + " " + etudiant.first_name, etudiant.id);
        etudiantSelect.appendChild(option);

        const modifOption = new Option(etudiant.last_name + " " + etudiant.first_name, etudiant.id);
        etudiantModifSelect.appendChild(modifOption);
      });
    } else {
      console.error("Éléments select etudiant non trouvés:", { etudiantSelect, etudiantModifSelect });
    }
  })
  .catch(error => {
    console.error("Erreur lors du chargement des etudiants :", error);
  });
}
function loadDevoirSelectOptions() {
  axios.get(CONFIG.BASE_URL + CONFIG.ENDPOINTS.HOMEWORK, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  })
  .then(response => {
    const devoirSelect = document.getElementById("devoir");
    const devoirModifSelect = document.getElementById("devoir-modif");

    // Vérifier que les éléments existent avant de les manipuler
    if (devoirSelect && devoirModifSelect) {
      // Nettoyer les options existantes sauf le premier
      devoirSelect.innerHTML = '<option value="">Sélectionne un devoir</option>';
      devoirModifSelect.innerHTML = '<option value="">Sélectionne un devoir</option>';

      // Remplir les deux select avec les niveaux
      response.data.results.forEach(devoir => {
        const option = new Option(devoir.name, devoir.id);
        devoirSelect.appendChild(option);

        const modifOption = new Option(devoir.name, devoir.id);
        devoirModifSelect.appendChild(modifOption);
      });
    } else {
      console.error("Éléments select devoir non trouvés:", { devoirSelect, devoirModifSelect });
    }
  })
  .catch(error => {
    console.error("Erreur lors du chargement des devoirs :", error);
  });
}

function loadClasseSelectOptions() {
  axios.get(CONFIG.BASE_URL + CONFIG.ENDPOINTS.CLASSES, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  })
  .then(response => {
    const classesSelect = document.getElementById("classes"); // Correction de l'ID
    const classesModifSelect = document.getElementById("classes-modif"); // Correction de l'ID
    
    // Vérifier que les éléments existent avant de les manipuler
    if (classesSelect && classesModifSelect) {
      // Nettoyer les options existantes sauf le premier
      classesSelect.innerHTML = '<option value="">Sélectionne une classe</option>'; // Correction de l'ID
      classesModifSelect.innerHTML = '<option value="">Sélectionne une classe</option>'; // Correction de l'ID  

      response.data.results.forEach(classe => {
        const option = new Option(classe.name, classe.id);
        classesSelect.appendChild(option);

        const modifOption = new Option(classe.name, classe.id);
        classesModifSelect.appendChild(modifOption);
      });
    } else {
      console.error("Éléments select non trouvés:", { classesSelect, classesModifSelect }); // Correction de l'ID
    }
  })
  .catch(error => {
    console.error("Erreur lors du chargement des classes :", error); // Correction de l'ID
  });
}

// Attendre que le DOM soit chargé avant d'appeler les fonctions
document.addEventListener("DOMContentLoaded", function() {
  loadEtudiantSelectOptions();
  loadDevoirSelectOptions();
  loadClasseSelectOptions();
  loadTests();
});


document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-detail")) {
    const noteId = e.target.closest(".btn-detail").dataset.id;
    console.log("Note ID :", noteId);

    axios.get(CONFIG.BASE_URL + CONFIG.ENDPOINTS.RESULTS + `${noteId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
        })
        .then(response => {
                const note = response.data;
          document.getElementById("note-name").textContent = note.homework_name;
          document.getElementById("note-student").textContent = note.student_name;
          document.getElementById("note-observation").textContent = note.observation;
          document.getElementById("note-classes").textContent = note.classes_name;
          document.getElementById("note-devoir").textContent = note.result;
          document.getElementById("note-created-at").textContent = note.created_at_formatted;
        })
          .catch(error => {
          console.error("Erreur lors du chargement du note :", error);
          showNotification("error", "Erreur lors du chargement du note.", "Action échouée");
        });
    }
  }
);

document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-edit")) {
    const noteId = e.target.closest(".btn-edit").dataset.id;

    axios.get(CONFIG.BASE_URL + CONFIG.ENDPOINTS.RESULTS + `${noteId}/`, {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` }
    })
    .then(response => {
        const note = response.data;
      document.getElementById("student-modif").value = note.student;
      document.getElementById("devoir-modif").value = note.homework;
      document.getElementById("classes-modif").value = note.class_name;
      document.getElementById("note-modif").value = note.result;
      document.getElementById("observation-modif").value = note.observation;

      // Correction ici 👇
      document.getElementById("form-modify-note").dataset.id = noteId;
    })
    .catch(error => {
      console.error("Erreur lors du chargement du note :", error);
      showNotification("error", "Erreur lors du chargement du note.", "Action échouée");
    });
  }

  // --- Suppression (click sur icône corbeille) ---
  if (e.target.closest(".btn-delete")) {
    noteIdToDelete = e.target.closest(".btn-delete").dataset.id;
    console.log("Note à supprimer :", noteIdToDelete);
  }
});

// --- Confirmer la suppression ---
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    if (!noteIdToDelete) {
      showNotification("error", "ID de la note à supprimer non défini.", "Action échouée");
      return;
    }

    axios.delete(CONFIG.BASE_URL + CONFIG.ENDPOINTS.RESULTS + `${noteIdToDelete}/`, {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` }
    })
    .then(() => {
      showNotification("success", "Note supprimée avec succès !", "Action réussie");
      $("#deleteConfirmationModal").modal("hide");
      loadTests(); // recharge la liste
    })
    .catch(error => {
      console.error("Erreur lors de la suppression :", error);
      showNotification("error", "Erreur lors de la suppression.", "Action échouée");
    });
  });
});