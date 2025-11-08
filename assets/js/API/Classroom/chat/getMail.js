function bindDetailsButtons() {
    const buttons = document.querySelectorAll(".btn-details");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
        const mailId = this.getAttribute("data-id");
        if (!mailId) return;
    
        axios.get(CONFIG.BASE_URL + `/api/sendEmail/${mailId}/`, {
            headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
            }
        })
        .then(response => {
            const mail = response.data;
    
            document.getElementById("mail-subject").textContent = mail.subject || "";
            document.getElementById("mail-from").textContent = mail.from_email || "";
            document.getElementById("mail-diffusion").textContent = mail.diffusion_list || "N/A";
            document.getElementById("mail-criticality").textContent = mail.criticality || "";
            document.getElementById("mail-date").textContent = new Date(mail.sent_at).toLocaleString("fr-FR");
            document.getElementById("mail-body").innerHTML = mail.message || "<i>(vide)</i>";
    
            // La modale s’ouvrira automatiquement via data-bs-toggle
        })
        .catch(error => {
            console.error("Erreur lors de la récupération du mail :", error);
            showNotification("error", "Impossible de charger les informations du mail.", "Action échouée");
        });
        });
    });
    }
    



function loadAnnouncement() {
    axios.get(CONFIG.BASE_URL + '/api/sendEmail/', {
        headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
        }
    })
    .then(response => {
        const tableBody = document.getElementById("annonce-list");
        tableBody.innerHTML = "";
        const sortedUsers = response.data.results.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
        sortedUsers.forEach(mail => {
        const row = document.createElement("tr");
        row.innerHTML = ` 
            <td>${mail.subject}</td>
            <td>${mail.criticality}</td>
            <td>${mail.sent_at}</td>
            <td>
            <div class="d-flex justify-content-around">
                <!-- Détails (ouvre la modale de modification) -->
                 <button class="btn p-0 btn-details btn-primary row" data-id="${mail.id}" data-bs-toggle="modal" data-bs-target="#mail-info" title="Modifier">
                    <i class="fa fa-eye text-white"> Détails </i>
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
                "pageLength": 5,
                "responsive": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "lengthChange": true,
                "order": [[3, "desc"]] 
            });
            
            }, 100);
            bindDetailsButtons();

    })
    .catch(error => {
        console.error("Erreur GET :", error);
        showNotification("error", "Erreur lors du chargement des mails.", "Action échouée");
    });
    }
    
          function loadMailListSelectOptions() {
            axios.get(CONFIG.BASE_URL + '/api/diffusionList/', {
              headers: {
                Authorization: `Token ${localStorage.getItem("token")}`
              }
            })
            .then(response => {
              const mailListSelect = document.getElementById("maillist");
    
              // Vérifier que les éléments existent avant de les manipuler
              if (mailListSelect) {
                // Nettoyer les options existantes sauf le premier
                mailListSelect.innerHTML = '<option value="">Sélectionne un niveau</option>';
    
                // Remplir les deux select avec les niveaux
                response.data.results.forEach(maillist => {
                  const option = new Option(maillist.name, maillist.id);
                  mailListSelect.appendChild(option);
                });
              } else {
                console.error("Éléments select niveau non trouvés:", { mailListSelect });
              }
            })
            .catch(error => {
              console.error("Erreur lors du chargement des niveaux :", error);
              showNotification("error", "Erreur lors du chargement des niveaux.", "Action échouée");
            });
          }
          
          // Attendre que le DOM soit chargé avant d'appeler les fonctions
          document.addEventListener("DOMContentLoaded", function() {
            loadMailListSelectOptions();
            loadAnnouncement();
            bindDetailsButtons();
          });

