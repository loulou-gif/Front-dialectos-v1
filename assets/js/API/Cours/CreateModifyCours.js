// const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
// axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
// axios.defaults.withCredentials = true;
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

document.addEventListener("DOMContentLoaded", function () {
  const formCreate = document.getElementById("form-create-cours");
formCreate.addEventListener("submit", function (e) {
  e.preventDefault();

  const nom = document.getElementById("coursNom").value;
  const descriptions = document.getElementById("descriptionCours").value;
  const meeting_link = document.getElementById("meeting_link").value;
  const levelId = document.getElementById("level").value;
  const pdfInput = document.getElementById("coursPDF");
  const pdfFile = pdfInput.files[0]; // fichier réel

  if (!nom || !descriptions || !levelId || !pdfFile || !meeting_link) {
    showNotification("error", "Tous les champs sont requis.", "Action échouée");
    return;
  }

  const formData = new FormData();
  formData.append("name", nom);
  formData.append("descriptions", descriptions);
  formData.append("meeting_link", meeting_link);
  formData.append("level", levelId);
  formData.append("pdf", pdfFile); // ← fichier réel ici

  axios.post(CONFIG.BASE_URL + "/api/courses/", formData, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
      // Pas besoin de définir Content-Type → axios gère automatiquement
    }
  })
  .then(response => {
    showNotification("success", "Cours créé avec succès !", "Action réussie");
    formCreate.reset();
    $("#createClasseModal").modal("hide");
    location.reload();
  })
  .catch(error => {
    console.error("Erreur lors de la création du cours :", error);
    showNotification("error", "Erreur lors de la création du cours.", "Action échouée");
  });
});

});




document.addEventListener("DOMContentLoaded", function () {
  const formModify = document.getElementById("form-modify-cours");

  if (formModify) {
    formModify.addEventListener("submit", function (e) {
      e.preventDefault();

      const nom = document.getElementById("coursNomModify").value;
      const descriptions = document.getElementById("descriptionCoursModify").value;
      const meeting_link = document.getElementById("meeting_link-modif").value;
      const levelId = document.getElementById("modifyLevel").value;
      const pdfFile = document.getElementById("coursPDFModif").files[0];
      const courseId = formModify.getAttribute("data-id");
        console.log(courseId)
      if (!nom || !descriptions || !levelId || !courseId) {
        showNotification("error", "Tous les champs sont requis.", "Action échouée");
        return;
      }

      const formData = new FormData();
      formData.append("name", nom);
      formData.append("descriptions", descriptions);
      formData.append("meeting_link", meeting_link);
      formData.append("level", levelId);

      if (pdfFile) {
        formData.append("pdf", pdfFile); // facultatif mais utile si fichier modifié
      }

      axios.put(CONFIG.BASE_URL + `/api/courses/${courseId}/`, formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
          // axios mettra automatiquement Content-Type: multipart/form-data
        }
      })
      .then(response => {
        showNotification("success", "Cours modifié avec succès !", "Action réussie");
        $("#modifyCoursModal").modal("hide");
        location.reload();
      })
      .catch(error => {
        console.error("Erreur lors de la modification du cours :", error);
        showNotification("error", "Erreur lors de la modification du cours.", "Action échouée");
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

    axios.delete(CONFIG.BASE_URL + `/api/courses/${classIdToDelete}/`, {
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
