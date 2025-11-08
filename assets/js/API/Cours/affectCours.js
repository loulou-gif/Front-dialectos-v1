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
    const form = document.getElementById("form-affect-cours");
  
    if (!form) return; // sécurité si le formulaire n'existe pas
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const coursSelect = document.getElementById("cours-affect");
      const classeSelect = document.getElementById("classes");
  
      if (!coursSelect || !classeSelect) {
        showNotification("error", "Erreur : impossible de trouver les champs du formulaire.", "Action échouée");
        return;
      }
  
      const coursId = coursSelect.value.trim();
      const classeId = classeSelect.value.trim();
  
      if (!coursId || !classeId) {
        showNotification("error", "Veuillez sélectionner un cours et une classe.", "Action échouée");
        return;
      }
  
      axios.post(CONFIG.BASE_URL + "/api/courses-affectation/", {
        course: coursId,
        classroom: classeId
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        showNotification("success", "Affectation réussie !", "Action réussie");
        form.reset();
  
        // Fermer la modale Bootstrap si elle est ouverte
        const modalElement = document.getElementById("affectCoursModal");
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          } else {
            // au cas où aucune instance n'est trouvée (rare), on en crée une
            new bootstrap.Modal(modalElement).hide();
          }
        }
      })
      .catch(error => {
        console.error("Erreur API :", error);
  
        let message = "Une erreur est survenue.";
        if (error.response && error.response.data) {
          if (typeof error.response.data === "object") {
            message = "Erreur : " + JSON.stringify(error.response.data);
          } else {
            message = "Erreur : " + error.response.data;
          }
        }
        showNotification("error", message, "Action échouée");
      });
    });
  });
  