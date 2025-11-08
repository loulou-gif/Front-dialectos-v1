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
}// Gestion de la création d'un test


document.addEventListener("DOMContentLoaded", function () {
  const formCreate = document.getElementById("form-create-note");
  if (formCreate) {
    formCreate.addEventListener("submit", function (e) {
      e.preventDefault();

      const devoirId = document.getElementById("devoir").value;
      const observation = document.getElementById("observation").value;
      const result = document.getElementById("note").value;
      const classId = document.getElementById("classes").value;
      const studentId = document.getElementById("student").value;

      if (!devoirId || !observation || !result || !classId || !studentId) {
        showNotification("warning", "Tous les champs sont requis.", "Action échouée");
        console.log(devoirId, observation, result, classId, studentId);
        return;
      }

      axios.post(CONFIG.BASE_URL + "/api/result-homework/", {
        student: studentId,
        homework: devoirId,
        observation: observation,
        class_name: classId,
        result: result,
        created_at: new Date().toISOString(),
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => {
        showNotification("success", "Test créé avec succès !", "Action réussie");
        document.getElementById("form-create-note").reset();
        $("#create-note").modal("hide");
        loadTests(); // Recharger la liste
        location.reload();
      })
      .catch(error => {
        console.error("Erreur lors de la création du test :", error);
        showNotification("error", "Erreur lors de la création du test.", "Action échouée");
      });
    });
  }
});

// Gestion de la modification d'un test
document.addEventListener("DOMContentLoaded", function () {
  const formModify = document.getElementById("form-modify-note");

  if (formModify) {
    formModify.addEventListener("submit", function (e) {
      e.preventDefault();

      const devoirId = document.getElementById("devoir-modif").value;
      const observation = document.getElementById("observation-modif").value;
      const result = document.getElementById("note-modif").value;
      const classId = document.getElementById("classes-modif").value;
      const studentId = document.getElementById("student-modif").value;
      const noteId = formModify.getAttribute("data-id");

      if (!devoirId || !observation || !result || !classId || !studentId || !noteId) {
        showNotification("error", "Tous les champs sont requis.", "Action échouée");
        return;
      }

      axios.put(CONFIG.BASE_URL + `/api/result-homework/${noteId}/`, {
        student: studentId,
        homework: devoirId,
        observation: observation,
        class_name: classId,
        result: result,
        created_at: new Date().toISOString(),

      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        showNotification("success", "Test modifié avec succès !", "Action réussie");
        $("#modify-note").modal("hide");
        loadTests(); // Recharger la liste
        location.reload();
      })
      .catch(error => {
        console.error("Erreur lors de la modification du test :", error);
        showNotification("error", "Erreur lors de la modification du test.", "Action échouée");   
      });
    });
  }
}); 
