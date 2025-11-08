function loadClasses() {
axios.get(CONFIG.BASE_URL + '/api/categorie/', {
    headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
    }
})
.then(response => {
    const tableBody = document.getElementById("classe-list");
    tableBody.innerHTML = "";
    response.data.results.forEach(categorie => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${categorie.name}</td>
        <td>${categorie.descriptions}</td>
        <td>
        <div class="d-flex justify-content-around">
            <!-- Modifier (ouvre la modale de modification) -->
            <button class="btn btn-link p-0 btn-edit" data-id="${categorie.id}" data-bs-toggle="modal" data-bs-target="#modifyCatModal" title="Modifier">
            <i class="fa fa-edit text-success"></i>
            </button>
            
            <!-- Supprimer (ouvre la modale de confirmation) -->
            <button class="btn btn-link p-0 btn-delete" data-id="${categorie.id}" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal" title="Supprimer">
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
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/French.json"
                },
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

loadClasses(); // Appel au chargement

document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-edit")) {
    const categorieId = e.target.closest(".btn-edit").dataset.id;

    axios.get(CONFIG.BASE_URL + `/api/categorie/${categorieId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      }
    }).then(response => {
      const categorie = response.data;
      document.getElementById("modif-name").value = categorie.name;
      document.getElementById("modif-description").value = categorie.descriptions;
      document.getElementById("form-modify-categorie").dataset.id = categorieId; // Stocke l'id pour soumission
    }).catch(error => {
      console.error("Erreur lors du chargement de la catégorie :", error);
    });
  }
});
