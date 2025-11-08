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
  let from_email = null; // Déclarer ici

  const formCreate = document.getElementById("form-create-announcement");
  axios.get(CONFIG.BASE_URL + "/api/user/me/email", {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  })
  .then(response => {
    from_email = response.data.email; // Assigner ici
    console.log("Email de l'utilisateur :", from_email);
  });

  if (formCreate) {
    formCreate.addEventListener("submit", function (e) {
      e.preventDefault();

      const subject = document.getElementById("subject").value;
      const criticity = document.getElementById("criticity").value;
      const maillist = document.getElementById("maillist").value;
      const contain = document.getElementById("contain").value;
      
      if (!subject || !criticity || !maillist || !contain || !from_email) {
        showNotification("warning", "Tous les champs sont requis.", "Action échouée");
        return;
      }

      axios.post(CONFIG.BASE_URL + "/api/sendEmail/", {
        subject: subject,
        criticality: criticity,
        from_email: from_email,
        diffusion_list: maillist,
        message: contain
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        showNotification("success", "Annonce envoyée avec succès !", "Action réussie");
        document.getElementById("form-create-announcement").reset();
        $("#createAnnouncementModal").modal("hide");
        location.reload();
      })
      .catch(error => {
        if (error.response) {
          console.error("Erreur API :", error.response.data);
          showNotification("warning", "Erreur API : " + JSON.stringify(error.response.data), "Action échouée");
        } else {
          console.error("Erreur lors de l'envoi de l'annonce :", error);
          showNotification("warning", "Erreur lors de l'envoi de l'annonce.", "Action échouée");
        }
      });
    });
  }
});

