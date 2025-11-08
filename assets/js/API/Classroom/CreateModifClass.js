// const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
// axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
// axios.defaults.withCredentials = true;

document.addEventListener("DOMContentLoaded", function () {
  const formCreate = document.getElementById("form-create-classe");
  if (formCreate) {
    formCreate.addEventListener("submit", function (e) {
      e.preventDefault();

      const nom = document.getElementById("classeNom").value;
      const teacherId = document.getElementById("teacher").value;
      const levelId = document.getElementById("level-classe").value;

      if (!nom || !teacherId || !levelId) {
        showNotification("error", "Tous les champs sont requis.", "Action échouée");
        return;
      }

      axios.post(CONFIG.BASE_URL + "/api/classes/", {
        name: nom,
        teacher: teacherId,
        level: levelId
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        showNotification("success", "Classe créée avec succès !", "Action réussie");
        document.getElementById("form-create-classe").reset();
        $("#createClasseModal").modal("hide");
        location.reload();
      })
      .catch(error => {
        console.error("Erreur lors de la création de la classe :", error);
        showNotification("error", "Erreur lors de la création de la classe.", "Action échouée");
      });
    });
  }
});




document.addEventListener("DOMContentLoaded", function () {
  const formModify = document.getElementById("form-modify-classe");

  if (formModify) {
    formModify.addEventListener("submit", function (e) {
      e.preventDefault();

      const nom = document.getElementById("classeNomModif").value;
      const teacherId = document.getElementById("teacherModif").value;
      const levelId = document.getElementById("levelModif").value;
      const classId = formModify.getAttribute("data-id"); // stocké dynamiquement quand on ouvre le modal
      console.log(classId)
      if (!nom || !teacherId || !levelId || !classId) {
        showNotification("error", "Tous les champs sont requis.", "Action échouée");
        return;
      }

      axios.put(CONFIG.BASE_URL + `/api/classes/${classId}/`, {
        name: nom,
        teacher: teacherId,
        level: levelId
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        showNotification("success", "Classe modifiée avec succès !", "Action réussie");
        $("#modifyClasseModal").modal("hide");
        location.reload();
      })
      .catch(error => {
        console.error("Erreur lors de la modification de la classe :", error);
        showNotification("error", "Erreur lors de la modification de la classe.", "Action échouée");
      });
    });
  }
});

let classIdToDelete = null; // Variable globale

// 1. Quand l'utilisateur clique sur l'icône de poubelle
document.addEventListener("click", function (e) {
  const deleteBtn = e.target.closest(".btn-delete");
  if (deleteBtn) {
    classIdToDelete = deleteBtn.dataset.id;
    console.log("Classe à supprimer :", classIdToDelete);
  }
});

// 2. Quand il confirme la suppression dans la modale
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    if (!classIdToDelete) {
      showNotification("error", "ID de la classe à supprimer non défini.", "Action échouée");
      return;
    }

    axios.delete(CONFIG.BASE_URL + `/api/classes/${classIdToDelete}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    })
      .then(response => {
        showNotification("success", "Classe supprimée avec succès !", "Action réussie");
        $("#deleteConfirmationModal").modal("hide");
        loadClasses(); // recharge la liste
        classIdToDelete = null; // reset pour éviter des suppressions imprévues
      })
      .catch(error => {
        console.error("Erreur lors de la suppression :", error);
        showNotification("error", "Erreur lors de la suppression.", "Action échouée");
      });
  });
});
