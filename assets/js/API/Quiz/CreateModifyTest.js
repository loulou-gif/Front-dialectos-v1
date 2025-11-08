// Gestion de l'affichage des champs conditionnels
function setupSchedulingToggle() {
  // Pour le formulaire de création
  const isScheduledCheckbox = document.getElementById("is-scheduled");
  const scheduledDateContainer = document.getElementById("scheduled-date-container");
  
  if (isScheduledCheckbox && scheduledDateContainer) {
    isScheduledCheckbox.addEventListener("change", function() {
      if (this.checked) {
        scheduledDateContainer.style.display = "block";
        // Définir la date minimale à maintenant
        const now = new Date();
        const minDateTime = now.toISOString().slice(0, 16);
        document.getElementById("scheduled-date").min = minDateTime;
      } else {
        scheduledDateContainer.style.display = "none";
        document.getElementById("scheduled-date").value = "";
      }
    });
  }

  // Pour le formulaire de modification
  const isScheduledCheckboxModif = document.getElementById("is-scheduled-modif");
  const scheduledDateContainerModif = document.getElementById("scheduled-date-container-modif");
  
  if (isScheduledCheckboxModif && scheduledDateContainerModif) {
    isScheduledCheckboxModif.addEventListener("change", function() {
      if (this.checked) {
        scheduledDateContainerModif.style.display = "block";
        // Définir la date minimale à maintenant
        const now = new Date();
        const minDateTime = now.toISOString().slice(0, 16);
        document.getElementById("scheduled-date-modif").min = minDateTime;
      } else {
        scheduledDateContainerModif.style.display = "none";
        document.getElementById("scheduled-date-modif").value = "";
      }
    });
  }
}

// Gestion de l'affichage des champs pour devoirs individuels
function setupIndividualToggle() {
  // Pour le formulaire de création
  const isIndividualCheckbox = document.getElementById("is-individual");
  const studentContainer = document.getElementById("student-container");
  
  if (isIndividualCheckbox && studentContainer) {
    isIndividualCheckbox.addEventListener("change", function() {
      if (this.checked) {
        studentContainer.style.display = "block";
        loadStudentsForIndividual();
      } else {
        studentContainer.style.display = "none";
        document.getElementById("student-select").value = "";
      }
    });
  }

  // Pour le formulaire de modification
  const isIndividualCheckboxModif = document.getElementById("is-individual-modif");
  const studentContainerModif = document.getElementById("student-container-modif");
  
  if (isIndividualCheckboxModif && studentContainerModif) {
    isIndividualCheckboxModif.addEventListener("change", function() {
      if (this.checked) {
        studentContainerModif.style.display = "block";
        loadStudentsForIndividualModif();
      } else {
        studentContainerModif.style.display = "none";
        document.getElementById("student-select-modif").value = "";
      }
    });
  }
}

// Charger les étudiants pour les devoirs individuels
function loadStudentsForIndividual() {
  axios.get(CONFIG.BASE_URL + '/api/students/', {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` }
  })
  .then(response => {
    const studentSelect = document.getElementById("student-select");
    studentSelect.innerHTML = '<option value="">Sélectionner un étudiant</option>';
    
    response.data.forEach(student => {
      const option = new Option(`${student.first_name} ${student.last_name}`, student.id);
      studentSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error("Erreur lors du chargement des étudiants :", error);
  });
}

// Charger les étudiants pour les devoirs individuels (modification)
function loadStudentsForIndividualModif() {
  axios.get(CONFIG.BASE_URL + '/api/students/', {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` }
  })
  .then(response => {
    const studentSelect = document.getElementById("student-select-modif");
    studentSelect.innerHTML = '<option value="">Sélectionner un étudiant</option>';
    
    response.data.forEach(student => {
      const option = new Option(`${student.first_name} ${student.last_name}`, student.id);
      studentSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error("Erreur lors du chargement des étudiants :", error);
  });
}

// Gestion de la création d'un test
document.addEventListener("DOMContentLoaded", function () {
  // Initialiser les toggles de planification et individuels
  setupSchedulingToggle();
  setupIndividualToggle();
  
  const formCreate = document.getElementById("form-create-devoir");
  if (formCreate) {
    formCreate.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("devoir-name").value;
      const url = document.getElementById("url").value;
      const descriptions = document.getElementById("descriptions").value;
      const cours = document.getElementById("cours-name").value;
      const classId = document.getElementById("classe-name").value;
      const levelId = document.getElementById("level-name").value;
      const isScheduled = document.getElementById("is-scheduled").checked;
      const scheduledDate = document.getElementById("scheduled-date").value;
      const isIndividual = document.getElementById("is-individual").checked;
      const studentId = document.getElementById("student-select").value;
      const endDate = document.getElementById("end-date").value;

      if (!name || !url || !descriptions || !cours || !classId || !levelId) {
        showNotification("warning", "Tous les champs sont requis.", "Action échouée");
        console.log(name, url, descriptions, cours, classId, levelId);
        return;
      }

      // Validation pour les devoirs individuels
      if (isIndividual && !studentId) {
        showNotification("warning", "Veuillez sélectionner un étudiant pour un devoir individuel.", "Action échouée");
        return;
      }

      // Validation de la date de planification
      if (isScheduled && !scheduledDate) {
        showNotification("warning", "Veuillez sélectionner une date d'envoi.", "Action échouée");
        return;
      }

      if (isScheduled && scheduledDate) {
        const scheduledDateTime = new Date(scheduledDate);
        const now = new Date();
        if (scheduledDateTime <= now) {
          showNotification("warning", "La date d'envoi doit être dans le futur.", "Action échouée");
          return;
        }
      }

      // Validation de la date limite
      if (endDate) {
        const endDateTime = new Date(endDate);
        const now = new Date();
        if (endDateTime <= now) {
          showNotification("warning", "La date limite doit être dans le futur.", "Action échouée");
          return;
        }
      }

      const homeworkData = {
        name: name,
        form_link: url,
        description: descriptions,
        course: cours,
        classes: classId,
        level: levelId,
        is_scheduled: isScheduled,
        is_sent: false,
        is_individual: isIndividual,
        student: isIndividual ? studentId : null,
        end_date: endDate || null
      };

      // Ajouter la date de planification si elle est définie
      if (isScheduled && scheduledDate) {
        homeworkData.scheduled_date = scheduledDate;
      }

      axios.post(CONFIG.BASE_URL + "/api/homework/", homeworkData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      }
      )
      .then(response => {
        showNotification("success", "Test créé avec succès !", "Action réussie");
        document.getElementById("form-create-devoir").reset();
        $("#create-devoir").modal("hide");
        loadTests(); // Recharger la liste
      })
      .catch(error => {
        console.error("Erreur lors de la création du test :", error);
        showNotification("warning", "Erreur lors de la création du test.", "Action échouée");
      });
    });
  }
});

