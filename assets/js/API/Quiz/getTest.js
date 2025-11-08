let testIdToDelete = null; // variable globale

// Fonction utilitaire pour vérifier si un devoir est expiré
function isHomeworkExpired(homework) {
  if (!homework.end_date) return false;
  const now = new Date();
  const endDate = new Date(homework.end_date);
  return endDate < now;
}

// Fonction utilitaire pour vérifier si un devoir est disponible pour les étudiants
function isHomeworkAvailableForStudents(homework) {
  const now = new Date();
  
  // Le devoir doit être envoyé
  if (!homework.is_sent) return false;
  
  // Si il y a une date limite, elle ne doit pas être dépassée
  if (homework.end_date) {
    const endDate = new Date(homework.end_date);
    if (endDate < now) return false;
  }
  
  return true;
}

// Fonction pour rafraîchir automatiquement les statuts des devoirs
function refreshHomeworkStatuses() {
  // Cette fonction peut être appelée périodiquement pour mettre à jour les statuts
  // sans recharger toute la page
  if (typeof loadTests === 'function') {
    loadTests();
  }
}

// Démarrer la vérification périodique des statuts (toutes les 5 minutes)
function startStatusRefresh() {
  // Vérifier immédiatement
  refreshHomeworkStatuses();
  
  // Puis vérifier toutes les 5 minutes
  setInterval(refreshHomeworkStatuses, 300000); // 300000ms = 5 minutes
}

