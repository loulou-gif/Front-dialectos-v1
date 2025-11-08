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
      timer: 2000,
    }
  );
}


document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const token = localStorage.getItem("token");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      axios.post(CONFIG.BASE_URL + "/api/dj_rest_auth/logout/", {}, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then(() => {
        // Supprimer le token du localStorage
        localStorage.removeItem("token");
        showNotification("success", "Déconnexion réussie !", "Déconnexion réussie");
        // Redirection vers la page de login
        location.href = "/pages/login.html"; // adapte si ton URL est différente
      })
      .catch(error => {
        console.error("Erreur lors de la déconnexion :", error);
        showNotification("danger", "Une erreur est survenue pendant la déconnexion.", "Echec de la déconnexion");
      });
    });
  }
});
