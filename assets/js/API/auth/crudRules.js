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
  const API_URL = CONFIG.BASE_URL + "/api/roles/";
  const token = localStorage.getItem("token");

  // === CRÉATION ===
  const formCreate = document.getElementById("form-create-role");
  if (formCreate) {
    formCreate.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = {
        name: document.getElementById("roleName").value  // ✅ champ correct ici
      };

      if (!data.name) {
        showNotification("warning", "Le nom est requis.", "Action échouée");
        return;
      }

      axios.post(API_URL, data, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        showNotification("success", "Rôle créé avec succès !", "Action réussie");
        formCreate.reset();
        $("#createRulesModal").modal("hide");  // ✅ nom de modal correct
        loadRules(); // ✅ recharge les rôles
      })
      .catch(error => {
        console.error("Erreur lors de la création :", error.response?.data || error);
        showNotification("warning", "Erreur lors de la création du rôle.", "Action échouée");
      });
    });
  }

  // === MODIFICATION ===
  const formModify = document.getElementById("form-modify-role");
  if (formModify) {
    formModify.addEventListener("submit", function (e) {
      e.preventDefault();
      const roleId = formModify.dataset.id;

      const data = {
        name: document.getElementById("roleNameModify").value  // ✅ ici aussi
      };

      if (!roleId || !data.name) {
        showNotification("warning", "Tous les champs sont requis.", "Action échouée");
        return;
      }

      axios.put(`${API_URL}${roleId}/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        showNotification("success", "Rôle modifié avec succès !", "Action réussie");
        $("#modifyRulesModal").modal("hide");
        loadRules();  // ✅ recharge
      })
      .catch(error => {
        console.error("Erreur lors de la modification :", error.response?.data || error);
        showNotification("warning", "Erreur lors de la modification du rôle.", "Action échouée");
      });
    });
  }

  // === SUPPRESSION ===
  let roleIdToDelete = null;
  document.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(".btn-delete");
    if (deleteBtn) {
      roleIdToDelete = deleteBtn.dataset.id;
    }

    const editBtn = e.target.closest(".btn-edit");
    if (editBtn) {
      const roleId = editBtn.dataset.id;
      axios.get(`${API_URL}${roleId}/`, {
        headers: { Authorization: `Token ${token}` }
      })
      .then(response => {
        const role = response.data;
        document.getElementById("roleNameModify").value = role.name;
        formModify.dataset.id = roleId;
      })
      .catch(error => {
        console.error("Erreur lors du chargement du rôle :", error);
      });
    }
  });

  const confirmBtn = document.getElementById("confirmDeleteBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      if (!roleIdToDelete) {
        showNotification("warning", "ID du rôle à supprimer non défini.", "Action échouée");
        return;
      }

      axios.delete(`${API_URL}${roleIdToDelete}/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then(() => {
        showNotification("success", "Rôle supprimé avec succès !", "Action réussie");
        $("#deleteConfirmationModal").modal("hide");
        loadRules();
        roleIdToDelete = null;
      })
      .catch(error => {
        console.error("Erreur lors de la suppression :", error);
        showNotification("warning", "Erreur lors de la suppression.", "Action échouée");
      });
    });
  }
});
