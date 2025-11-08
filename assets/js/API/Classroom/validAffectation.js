document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-affect-user");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Bloquer soumission classique

    const studentSelect = document.getElementById("students");
    const classSelect = document.getElementById("classe");

    const studentId = studentSelect.value;
    const classId = classSelect.value;

    // 🔎 DEBUG
    console.log("Étudiant ID :", studentId);
    console.log("Classe ID :", classId);

    // Vérification de base
    if (!studentId || !classId) {
      showNotification("warning", "Veuillez sélectionner un étudiant et une classe.", "Action échouée");
      return;
    }
    
    axios.post(CONFIG.BASE_URL + "/api/affectationStudents/", {
      student: studentId,
      classroom: classId
    }, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      console.log("Réponse API :", response);
      if (response.status === 200) {
        showNotification("success", "Affectation réussie !", "Action réussie");
        form.reset();
    
        const modalElement = document.getElementById("affectAccountModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement); // ✅ plus sûr
        modal.hide();
        location.reload();
      } else {
        showNotification("warning", "Erreur : " + response.statusText, "Action échouée");
      }
    })
    .catch(error => {
      console.error("Erreur API :", error);
      if (error.response && error.response.data) {
        showNotification("warning", "Erreur : " + JSON.stringify(error.response.data), "Action échouée");
        location.reload();
      } else {
        showNotification("warning", "Erreur lors de l'affectation.", "Action échouée");
      }
    });    
  });
});

// const alertBox = document.createElement("div");
// alertBox.className = "alert alert-success";
// alertBox.textContent = "Affectation réussie !";
// document.querySelector(".modal-body").prepend(alertBox);
// setTimeout(() => alertBox.remove(), 3000);
