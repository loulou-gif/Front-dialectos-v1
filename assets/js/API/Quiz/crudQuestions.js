

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
  const formCreate = document.getElementById("form-create-question");
formCreate.addEventListener("submit", function (e) {
  e.preventDefault();

  const nom = document.getElementById("name").value;
  const point = document.getElementById("point").value;
  const question = document.getElementById("question").value;
  const categories = document.getElementById("categories").value;
  const response = document.getElementById("response").value;

  if (!nom || !question|| !point || !categories || !response) {
    showNotification("warning", "Tous les champs sont requis.", "Action échouée");
    return;
  }

  const formData = new FormData();
  formData.append("name", nom);
  formData.append("question", question);
  formData.append("points", point);
  formData.append("categories", categories);
  formData.append("response", response); // ← fichier réel ici

  axios.post(CONFIG.BASE_URL + "/api/Questions/", formData, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
      // Pas besoin de définir Content-Type → axios gère automatiquement
    }
  })
  .then(response => {
    showNotification("success", "Question créée avec succès !", "Action réussie");
    formCreate.reset();
    $("#createQuesModal").modal("hide");
    location.reload();
  })
  .catch(error => {
    console.error("Erreur lors de la création de la question :", error);
    showNotification("warning", "Erreur lors de la création de la question.", "Action échouée");
  });
});

});




document.addEventListener("DOMContentLoaded", function () {
  const formModify = document.getElementById("form-modify-question");

  if (formModify) {
    formModify.addEventListener("submit", function (e) {
      e.preventDefault();

      const nom = document.getElementById("modif-name").value;
      const question = document.getElementById("modif-question").value;
      const point = document.getElementById("modif-point").value;
      const categories = document.getElementById("modif-categories").value;
      const response = document.getElementById("modif-response").value;
      const questionId = formModify.getAttribute("data-id");
        console.log(questionId)
      if (!nom || !question || !point || !categories || !response) {
        showNotification("warning", "Tous les champs sont requis.", "Action échouée");
        return;
      }

      const formData = new FormData();
      formData.append("name", nom);
      formData.append("question", question);
      formData.append("points", point);
      formData.append("categories", categories);
      formData.append("response", response);


      axios.put(CONFIG.BASE_URL + `/api/Questions/${questionId}/`, formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
          // axios mettra automatiquement Content-Type: multipart/form-data
        }
      })
      .then(response => {
        showNotification("success", "Question modifiée avec succès !", "Action réussie");
        $("#modifyQuesModal").modal("hide");
        location.reload();
      })
      .catch(error => {
        console.error("Erreur lors de la modification de la question :", error);
        showNotification("warning", "Erreur lors de la modification de la question.", "Action échouée");
      });
    });
  }
});


let questionIdToDelete = null; // Variable globale

// 1. Quand l'utilisateur clique sur l'icône de poubelle
document.addEventListener("click", function (e) {
  const deleteBtn = e.target.closest(".btn-delete");
  if (deleteBtn) {
    questionIdToDelete = deleteBtn.dataset.id;
    console.log("Question à supprimer :", questionIdToDelete);
  }
});

// 2. Quand il confirme la suppression dans la modale
document.addEventListener("DOMContentLoaded", function () {
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
        questionIdToDelete = null; // reset pour éviter des suppressions imprévues
      })
      .catch(error => {
        console.error("Erreur lors de la suppression :", error);
        showNotification("warning", "Erreur lors de la suppression.", "Action échouée");
      });
  });
});
