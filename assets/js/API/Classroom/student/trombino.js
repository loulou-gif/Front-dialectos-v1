function loadClasses() {
    axios.get(CONFIG.BASE_URL + '/api/user-info/details/', {
        headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
        }
    })
    .then(response => {
        const tableBody = document.getElementById("classe-list");
        tableBody.innerHTML = "";
        const usersList = response.data;

        if(usersList && Array.isArray(usersList)){
            usersList.forEach(userData => {
                const row = document.createElement("tr");
                
                // Déterminer les informations à afficher selon le rôle
                let classeInfo = 'N/A';
                let niveauInfo = 'N/A';
                
                if (userData.role === 'Student' && userData.class_info) {
                    classeInfo = userData.class_info.class_name || 'N/A';
                    niveauInfo = userData.class_info.level || 'N/A';
                } else if (userData.role === 'Teacher') {
                    classeInfo = 'Enseignant';
                    niveauInfo = userData.class_info ? userData.class_info.level : 'N/A';
                }
                
                row.innerHTML = `
                    <td>${userData.first_name || 'N/A'}</td>
                    <td>${userData.last_name || 'N/A'}</td>
                    <td>${classeInfo}</td>
                    <td>${niveauInfo}</td>
                    <td>${userData.role || 'N/A'}</td>
                    <td>
                    <div class="d-flex justify-content-around">
                        <!-- Détails (ouvre la modale de détails) -->
                        <button class="btn p-0 btn-details btn-primary row" data-id="${userData.id}" data-bs-toggle="modal" data-bs-target="#classe-info" title="Détails">
                            <i class="fa fa-eye text-white"> Détails </i>
                        </button>
                    </div>
                </td>
                `;
                tableBody.appendChild(row);
            });
        } else if (usersList) {
            // Si c'est un seul objet, l'afficher quand même
            const userData = usersList;
            const row = document.createElement("tr");
            
            let classeInfo = 'N/A';
            let niveauInfo = 'N/A';
            
            if (userData.role === 'Student' && userData.class_info) {
                classeInfo = userData.class_info.class_name || 'N/A';
                niveauInfo = userData.class_info.level || 'N/A';
            } else if (userData.role === 'Teacher') {
                classeInfo = 'Enseignant';
                niveauInfo = userData.class_info ? userData.class_info.level : 'N/A';
            }
            
            row.innerHTML = `
                <td>${userData.first_name || 'N/A'}</td>
                <td>${userData.last_name || 'N/A'}</td>
                <td>${classeInfo}</td>
                <td>${niveauInfo}</td>
                <td>${userData.role || 'N/A'}</td>
                <td>
                <div class="d-flex justify-content-around">
                    <!-- Détails (ouvre la modale de détails) -->
                    <button class="btn p-0 btn-details btn-primary row" data-id="${userData.id}" data-bs-toggle="modal" data-bs-target="#classe-info" title="Détails">
                        <i class="fa fa-eye text-white"> Détails </i>
                    </button>
                </div>
            </td>
            `;
            tableBody.appendChild(row);
        }
        
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

loadClasses();




document.addEventListener("click", function (e) {
    if (e.target.closest(".btn-details")) {
      const classId = e.target.closest(".btn-details").dataset.id;
  
      // Récupérer les informations détaillées de la classe
      axios.get(CONFIG.BASE_URL + `/api/user-info/details/${classId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      }).then(response => {
        const userData = response.data;
        
        // Remplir la modal avec les informations de la classe
          document.getElementById("classe-name").textContent = userData.first_name || 'N/A';
          document.getElementById("classe-first_name").textContent = userData.last_name || 'N/A';
          document.getElementById("classe-class_name").textContent = userData.class_info.class_name || 'N/A';
          document.getElementById("classe-level").textContent = userData.class_info.level || 'N/A';
          document.getElementById("classe-email").textContent = userData.email || 'N/A';

      }).catch(error => {
        console.error("Erreur lors du chargement des détails de la classe :", error);
        // Afficher un message d'erreur dans la modal
        document.getElementById("classe-name").textContent = 'Erreur de chargement';
        document.getElementById("classe-level").textContent = 'N/A';
        document.getElementById("classe-teacher").textContent = 'N/A';
        document.getElementById("classe-created-at").textContent = 'N/A';
        document.getElementById("classe-students").textContent = '0';
      });
    }
  });