function loadTests() {
  axios.get(CONFIG.BASE_URL + '/api/homework/', {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` }
  })
  .then(response => {
    const tableBody = document.getElementById("modules-list");
    tableBody.innerHTML = "";

    response.data.results.forEach(devoir => {
      const row = document.createElement("tr");
      
      // Déterminer le statut en fonction de la date limite
      let status = "";
      let statusClass = "";
      
      if (devoir.is_sent) {
        // Vérifier si la date limite est dépassée
        if (isHomeworkExpired(devoir)) {
          status = "Dépublié";
          statusClass = "badge bg-danger";
        } else {
          status = "Envoyé";
          statusClass = "badge bg-success";
        }
      } else if (devoir.is_scheduled) {
        status = "Programmé";
        statusClass = "badge bg-warning";
      } else {
        status = "Brouillon";
        statusClass = "badge bg-secondary";
      }
      
      // Formater la date d'envoi
      let scheduledDate = "-";
      if (devoir.scheduled_date) {
        const date = new Date(devoir.scheduled_date);
        scheduledDate = date.toLocaleString('fr-FR');
      }
      
      // Formater la date limite
      let endDate = "-";
      if (devoir.end_date) {
        const date = new Date(devoir.end_date);
        endDate = date.toLocaleString('fr-FR');
      }
      
      // Déterminer le type de devoir
      let type = "Collectif";
      if (devoir.is_individual) {
        type = "Individuel";
      }
      
      row.innerHTML = ` 
        <td>${devoir.name}</td>
        <td>${devoir.course_name}</td>
        <td>${devoir.level_name}</td>
        <td><span class="badge ${devoir.is_individual ? 'bg-info' : 'bg-secondary'}">${type}</span></td>
        <td><span class="${statusClass}">${status}</span></td>
        <td>${scheduledDate}</td>
        <td>${endDate}</td>
        <td>${devoir.average_score || "N/A"}</td>
        <td>
          <div class="d-flex justify-content-around">
            <button class="btn btn-link p-0 btn-detail" data-id="${devoir.id}" data-bs-toggle="modal" data-bs-target="#devoirs-info" title="voir">
              <i class="fa fa-eye text-primary"></i>
            </button>
            <button class="btn btn-link p-0 btn-edit" data-id="${devoir.id}" data-bs-toggle="modal" data-bs-target="#modif-devoir" title="Modifier">
              <i class="fa fa-edit text-success"></i>
            </button>
            <button class="btn btn-link p-0 btn-delete" data-id="${devoir.id}" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal" title="Supprimer">
              <i class="fa fa-trash text-danger"></i>
            </button>
          </div>
        </td>`;
      tableBody.appendChild(row);
    });

    // Reinit DataTable
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable('#basic-datatables')) {
        $('#basic-datatables').DataTable().destroy();
      }
      $('#basic-datatables').DataTable({
        destroy: true,
        "pageLength": 5,
        "responsive": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "lengthChange": true
      });
    }, 100);
  })
  .catch(error => console.error("Erreur GET :", error));
}




      function loadLevelsSelectOptions() {
        axios.get(CONFIG.BASE_URL + '/api/level/', {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        })
        .then(response => {
          const niveauSelect = document.getElementById("level-name");
          const niveauModifSelect = document.getElementById("level-modif");

          // Vérifier que les éléments existent avant de les manipuler
          if (niveauSelect && niveauModifSelect) {
            // Nettoyer les options existantes sauf le premier
            niveauSelect.innerHTML = '<option value="">Sélectionne un niveau</option>';
            niveauModifSelect.innerHTML = '<option value="">Sélectionne un niveau</option>';

            // Remplir les deux select avec les niveaux
            response.data.results.forEach(niveau => {
              const option = new Option(niveau.name, niveau.id);
              niveauSelect.appendChild(option);

              const modifOption = new Option(niveau.name, niveau.id);
              niveauModifSelect.appendChild(modifOption);
            });
          } else {
            console.error("Éléments select niveau non trouvés:", { niveauSelect, niveauModifSelect });
          }
        })
        .catch(error => {
          console.error("Erreur lors du chargement des niveaux :", error);
        });
      }
      function loadCoursSelectOptions() {
        axios.get(CONFIG.BASE_URL + '/api/courses/', {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        })
        .then(response => {
          const niveauSelect = document.getElementById("cours-name");
          const niveauModifSelect = document.getElementById("cours-modif");

          // Vérifier que les éléments existent avant de les manipuler
          if (niveauSelect && niveauModifSelect) {
            // Nettoyer les options existantes sauf le premier
            niveauSelect.innerHTML = '<option value="">Sélectionne un niveau</option>';
            niveauModifSelect.innerHTML = '<option value="">Sélectionne un niveau</option>';

            // Remplir les deux select avec les niveaux
            response.data.results.forEach(niveau => {
              const option = new Option(niveau.name, niveau.id);
              niveauSelect.appendChild(option);

              const modifOption = new Option(niveau.name, niveau.id);
              niveauModifSelect.appendChild(modifOption);
            });
          } else {
            console.error("Éléments select niveau non trouvés:", { niveauSelect, niveauModifSelect });
          }
        })
        .catch(error => {
          console.error("Erreur lors du chargement des niveaux :", error);
        });
      }
      
      function loadClassesSelectOptions() {
        axios.get(CONFIG.BASE_URL + '/api/classes/', {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        })
        .then(response => {
          const classesSelect = document.getElementById("classe-name"); // Correction de l'ID
          const classesModifSelect = document.getElementById("classe-modif");
          
          // Vérifier que les éléments existent avant de les manipuler
          if (classesSelect && classesModifSelect) {
            // Nettoyer les options existantes sauf le premier
            classesSelect.innerHTML = '<option value="">Sélectionne une classe</option>';
            classesModifSelect.innerHTML = '<option value="">Sélectionne une classe</option>';

            response.data.results.forEach(classe => {
              const option = new Option(classe.name, classe.id);
              classesSelect.appendChild(option);

              const modifOption = new Option(classe.name, classe.id);
              classesModifSelect.appendChild(modifOption);
            });
          } else {
            console.error("Éléments select non trouvés:", { classesSelect, classesModifSelect });
          }
        })
        .catch(error => {
          console.error("Erreur lors du chargement des classes :", error);
        });
      }
      
      // Attendre que le DOM soit chargé avant d'appeler les fonctions
      document.addEventListener("DOMContentLoaded", function() {
        loadLevelsSelectOptions();
        loadClassesSelectOptions();
        loadCoursSelectOptions();
        loadTests();
      });


      document.addEventListener("click", function (e) {
        if (e.target.closest(".btn-detail")) {
          const devoirId = e.target.closest(".btn-detail").dataset.id;
          console.log("Devoir ID :", devoirId);
      
          axios.get(CONFIG.BASE_URL + `/api/homework/${devoirId}/`, {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`
            }
              })
              .then(response => {
                const devoir = response.data;
                document.getElementById("devoir-name-info").textContent = devoir.name;
                document.getElementById("devoir-description").textContent = devoir.description;
                document.getElementById("devoir-cours").textContent = devoir.course_name;
                document.getElementById("devoir-level").textContent = devoir.level_name;
                document.getElementById("devoir-created-at").textContent = devoir.created_at_formatted;
                
                // Afficher le type de devoir
                let type = "Collectif";
                if (devoir.is_individual) {
                  type = "Individuel";
                }
                document.getElementById("devoir-type").textContent = type;
                
                // Afficher le statut
                let status = "";
                
                if (devoir.is_sent) {
                  // Vérifier si la date limite est dépassée
                  if (isHomeworkExpired(devoir)) {
                    status = "Dépublié";
                  } else {
                    status = "Envoyé";
                  }
                } else if (devoir.is_scheduled) {
                  status = "Programmé";
                } else {
                  status = "Brouillon";
                }
                document.getElementById("devoir-status").textContent = status;
                
                // Afficher la date d'envoi programmée
                let scheduledDate = "Non programmé";
                if (devoir.scheduled_date) {
                  const date = new Date(devoir.scheduled_date);
                  scheduledDate = date.toLocaleString('fr-FR');
                }
                document.getElementById("devoir-scheduled-date").textContent = scheduledDate;
                
                // Afficher la date limite
                let endDate = "Non définie";
                if (devoir.end_date) {
                  const date = new Date(devoir.end_date);
                  endDate = date.toLocaleString('fr-FR');
                }
                document.getElementById("devoir-end-date").textContent = endDate;
                
                // Afficher l'étudiant assigné
                let studentName = "Tous les étudiants";
                if (devoir.is_individual && devoir.student_name) {
                  studentName = devoir.student_name;
                }
                document.getElementById("devoir-student").textContent = studentName;
                
                document.getElementById("devoir-url-info").innerHTML = `<a class="text-white" href="${devoir.form_link}" target="_blank"><i class="fa fa-link "></i> Télécharger</a>`;  
              })
                .catch(error => {
                console.error("Erreur lors du chargement du devoir :", error);
              });
          }
        }
      );

      document.addEventListener("click", function (e) {
        if (e.target.closest(".btn-edit")) {
          const devoirId = e.target.closest(".btn-edit").dataset.id;
      
          axios.get(CONFIG.BASE_URL + `/api/homework/${devoirId}/`, {
            headers: { Authorization: `Token ${localStorage.getItem("token")}` }
          })
          .then(response => {
            const devoir = response.data;
            document.getElementById("modif-devoir-name").value = devoir.name;
            document.getElementById("url-modif").value = devoir.form_link;
            document.getElementById("descriptions-modif").value = devoir.description;
            document.getElementById("cours-modif").value = devoir.course;
            document.getElementById("classe-modif").value = devoir.classes;
            document.getElementById("level-modif").value = devoir.level;
            
            // Gérer les champs de planification
            const isScheduledCheckbox = document.getElementById("is-scheduled-modif");
            const scheduledDateContainer = document.getElementById("scheduled-date-container-modif");
            const scheduledDateInput = document.getElementById("scheduled-date-modif");
            
            if (devoir.is_scheduled) {
              isScheduledCheckbox.checked = true;
              scheduledDateContainer.style.display = "block";
              if (devoir.scheduled_date) {
                // Convertir la date ISO en format datetime-local
                const date = new Date(devoir.scheduled_date);
                const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                scheduledDateInput.value = localDateTime;
              }
            } else {
              isScheduledCheckbox.checked = false;
              scheduledDateContainer.style.display = "none";
              scheduledDateInput.value = "";
            }
            
            // Gérer les champs de devoir individuel
            const isIndividualCheckbox = document.getElementById("is-individual-modif");
            const studentContainer = document.getElementById("student-container-modif");
            const studentSelect = document.getElementById("student-select-modif");
            
            if (devoir.is_individual) {
              isIndividualCheckbox.checked = true;
              studentContainer.style.display = "block";
              if (devoir.student) {
                studentSelect.value = devoir.student;
              }
            } else {
              isIndividualCheckbox.checked = false;
              studentContainer.style.display = "none";
              studentSelect.value = "";
            }
            
            // Gérer la date limite
            const endDateInput = document.getElementById("end-date-modif");
            if (devoir.end_date) {
              const date = new Date(devoir.end_date);
              const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
              endDateInput.value = localDateTime;
            } else {
              endDateInput.value = "";
            }
      
            // Correction ici 👇
            document.getElementById("form-modif-devoir").dataset.id = devoirId;
          })
          .catch(error => console.error("Erreur lors du chargement du test :", error));
        }
      
        // --- Suppression (click sur icône corbeille) ---
        if (e.target.closest(".btn-delete")) {
          testIdToDelete = e.target.closest(".btn-delete").dataset.id;
          console.log("Test à supprimer :", testIdToDelete);
        }
      });
      
      // --- Confirmer la suppression ---
      document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
          if (!testIdToDelete) {
            showNotification("warning", "ID du test à supprimer non défini.", "Action échouée");
            return;
          }
      
          axios.delete(CONFIG.BASE_URL + `/api/homework/${testIdToDelete}/`, {
            headers: { Authorization: `Token ${localStorage.getItem("token")}` }
          })
          .then(() => {
            showNotification("success", "Test supprimé avec succès !", "Action réussie");
            $("#deleteConfirmationModal").modal("hide");
            loadTests(); // recharge la liste
          })
          .catch(error => {
            console.error("Erreur lors de la suppression :", error);
            showNotification("warning", "Erreur lors de la suppression.", "Action échouée");
          });
        });
      });
      
      // Initialiser le chargement des tests et la vérification des statuts
      loadTests();
      startStatusRefresh();