// Gestion de la modification d'un test
document.addEventListener("DOMContentLoaded", function () {
  const formModify = document.getElementById("form-modif-devoir");

  if (formModify) {
    formModify.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("modif-devoir-name").value;
      const url = document.getElementById("url-modif").value;
      const descriptions = document.getElementById("descriptions-modif").value;
      const cours = document.getElementById("cours-modif").value;
      const classId = document.getElementById("classe-modif").value;
      const levelId = document.getElementById("level-modif").value;
      const isScheduled = document.getElementById("is-scheduled-modif").checked;
      const scheduledDate = document.getElementById("scheduled-date-modif").value;
      const isIndividual = document.getElementById("is-individual-modif").checked;
      const studentId = document.getElementById("student-select-modif").value;
      const endDate = document.getElementById("end-date-modif").value;
      const testId = formModify.getAttribute("data-id");

      if (!name || !url || !descriptions || !cours || !classId || !levelId || !testId) {
        showNotification("warning", "Tous les champs sont requis.", "Action échouée");
        return;
      }

      // Validation pour les devoirs individuels
      if (isIndividual && !studentId) {
        showNotification("warning", "Veuillez sélectionner un étudiant pour un devoir individuel.", "Action échouée");
        return;
      }

      // Validation de la date de planification
      if (isScheduled && !scheduledDate) {
        showNotification("warning", "Veuillez sélectionner une date d'envoi.", "Action échouée");
        return;
      }

      if (isScheduled && scheduledDate) {
        const scheduledDateTime = new Date(scheduledDate);
        const now = new Date();
        if (scheduledDateTime <= now) {
          showNotification("warning", "La date d'envoi doit être dans le futur.", "Action échouée");
          return;
        }
      }

      // Validation de la date limite
      if (endDate) {
        const endDateTime = new Date(endDate);
        const now = new Date();
        if (endDateTime <= now) {
          showNotification("warning", "La date limite doit être dans le futur.", "Action échouée");
          return;
        }
      }

      const homeworkData = {
        name: name,
        form_link: url,
        description: descriptions,
        course: cours,
        classes: classId,
        level: levelId,
        is_scheduled: isScheduled,
        is_sent: false,
        is_individual: isIndividual,
        student: isIndividual ? studentId : null,
        end_date: endDate || null
      };

      // Ajouter la date de planification si elle est définie
      if (isScheduled && scheduledDate) {
        homeworkData.scheduled_date = scheduledDate;
      }

      axios.put(CONFIG.BASE_URL + `/api/homework/${testId}/`, homeworkData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        showNotification("success", "Test modifié avec succès !", "Action réussie");
        $("#modif-devoir").modal("hide");
        loadTests(); // Recharger la liste
      })
      .catch(error => {
        console.error("Erreur lors de la modification du test :", error);
        showNotification("warning", "Erreur lors de la modification du test.", "Action échouée");
      });
    });
  }
}); 
