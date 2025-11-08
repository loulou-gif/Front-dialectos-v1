document.addEventListener("DOMContentLoaded", function () {
  const API_URL = CONFIG.BASE_URL + "/api/level/";
  const token = localStorage.getItem("token");

  // === CRÉATION ===
  const formCreate = document.getElementById("form-create-niveau");
  if (formCreate) {
    formCreate.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("niveauName").value.trim();

      if (!name) {
        showNotification("error", "Le nom du niveau est requis.");
        return;
      }

      axios.post(API_URL, { name }, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        showNotification("success", "Niveau créé avec succès !");
        formCreate.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("createLevelModal"));
        modal.hide();
        loadLevel(); // Appelle ta fonction dans un autre fichier
        location.reload();
      })
      .catch(error => {
        console.error("Erreur création :", error.response?.data || error);
        showNotification("error", "Erreur lors de la création du niveau.");
      });
    });
  }

  // === MODIFICATION ===
  const formModify = document.getElementById("form-modify-niveau");
  if (formModify) {
    formModify.addEventListener("submit", function (e) {
      e.preventDefault();
      const niveauId = formModify.dataset.id;
      const name = document.getElementById("niveauNameModify").value.trim();

      if (!niveauId || !name) {
        showNotification("error", "Tous les champs sont requis.");
        return;
      }

      axios.put(`${API_URL}${niveauId}/`, { name }, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        showNotification("success", "Niveau modifié avec succès !");
        const modal = bootstrap.Modal.getInstance(document.getElementById("modifyLevelModal"));
        modal.hide();
        loadLevel();
        location.reload();
      })
      .catch(error => {
        console.error("Erreur modification :", error.response?.data || error);
        showNotification("error", "Erreur lors de la modification du niveau.");
      });
    });
  }

  // === SUPPRESSION ===
  let niveauIdToDelete = null;

  document.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(".btn-delete");
    if (deleteBtn) {
      niveauIdToDelete = deleteBtn.dataset.id;
    }

    const editBtn = e.target.closest(".btn-edit");
    if (editBtn) {
      const niveauId = editBtn.dataset.id;
      axios.get(`${API_URL}${niveauId}/`, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(response => {
        const niveau = response.data;
        document.getElementById("niveauNameModify").value = niveau.name;
        formModify.dataset.id = niveauId;
        const modal = new bootstrap.Modal(document.getElementById("modifyLevelModal"));
        showNotification("success", "Niveau chargé avec succès !");
        modal.show();
      })
      .catch(error => {
        console.error("Erreur chargement niveau :", error);
        showNotification("error", "Erreur lors du chargement du niveau.");
      });
    }
  });

  const confirmBtn = document.getElementById("confirmDeleteBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      if (!niveauIdToDelete) {
        showNotification("error", "ID du niveau à supprimer manquant.");
        return;
      }

      axios.delete(`${API_URL}${niveauIdToDelete}/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then(() => {
        showNotification("success", "Niveau supprimé avec succès !");
        $("#deleteConfirmationModal").modal("hide");
        loadLevel();
        userIdToDelete = null;
        location.reload();
      })
      .catch(error => {
        console.error("Erreur suppression :", error);
        showNotification("error", "Erreur lors de la suppression.");
      });
    });
  }
});
