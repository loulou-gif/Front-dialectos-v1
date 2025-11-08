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

function loadCourses() {
const token = localStorage.getItem("token");
axios.get(CONFIG.BASE_URL + '/api/courses/', {
    headers: {
    Authorization: `Token ${token}`
    }
})
.then(response => {
    const tableBody = document.getElementById("cours-list");
    tableBody.innerHTML = "";
    response.data.results.forEach(cours => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${cours.name}</td>
        <td>${cours.level_name}</td>
        <td><a target="blank" href="${cours.meeting_link}"> <i class="fa fa-link"></i> &ensp;${cours.meeting_link}</a></td>
        <td><a target="blank" href="${cours.pdf}"> <i class="fa fa-file-pdf"></i> &ensp;${cours.name} PDF</a></td>
        <td>${cours.created_at}</td>
        <td>
        <div class="d-flex justify-content-around">
            <!-- Modifier (ouvre la modale de modification) -->
            <button class="btn btn-details p-0" data-bs-toggle="modal" data-id="${cours.id}" data-bs-target="#detail-cours" title="affecter">
            <i class="fa fa-eye text-primary"></i>
            </button>

            <button class="btn btn-link p-0 btn-edit" data-id="${cours.id}" data-bs-toggle="modal" data-bs-target="#modifyCoursModal" title="Modifier">
            <i class="fa fa-edit text-success"></i>
            </button>
            
            <!-- Supprimer (ouvre la modale de confirmation) -->
            <button class="btn btn-link p-0 btn-delete" data-id="${cours.id}" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal" title="Supprimer">
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
            "pageLength": 5,
            "responsive": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "lengthChange": true,
            "order": [[5, "desc"]]
        });
    }, 100);
})
.catch(error => {
    console.error("Erreur GET :", error);
});
}

loadCourses(); // Appel au chargement

document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-edit")) {
    const coursId = e.target.closest(".btn-edit").dataset.id;

    axios.get(CONFIG.BASE_URL + `/api/courses/${coursId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    }).then(response => {
      const cours = response.data;
      document.getElementById("coursNomModify").value = cours.name;
      document.getElementById("descriptionCoursModify").value = cours.descriptions;
      document.getElementById("meeting_link-modif").value = cours.meeting_link;
      document.getElementById("modifyLevel").value = cours.level;
      document.getElementById("form-modify-cours").setAttribute("data-id", coursId); // Stocke l'id pour soumission
    }).catch(error => {
      console.error("Erreur lors du chargement du cours :", error);
    });
  }
});

      function loadLevelsSelectOptions() {
        axios.get(CONFIG.BASE_URL+'/api/levels/', {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        })
        .then(response => {
          const levelSelect = document.getElementById("level");
          const levelModifSelect = document.getElementById("modifyLevel");

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
        });
      }

      loadLevelsSelectOptions();


document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-details")) {
    const coursId = e.target.closest(".btn-details").dataset.id;
    console.log("Cours ID :", coursId);

    axios.get(CONFIG.BASE_URL + `/api/courses/${coursId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
        })
        .then(response => {
          const cours = response.data;
          document.getElementById("name-cours").textContent = cours.name;
          document.getElementById("teacher-cours").textContent = cours.descriptions;
          document.getElementById("level-cours").textContent = cours.level_name;
          document.getElementById("created-at").textContent = cours.created_at;
          document.getElementById("meeting_link-cours").innerHTML = `<a class="text-white" href="${cours.meeting_link}" target="_blank"><i class="fa fa-link "></i> Lien du meet</a>`;
          document.getElementById("pdf-cours").innerHTML = `<a class=" text-white" href="${cours.pdf}" target="_blank"><i class="fa fa-download"></i> Télécharger</a>`;
          document.getElementById("classList").innerHTML = "";
          cours.classes.forEach(classe => {
            document.getElementById("classList").innerHTML += `<p>${classe.name}</p>`;
          });
        })
        .catch(error => {
          console.error("Erreur lors du chargement du cours :", error);
        });
    }
  }
)

document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-delete")) {
    const coursId = e.target.closest(".btn-delete").dataset.id;
    console.log("Cours ID :", coursId);
    axios.delete(CONFIG.BASE_URL + `/api/courses/${coursId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      console.log("Cours supprimé avec succès :", response.data);
    })
    .catch(error => {
      console.error("Erreur lors de la suppression :", error);
      showNotification("warning", "Erreur lors de la suppression.", "Action échouée");
    });
  }
});
// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
//     let coursIdToDelete = null;

//     document.addEventListener("click", function (e) {
//       const deleteBtn = e.target.closest(".btn-delete");
//       if (deleteBtn) {
//         coursIdToDelete = deleteBtn.dataset.id;
//         console.log("Classe à supprimer :", coursIdToDelete);  // ← Vérifie que ça s'affiche
//       }
//     });

//     document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
//       if (!coursIdToDelete) {
//         alert("ID de la classe à supprimer non défini.");
//         return;
//       }

//       axios.delete(CONFIG.BASE_URL + `/api/courses/${coursIdToDelete}/`)
//         .then(response => {
//           alert("Classe supprimée avec succès !");
//           $("#deleteConfirmationModal").modal("hide");
//           loadClasses(); // recharge la liste
//         })
//         .catch(error => {
//           console.error("Erreur lors de la suppression :", error);
//           alert("Erreur lors de la suppression.");
//         });
//     });

    
//   });
// });


