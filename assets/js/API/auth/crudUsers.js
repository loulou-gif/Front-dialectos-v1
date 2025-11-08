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
  const API_URL = CONFIG.BASE_URL + "/api/users/";
  const token = localStorage.getItem("token");

  // =========================
  // CRÉATION UTILISATEUR
  // =========================
  const formCreate = document.getElementById("form-create-user");
  if (formCreate) {
    formCreate.addEventListener("submit", function (e) {
      e.preventDefault();

      const data = {
        username: document.getElementById("username").value,
        first_name: document.getElementById("name").value,
        last_name: document.getElementById("last_name").value,
        role: document.getElementById("role").value, // rôle inclus
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      };

      if (Object.values(data).some(field => !field)) {
        showNotification("error", "Tous les champs sont requis, y compris le rôle.", "Action échouée");
        return;
      }

      axios.post(API_URL, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        showNotification("success", "Utilisateur créé avec succès !", "Action réussie");
        formCreate.reset();
        $("#createCoursesModal").modal("hide");
        loadUser();
        location.reload();
      })
      .catch(error => {
        console.error("Erreur lors de la création :", error);
        showNotification("error", "Erreur lors de la création de l’utilisateur.", "Action échouée");
      });
    });
  }

  // =========================
  // MODIFICATION UTILISATEUR
  // =========================
  const formModify = document.getElementById("form-modify-user");
  if (formModify) {
    formModify.addEventListener("submit", function (e) {
      e.preventDefault();
      const userId = formModify.dataset.id;

      const data = {
        username: document.getElementById("usernameModify").value,
        first_name: document.getElementById("nameModify").value,
        last_name: document.getElementById("last_nameModify").value,
        role: document.getElementById("roleModify").value, // rôle inclus
        email: document.getElementById("emailModify").value,
        password: document.getElementById("passwordModify").value,
      };

      if (!userId || Object.values(data).some(field => !field)) {
        showNotification("error", "Tous les champs sont requis, y compris le rôle.", "Action échouée");
        return;
      }

      axios.put(`${API_URL}${userId}/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        showNotification("success", "Utilisateur modifié avec succès !", "Action réussie");
        $("#modifyAccountModal").modal("hide");
        loadUser();
        location.reload();
      })
      .catch(error => {
        console.error("Erreur lors de la modification :", error);
        showNotification("error", "Erreur lors de la modification de l’utilisateur.", "Action échouée");
      });
    });
  }

  // =========================
  // GESTION SUPPRESSION
  // =========================
  let userIdToDelete = null;
  document.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(".btn-delete");
    if (deleteBtn) userIdToDelete = deleteBtn.dataset.id;

    const editBtn = e.target.closest(".btn-edit");
    if (editBtn) {
      const userId = editBtn.dataset.id;
      axios.get(`${API_URL}${userId}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(response => {
        const user = response.data;
        document.getElementById("usernameModify").value = user.username;
        document.getElementById("nameModify").value = user.first_name;
        document.getElementById("last_nameModify").value = user.last_name;
        document.getElementById("emailModify").value = user.email;
        document.getElementById("passwordModify").value = ""; // sécurité
        document.getElementById("roleModify").value = user.role; // remplir rôle
        formModify.dataset.id = userId;
      })
      .catch(error => console.error("Erreur chargement utilisateur :", error));
    }
  });

  const confirmBtn = document.getElementById("confirmDeleteBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      if (!userIdToDelete) return showNotification("error", "ID utilisateur manquant.", "Action échouée");
      axios.delete(`${API_URL}${userIdToDelete}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => {
        showNotification("success", "Utilisateur supprimé !", "Action réussie");
        $("#deleteConfirmationModal").modal("hide");
        loadUser();
        userIdToDelete = null;
        location.reload();
      })
      .catch(error => {
        console.error("Erreur suppression :", error);
        showNotification("error", "Erreur lors de la suppression.", "Action échouée");
      });
    });
  }
});
