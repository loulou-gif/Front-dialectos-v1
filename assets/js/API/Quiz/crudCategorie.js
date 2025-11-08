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
  const formCreate = document.getElementById("form-create-categorie");
formCreate.addEventListener("submit", function (e) {
  e.preventDefault();

  const nom = document.getElementById("name").value;
  const descriptions = document.getElementById("description").value;

  if (!nom || !descriptions) {
    showNotification("warning", "Tous les champs sont requis.", "Action échouée");
    return;
  }

  const formData = new FormData();
  formData.append("name", nom);
  formData.append("descriptions", descriptions);

  axios.post(CONFIG.BASE_URL + "/api/categorie/", formData, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
      // Pas besoin de définir Content-Type → axios gère automatiquement
    }
  })
  .then(response => {
    showNotification("success", "catégorie créée avec succès !", "Action réussie");
    formCreate.reset();
    $("#createCatModal").modal("hide");
    location.reload();
  })
  .catch(error => {
    console.error("Erreur lors de la création de la catégorie :", error);
    showNotification("warning", "Erreur lors de la création de la catégorie.", "Action échouée");
  });
});

});




document.addEventListener("DOMContentLoaded", function () {
  const formModify = document.getElementById("form-modify-categorie");

  if (formModify) {
    formModify.addEventListener("submit", function (e) {
      e.preventDefault();

      const categorieId = formModify.dataset.id;
      console.log("Catégorie à modifier :", categorieId);
      const nom = document.getElementById("modif-name").value;
      const descriptions = document.getElementById("modif-description").value;
      if (!nom || !descriptions) {
        showNotification("warning", "Tous les champs sont requis.", "Action échouée");
        return;
      }

      const formData = new FormData();
      formData.append("name", nom);
      formData.append("descriptions", descriptions);

      axios.put(CONFIG.BASE_URL + `/api/categorie/${categorieId}/`, formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
          // axios mettra automatiquement Content-Type: multipart/form-data
        }
      })
      .then(response => {
        showNotification("success", "catégorie modifiée avec succès !", "Action réussie");
        $("#modifyCatModal").modal("hide");
        location.reload();
      })
      .catch(error => {
        console.error("Erreur lors de la modification de la catégorie :", error);
        showNotification("warning", "Erreur lors de la modification de la catégorie.", "Action échouée");
      });
    });
  }
});


let categorieId = null; // Variable globale

// Capturer l'ID quand on clique sur le bouton de suppression
document.addEventListener("click", function (e) {
  const deleteBtn = e.target.closest(".btn-delete");
  if (deleteBtn) {
    categorieId = deleteBtn.dataset.id;
    console.log("Catégorie à supprimer :", categorieId);
  }
});

// Gérer la confirmation de suppression
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    if (!categorieId) {
      showNotification("warning", "ID de la catégorie à supprimer non défini.", "Action échouée");
      return;
    }

    axios.delete(CONFIG.BASE_URL + `/api/categorie/${categorieId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      showNotification("success", "Catégorie supprimée avec succès !", "Action réussie");
      $("#deleteConfirmationModal").modal("hide");
      loadClasses(); // recharge la liste
      categorieId = null; // reset
    })
    .catch(error => {
      console.error("Erreur lors de la suppression :", error);
      showNotification("warning", "Erreur lors de la suppression.", "Action échouée");
    });
  });
});
