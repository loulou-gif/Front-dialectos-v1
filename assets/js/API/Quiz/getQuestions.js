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
axios.get(CONFIG.BASE_URL + '/api/Questions/', {
    headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
    }
})
.then(response => {
    const tableBody = document.getElementById("classe-list");
    tableBody.innerHTML = "";
    response.data.results.forEach(question => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${question.name}</td>
        <td>${question.question}</td>
        <td>${question.response}</td>
        <td>${question.categories}</td>
        <td>${question.points}</td>
        <td>
        <div class="d-flex justify-content-around">
            <!-- Modifier (ouvre la modale de modification) -->
            <button class="btn btn-link p-0 btn-edit" data-id="${question.id}" data-bs-toggle="modal" data-bs-target="#modifyQuesModal" title="Modifier">
            <i class="fa fa-edit text-success"></i>
            </button>
            
            <!-- Supprimer (ouvre la modale de confirmation) -->
            <button class="btn btn-link p-0 btn-delete" data-id="${question.id}" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal" title="Supprimer">
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
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/French.json"
                },
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
});
}

loadClasses(); // Appel au chargement

document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-edit")) {
    const questionId = e.target.closest(".btn-edit").dataset.id;

    axios.get(CONFIG.BASE_URL + `/api/Questions/${questionId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    }).then(response => {
      const question = response.data;
      document.getElementById("modif-name").value = question.name;
      document.getElementById("modif-question").value = question.question;
      document.getElementById("modif-point").value = question.points;
      document.getElementById("modif-categories").value = question.categories;
      document.getElementById("modif-response").value = question.response;
      document.getElementById("form-modify-question").dataset.id = questionId; // Stocke l'id pour soumission
    }).catch(error => {
      console.error("Erreur lors du chargement de la classe :", error);
    });
  }
});

      function loadCategoriesSelectOptions() {
        axios.get(CONFIG.BASE_URL + '/api/categorie/', {  // Changé de categories à categorie
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        })
        .then(response => {
          const categorySelect = document.getElementById("categories");
          const categoryModifSelect = document.getElementById("modif-categories");

          if (categorySelect && categoryModifSelect) {
            // Nettoyer les options existantes
            categorySelect.innerHTML = '<option value="">Sélectionne une catégorie</option>';
            categoryModifSelect.innerHTML = '<option value="">Sélectionne une catégorie</option>';

            // Remplir les deux select avec les catégories
            response.data.results.forEach(category => {  // Ajouté .results
              const option = new Option(category.name, category.id);
              categorySelect.appendChild(option);

              const modifOption = new Option(category.name, category.id);
              categoryModifSelect.appendChild(modifOption);
            });
          }
        })
        .catch(error => {
          console.error("Erreur lors du chargement des catégories :", error);
        });
      }

      loadCategoriesSelectOptions();

      
      function loadResponsesSelectOptions() {
        axios.get(CONFIG.BASE_URL + '/api/Responses/', {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        })
        .then(response => {
          const responseSelect = document.getElementById("response");
          const responseModifSelect = document.getElementById("modif-response");
          
          if (responseSelect && responseModifSelect) {
            // Nettoyer les options existantes
            responseSelect.innerHTML = '<option value="">Sélectionne une réponse</option>';
            responseModifSelect.innerHTML = '<option value="">Sélectionne une réponse</option>';

            response.data.results.forEach(responseItem => {  // Changé le nom de variable
              const option = new Option(responseItem.name, responseItem.id);
              responseSelect.appendChild(option);

              const modifOption = new Option(responseItem.name, responseItem.id);
              responseModifSelect.appendChild(modifOption);
            });
          }
        })
        .catch(error => {
          console.error("Erreur lors du chargement des réponses :", error);
        });
      }
      loadResponsesSelectOptions()

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    let questionIdToDelete = null;

    document.addEventListener("click", function (e) {
      const deleteBtn = e.target.closest(".btn-delete");
      if (deleteBtn) {
        questionIdToDelete = deleteBtn.dataset.id;
        console.log("Question à supprimer :", questionIdToDelete);  // ← Vérifie que ça s'affiche
      }
    });

    document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
      if (!questionIdToDelete) {
        showNotification("warning", "ID de la question à supprimer non défini.", "Action échouée");
        return;
      }

      axios.delete(CONFIG.BASE_URL + `/api/Questions/${questionIdToDelete}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
        .then(response => {
          showNotification("success", "Question supprimée avec succès !", "Action réussie");
          $("#deleteConfirmationModal").modal("hide");
          loadQuestions(); // recharge la liste
        })
        .catch(error => {
          console.error("Erreur lors de la suppression :", error);
          showNotification("warning", "Erreur lors de la suppression.", "Action échouée");
        });
    });

    
  });
});
