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

function loadStudents() {
axios.get(CONFIG.BASE_URL + '/api/classes/', {
    headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
    }
})
.then(response => {
    const tableBody = document.getElementById("classe-list");
    tableBody.innerHTML = "";
    response.data.results.forEach(classe => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${classe.name}</td>
        <td>${classe.student_count}</td>
        <td>${classe.level_name}</td>
        <td>${classe.created_at}</td>
        <td>${classe.teacher_name}</td>
        <td>
        <div class="d-flex justify-content-around">
            <!-- Modifier (ouvre la modale de modification) -->
            <button class="btn btn-link p-0" data-bs-toggle="modal" data-bs-target="#modifyClasseModal" title="Modifier">
            <i class="fa fa-user-plus text-primary"></i>
            </button>
            <button class="btn btn-link p-0" data-bs-toggle="modal" data-bs-target="#modifyClasseModal" title="Modifier">
            <i class="fa fa-edit text-success"></i>
            </button>
            
            <!-- Supprimer (ouvre la modale de confirmation) -->
            <button data-id="" class="btn btn-link p-0" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal" title="Supprimer">
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
    showNotification("error", "Erreur lors du chargement des étudiants.", "Action échouée");
});
}

loadStudents(); // Appel au chargement