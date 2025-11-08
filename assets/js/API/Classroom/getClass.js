let detailModalInstance = null;

function loadClasses() {
axios.get(CONFIG.BASE_URL + '/api/classes/', {
    headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
    }
})
.then(response => {
    const tableBody = document.getElementById("classe-list");
    tableBody.innerHTML = "";
    response.data.results.forEach(classe => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${classe.name}</td>
        <td>${classe.student_count}</td>
        <td>${classe.level_name}</td>
        <td>${classe.created_at}</td>
        <td>${classe.teacher_name}</td>
        <td>
        <div class="d-flex justify-content-around">
            <!-- details -->
            <button class="btn btn-link p-0 btn-detail" data-id="${classe.id}"  data-bs-target="#detail-class" title="detail">
              <i class="fa fa-eye text-primary"></i>
            </button>

            <!-- Modifier (ouvre la modale de modification) -->
            <button class="btn btn-link p-0 btn-edit" data-id="${classe.id}" data-bs-toggle="modal" data-bs-target="#modifyClasseModal" title="Modifier">
            <i class="fa fa-edit text-success"></i>
            </button>
            
            <!-- Supprimer (ouvre la modale de confirmation) -->
            <button class="btn btn-link p-0 btn-delete" data-id="${classe.id}" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal" title="Supprimer">
            <i class="fa fa-trash text-danger"></i>
            </button>
        </div>
    </td>
    `;
    tableBody.appendChild(row);
    });
    
    // Initialiser la DataTable après le chargement des données
    setTimeout(() => {
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
    }, 100);
})
.catch(error => {
    console.error("Erreur GET :", error);
    showNotification("error", "Erreur lors du chargement des classes.", "Action échouée");
});
}

loadClasses(); // Appel au chargement

document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-edit")) {
    const classId = e.target.closest(".btn-edit").dataset.id;

    axios.get(CONFIG.BASE_URL + `/api/classes/${classId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    }).then(response => {
      const classe = response.data;
      document.getElementById("classeNomModif").value = classe.name;
      document.getElementById("teacherModif").value = classe.teacher;
      document.getElementById("levelModif").value = classe.level;
      document.getElementById("form-modify-classe").dataset.id = classId; // Stocke l'id pour soumission
    }).catch(error => {
      console.error("Erreur lors du chargement de la classe :", error);
      showNotification("error", "Erreur lors du chargement de la classe.", "Action échouée");
    });
  }
});


document.addEventListener("click", function (e){
  if(e.target.closest(".btn-detail")){
    const classId = e.target.closest(".btn-detail").dataset.id;

    axios.get(CONFIG.BASE_URL + `/api/classes/${classId}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    }).then(response => {
        const classe = response.data;

        // Remplissage des champs
        document.getElementById("name-classe").textContent = classe.name;
        document.getElementById("teacher-name").textContent = classe.teacher_name;
        document.getElementById("level-name").textContent = classe.level_name;
        document.getElementById("created-at").textContent = classe.created_at;
        document.getElementById("total-student").textContent = classe.student_count;

        // Nettoyer et injecter la liste des étudiants
        const studentList = document.getElementById("studentList");
        studentList.innerHTML = "";
        classe.students_detail.forEach(student => {
          const li = document.createElement("li");
          li.className = "list-group-item";
          li.textContent = `${student.student_full_name}`;
          studentList.appendChild(li);
        });

        // Ouvrir le modal
        if (!detailModalInstance) {
          detailModalInstance = new bootstrap.Modal(document.getElementById("detail-class"));
        }
        detailModalInstance.show();

    }).catch(error => {
      console.error("Erreur lors du chargement des infos de la classe :", error);
      showNotification("error", "Erreur lors du chargement des infos de la classe.", "Action échouée");
    });
  }
});


      function loadLevelsSelectOptions() {
        axios.get(CONFIG.BASE_URL + '/api/levels/', {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        })
        .then(response => {
          const levelSelect = document.getElementById("level-classe");
          const levelModifSelect = document.getElementById("levelModif");

          // Nettoyer les options existantes sauf le premier
          levelSelect.innerHTML = '<option value="">Sélectionne un niveau</option>';
          levelModifSelect.innerHTML = '<option value="">Sélectionne un niveau</option>';

          // Remplir les deux select avec les niveaux
          response.data.forEach(level => {
            const option = new Option(level.name, level.id);
            levelSelect.appendChild(option);

            const modifOption = new Option(level.name, level.id);
            levelModifSelect.appendChild(modifOption);
          });
        })
        .catch(error => {
          console.error("Erreur lors du chargement des niveaux :", error);
          showNotification("error", "Erreur lors du chargement des niveaux.", "Action échouée");
        });
      }

      loadLevelsSelectOptions();

      
      function loadTeachersSelectOptions() {
        axios.get(CONFIG.BASE_URL + '/api/teachers/', {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        })
        .then(response => {
          const teacherSelect = document.getElementById("teacher");
          const teacherModifSelect = document.getElementById("teacherModif");
          // Nettoyer les options existantes sauf le premier
          teacherSelect.innerHTML = '<option value="">Sélectionne un niveau</option>';
          teacherModifSelect.innerHTML = '<option value="">Sélectionne un niveau</option>';

          response.data.forEach(user => {
            const option = new Option(user.username, user.id);
            teacherSelect.appendChild(option);

            const modifOption = new Option(user.username, user.id);
            teacherModifSelect.appendChild(modifOption);
          });
        })
        .catch(error => {
          console.error("Erreur lors du chargement des professeurs :", error);
          showNotification("error", "Erreur lors du chargement des professeurs.", "Action échouée");
        });
      }
      loadTeachersSelectOptions()

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    let classIdToDelete = null;

    document.addEventListener("click", function (e) {
      const deleteBtn = e.target.closest(".btn-delete");
      if (deleteBtn) {
        classIdToDelete = deleteBtn.dataset.id;
        console.log("Classe à supprimer :", classIdToDelete);  // ← Vérifie que ça s'affiche
      }
    });

    document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
      if (!classIdToDelete) {
        showNotification("error", "ID de la classe à supprimer non défini.", "Action échouée");
        return;
      }

      axios.delete(CONFIG.BASE_URL + `/api/classes/${classIdToDelete}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      }).then(() => {
        showNotification("success", "Classe supprimée avec succès !", "Action réussie");
        const modalEl = document.getElementById("deleteConfirmationModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
    
        loadClasses(); // recharge la liste
      }).catch(error => {
        console.error("Erreur lors de la suppression :", error);
        showNotification("error", "Erreur lors de la suppression.", "Action échouée");
      });
    });

    
  });
});
