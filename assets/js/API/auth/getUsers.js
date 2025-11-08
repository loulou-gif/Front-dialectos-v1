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

function formatDate(isoString) {
  const date = new Date(isoString);
  const jour = String(date.getDate()).padStart(2, '0');
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const annee = date.getFullYear();
  const heures = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${jour}/${mois}/${annee} à ${heures}h${minutes}`;
}
      function loadRoles() {
        axios.get(CONFIG.BASE_URL + "/api/roles/", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` }
        })
        .then(response => {
          const selectRules = document.getElementById("role");
          const selectModifyRules = document.getElementById("roleModify");

          // Nettoyer les anciens options
          selectRules.innerHTML = '<option value="">Sélectionne un rôle</option>';
          selectModifyRules.innerHTML = '<option value="">Sélectionne un rôle</option>';

          response.data.results.forEach(rule => {
            const option1 = new Option(rule.name, rule.id);
            const option2 = new Option(rule.name, rule.id);
            selectRules.appendChild(option1);
            selectModifyRules.appendChild(option2);
          });
        })
        .catch(error => {
          console.error("Erreur chargement des rôles :", error);
        });
      }

      loadRoles();

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (isNaN(date)) return "Date invalide";

  const jour = String(date.getDate()).padStart(2, '0');
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const annee = date.getFullYear();
  const heures = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${jour}/${mois}/${annee} à ${heures}h${minutes}`;
}

function loadRoles() {
  axios.get(CONFIG.BASE_URL + "/api/roles/", {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` }
  })
  .then(response => {
    const selectRules = document.getElementById("role");
    const selectModifyRules = document.getElementById("roleModify");

    // Réinitialiser les options
    selectRules.innerHTML = '<option value="">Sélectionne un rôle</option>';
    selectModifyRules.innerHTML = '<option value="">Sélectionne un rôle</option>';

    // Parcourir directement response.data (pas response.data.results)
    response.data.forEach(role => {
      const option1 = new Option(role.label, role.value);
      const option2 = new Option(role.label, role.value);
      selectRules.appendChild(option1);
      selectModifyRules.appendChild(option2);
    });
  })
  .catch(error => {
    console.error("Erreur chargement des rôles :", error);
  });
}


function loadUser() {
  axios.get(CONFIG.BASE_URL + '/api/users/', {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  })
  .then(response => {
    const tableBody = document.getElementById("classe-list");
    tableBody.innerHTML = "";

    const sortedUsers = response.data.results.sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined));

    sortedUsers.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.last_name} ${user.first_name}</td>
        <td>${user.email}</td>
        <td>${formatDate(user.date_joined)}</td>
        <td>
          <div class="d-flex justify-content-around">
            <button class="btn btn-details p-0" data-bs-toggle="modal" data-id="${user.id}" data-bs-target="#detail-users" title="Détails">
              <i class="fas fa-eye text-warning"></i>
            </button>
            <button class="btn btn-link p-0 btn-edit" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#modifyAccountModal" title="Modifier">
              <i class="fa fa-edit text-success"></i>
            </button>
            <button class="btn btn-link p-0 btn-delete" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal" title="Supprimer">
              <i class="fa fa-trash text-danger"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Réinitialiser et réinitialiser DataTable proprement
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#basic-datatables')) {
          $('#basic-datatables').DataTable().destroy();
      }
      $('#basic-datatables').DataTable({
          "pageLength": 10,
          "responsive": true,
          "searching": true,
          "ordering": true,
          "info": true,
          "lengthChange": true
      });
  }, 100);

  })
  .catch(error => {
    console.error("Erreur GET :", error);
  });
}
loadUser(); // Chargement initial
 // Appel au chargement

// === MODIFICATION UTILISATEUR ===
document.addEventListener("click", function (e) {
  const editBtn = e.target.closest(".btn-edit");
  if (editBtn) {
    const userId = editBtn.dataset.id;

    axios.get(CONFIG.BASE_URL + `/api/users/${userId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    }).then(response => {
      const user = response.data;
      document.getElementById("usernameModify").value = user.username;
      document.getElementById("nameModify").value = user.first_name;
      document.getElementById("last_nameModify").value = user.last_name;
      document.getElementById("emailModify").value = user.email;
      showNotification("success", "Utilisateur chargé avec succès !", "Action réussie");
      document.getElementById("form-modify-user").dataset.id = userId; // ✅ bon identifiant ici
    }).catch(error => {
      console.error("Erreur lors du chargement de l'utilisateur :", error);
      showNotification("error", "Erreur lors du chargement de l'utilisateur.", "Action échouée");
    });
  }
});



document.addEventListener("click", function(e){
  const detailsBtn = e.target.closest(".btn-details");
  if (detailsBtn) {
    const userId = detailsBtn.dataset.id;
    loadUserDetails(userId);
  }
});

function loadUserDetails(userId) {
  axios.get(CONFIG.BASE_URL + `/api/user-info/details/${userId}/`, {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  }).then(response => {
    const user = response.data;
    document.getElementById("username-dt").textContent = user.username;
    document.getElementById("name-dt").textContent =  user.first_name + " " + user.last_name;
    document.getElementById("email-dt").textContent = user.email;
    document.getElementById("roles-dt").textContent =  user.role;
    document.getElementById("level-dt").textContent = user.class_info.level;
    showNotification("success", "Utilisateur chargé avec succès !", "Action réussie");
    console.log(user.role);
    document.getElementById("classList-dt").innerHTML = "";
    const classListEl = document.getElementById("classList-dt");
    classListEl.innerHTML = "";

    // Ajouter le nom de la classe si présent
    if (user.class_info.class_name) {
      const p = document.createElement("p");
      p.textContent = user.class_info.class_name;
      classListEl.appendChild(p);
    }
  }).catch(error => {
    console.error("Erreur lors du chargement de l'utilisateur :", error);
    showNotification("error", "Erreur lors du chargement de l'utilisateur.", "Action échouée");
  });
}
