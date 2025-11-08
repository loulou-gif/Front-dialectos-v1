function loadLevel() {
  axios.get(CONFIG.BASE_URL + '/api/level/', {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`
    }
  })
  .then(response => {
    const tableBody = document.getElementById("classe-list");
    tableBody.innerHTML = "";

    response.data.results.forEach(level => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${level.name}</td>
        <td>
          <div class="d-flex justify-content-around">
            <button class="btn btn-link p-0 btn-edit" data-id="${level.id}" data-bs-toggle="modal" data-bs-target="#modifylevelModal" title="Modifier">
              <i class="fa fa-edit text-success"></i>
            </button>
            <button class="btn btn-link p-0 btn-delete" data-id="${level.id}" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal" title="Supprimer">
              <i class="fa fa-trash text-danger"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });
    
    // Initialiser la DataTable après le chargement des données
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

loadLevel();

// === MODIFICATION RÔLE ===
document.addEventListener("click", function (e) {
  const editBtn = e.target.closest(".btn-edit");
  if (editBtn) {
    const levelId = editBtn.dataset.id;

    axios.get(CONFIG.BASE_URL + `/api/level/${levelId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    }).then(response => {
      const level = response.data;
      document.getElementById("roleNameModify").value = level.name;
      showNotification("success", "Niveau chargé avec succès !");

      document.getElementById("form-modify-role").dataset.id = levelId;
    }).catch(error => {
      console.error("Erreur lors du chargement du rôle :", error);
      showNotification("error", "Erreur lors du chargement du niveau.");
    });
  }
});
