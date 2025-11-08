const authHeaders = {
  Authorization: `Token ${localStorage.getItem("token")}`
};

// Ajoute une option vide par défaut
function setDefaultOption(selectEl, label = "Sélectionner...") {
  selectEl.innerHTML = '';
  const defaultOption = new Option(label, '');
  selectEl.appendChild(defaultOption);
}

  // Charger les étudiants ayant le rôle student
  function loadStudentsSelectOptions() {
    axios.get(CONFIG.BASE_URL + '/api/students/', { headers: authHeaders })
    .then(response => {
      const studentsSelect = document.getElementById("students");
      setDefaultOption(studentsSelect, 'Sélectionne un étudiant');

      response.data.forEach(user => {
        const option = new Option(`${user.first_name} ${user.last_name}`, user.id);
        studentsSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Erreur chargement des étudiants :", error);
      showNotification("error", "Erreur lors du chargement des étudiants.", "Action échouée");
    });
  }

  // Charger les niveaux
  function loadLevelsSelectOptions() {
    axios.get(CONFIG.BASE_URL + '/api/levels/', { headers: authHeaders })
      .then(response => {
        const levelSelect = document.getElementById("level");
        setDefaultOption(levelSelect, 'Sélectionne un niveau');

        response.data.forEach(level => {
          const option = new Option(level.name, level.id);
          levelSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Erreur lors du chargement des niveaux :", error);
        showNotification("error", "Erreur lors du chargement des niveaux.", "Action échouée");
      });
  }

  // Charger les classes en fonction du niveau sélectionné
    function setupLevelChangeListener() {
    const classeSelect = document.getElementById("classe");
    const levelSelect = document.getElementById("level");

    levelSelect.addEventListener("change", function () {
        const levelId = this.value; // récupère l'ID sélectionné
        setDefaultOption(classeSelect, 'Sélectionne une classe');

        if (!levelId) return;


        axios.get(CONFIG.BASE_URL + `/api/classes/?level=${levelId}`, {
        headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
        }
        })
        .then(response => {
            const classes = response.data.results;
            classes.forEach(classe => {
            const option = new Option(classe.name, classe.id);
            classeSelect.appendChild(option);
        });
        })
        .catch(error => {
        console.error("Erreur lors du chargement des classes :", error);
        showNotification("error", "Erreur lors du chargement des classes.", "Action échouée");
        });
    });
    }

// Charger les étudiants pour le formulaire de modification
function loadStudentsSelectOptionsModif() {
  axios.get(CONFIG.BASE_URL + '/api/students/', { headers: authHeaders })
    .then(response => {
      const studentsSelect = document.getElementById("studentsModify");
      if (studentsSelect) {
        setDefaultOption(studentsSelect, 'Sélectionne un étudiant');

        response.data.forEach(user => {
          const option = new Option(`${user.first_name} ${user.last_name}`, user.id);
          studentsSelect.appendChild(option);
        });
      }
    })
    .catch(error => {
      console.error("Erreur chargement des étudiants (modification) :", error);
      showNotification("error", "Erreur lors du chargement des étudiants (modification).", "Action échouée");
    });
}

// Charger les classes en fonction du niveau sélectionné pour modification
function setupLevelChangeListenerModif() {
  const classeSelect = document.getElementById("classe");
  const levelSelect = document.getElementById("levelModify");

  levelSelect.addEventListener("change", function () {
    const levelId = this.value;
    setDefaultOption(classeSelect, 'Sélectionne une classe');

    if (!levelId) return;

    axios.get(CONFIG.BASE_URL + `/api/classes/?level=${levelId}`, { headers: authHeaders })
      .then(response => {
        const classes = response.data.results;
        classes.forEach(classe => {
          const option = new Option(classe.name, classe.id);
          classeSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Erreur chargement classes (modification) :", error);
        showNotification("error", "Erreur lors du chargement des classes (modification).", "Action échouée");
      });
  });
}

// Pré-remplir les valeurs dans le formulaire de modification
function populateModifyForm(data) {
  if (data.level_id) {
    document.getElementById("levelModify").value = data.level_id;
    // Charger les classes pour ce niveau
    axios.get(CONFIG.BASE_URL + `/api/classes/?level=${data.level_id}`, { headers: authHeaders })
      .then(response => {
        const classeSelect = document.getElementById("classeModify");
        setDefaultOption(classeSelect, 'Sélectionne une classe');
        const classes = response.data.results;
        classes.forEach(classe => {
          const option = new Option(classe.name, classe.id);
          classeSelect.appendChild(option);
        });

        if (data.class_id) {
          document.getElementById("classeModify").value = data.class_id;
        }
      });
  }

  if (data.student_id) {
    document.getElementById("studentsModify").value = data.student_id;
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", function () {
  // Charger les options pour le formulaire principal
  loadStudentsSelectOptions();
  loadLevelsSelectOptions();
  setupLevelChangeListener();
  
  // Charger les options pour le formulaire de modification (si les éléments existent)
  const studentsModifySelect = document.getElementById("studentsModify");
  const levelModifySelect = document.getElementById("levelModify");
  
  if (studentsModifySelect) {
    loadStudentsSelectOptionsModif();
  }
  
  if (levelModifySelect) {
    setupLevelChangeListenerModif();
  }
});
