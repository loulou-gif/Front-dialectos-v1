function loadRules() {
  axios.get(CONFIG.BASE_URL + '/api/users/roles/', {
    headers: {
      Authorization: `Token ${localStorage.getItem("authToken")}`
    }
  })
  .then(response => {
    const tableBody = document.getElementById("classe-list");
    tableBody.innerHTML = "";

    response.data.results.forEach(rules => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${rules.name}</td>
        <td>
          <div class="d-flex justify-content-around">
            <button class="btn btn-link p-0 btn-edit" data-id="${rules.id}" data-bs-toggle="modal" data-bs-target="#modifyRulesModal" title="Modifier">
              <i class="fa fa-edit text-success"></i>
            </button>
            <button class="btn btn-link p-0 btn-delete" data-id="${rules.id}" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal" title="Supprimer">
              <i class="fa fa-trash text-danger"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Erreur GET :", error);
  });
}

loadRules();

// === MODIFICATION RÔLE ===
document.addEventListener("click", function (e) {
  const editBtn = e.target.closest(".btn-edit");
  if (editBtn) {
    const rulesId = editBtn.dataset.id;

    axios.get(CONFIG.BASE_URL + `/api/users/roles/${rulesId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("authToken")}`
      }
    }).then(response => {
      const rules = response.data;
      document.getElementById("roleNameModify").value = rules.name;
      showNotification("success", "Rôle chargé avec succès !");
      document.getElementById("form-modify-role").dataset.id = rulesId;
    }).catch(error => {
      console.error("Erreur lors du chargement du rôle :", error);
      showNotification("error", "Erreur lors du chargement du rôle.");
    });
  }
});
