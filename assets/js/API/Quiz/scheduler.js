/**
 * ============================================
 * SCHEDULER.JS - Gestionnaire de planification des devoirs
 * ============================================
 * Script pour gérer l'envoi automatique des devoirs programmés
 * 
 * @version 1.0.0
 * @author Dialektos Team
 */

// Fonction pour vérifier et envoyer les devoirs programmés
function checkScheduledHomework() {
  const now = new Date();
  
  // Récupérer tous les devoirs programmés
  axios.get(CONFIG.BASE_URL + '/api/homework/?is_scheduled=true&is_sent=false', {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` }
  })
  .then(response => {
    const scheduledHomework = response.data.results;
    
    scheduledHomework.forEach(homework => {
      if (homework.scheduled_date) {
        const scheduledDate = new Date(homework.scheduled_date);
        
        // Si la date programmée est arrivée ou dépassée
        if (scheduledDate <= now) {
          sendHomeworkToStudents(homework);
        }
      }
    });
  })
  .catch(error => {
    console.error("Erreur lors de la vérification des devoirs programmés :", error);
  });
}

// Fonction pour vérifier les devoirs expirés et les marquer comme dépubliés
function checkExpiredHomework() {
  const now = new Date();
  
  // Récupérer tous les devoirs envoyés
  axios.get(CONFIG.BASE_URL + '/api/homework/?is_sent=true', {
    headers: { Authorization: `Token ${localStorage.getItem("token")}` }
  })
  .then(response => {
    const sentHomework = response.data.results;
    
    sentHomework.forEach(homework => {
      if (homework.end_date) {
        const endDate = new Date(homework.end_date);
        
        // Si la date limite est dépassée, marquer comme dépublié
        if (endDate < now) {
          markHomeworkAsUnpublished(homework);
        }
      }
    });
  })
  .catch(error => {
    console.error("Erreur lors de la vérification des devoirs expirés :", error);
  });
}

// Fonction pour marquer un devoir comme dépublié
function markHomeworkAsUnpublished(homework) {
  // Ici, vous pouvez ajouter une logique pour marquer le devoir comme dépublié
  // Par exemple, ajouter un champ "is_unpublished" ou modifier le statut
  console.log(`Devoir "${homework.name}" expiré - devrait être marqué comme dépublié`);
  
  // Optionnel : appeler une API pour marquer le devoir comme dépublié
  // axios.patch(CONFIG.BASE_URL + `/api/homework/${homework.id}/`, {
  //   is_unpublished: true
  // }, {
  //   headers: { 
  //     Authorization: `Token ${localStorage.getItem("token")}`,
  //     'Content-Type': 'application/json'
  //   }
  // })
  // .then(response => {
  //   console.log(`Devoir "${homework.name}" marqué comme dépublié`);
  // })
  // .catch(error => {
  //   console.error(`Erreur lors du marquage du devoir "${homework.name}" :`, error);
  // });
}

// Fonction pour envoyer un devoir aux étudiants
function sendHomeworkToStudents(homework) {
  // Marquer le devoir comme envoyé
  axios.patch(CONFIG.BASE_URL + `/api/homework/${homework.id}/`, {
    is_sent: true
  }, {
    headers: { 
      Authorization: `Token ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (homework.is_individual) {
      console.log(`Devoir individuel "${homework.name}" envoyé à l'étudiant ${homework.student}`);
    } else {
      console.log(`Devoir collectif "${homework.name}" envoyé aux étudiants`);
    }
    
    // Envoyer les notifications par email
    // sendEmailNotifications(homework);
  })
  .catch(error => {
    console.error(`Erreur lors de l'envoi du devoir "${homework.name}" :`, error);
  });
}

// // Fonction pour envoyer les notifications par email
// function sendEmailNotifications(homework) {
//   // Cette fonction devrait appeler votre API backend pour envoyer les emails
//   // aux étudiants de la classe concernée
  
//   const notificationData = {
//     homework_id: homework.id,
//     class_id: homework.classes,
//     level_id: homework.level,
//     is_individual: homework.is_individual,
//     student_id: homework.student
//   };
  
//   axios.post(CONFIG.BASE_URL + '/api/send-homework-notifications/', notificationData, {
//     headers: { 
//       Authorization: `Token ${localStorage.getItem("token")}`,
//       'Content-Type': 'application/json'
//     }
//   })
//   .then(response => {
//     if (homework.is_individual) {
//       console.log(`Notification individuelle envoyée pour le devoir "${homework.name}"`);
//     } else {
//       console.log(`Notifications collectives envoyées pour le devoir "${homework.name}"`);
//     }
//   })
//   .catch(error => {
//     console.error(`Erreur lors de l'envoi des notifications pour "${homework.name}" :`, error);
//   });
// }

// Démarrer la vérification périodique (toutes les minutes)
function startScheduler() {
  // Vérifier immédiatement
  checkScheduledHomework();
  checkExpiredHomework();
  
  // Puis vérifier toutes les minutes
  setInterval(() => {
    checkScheduledHomework();
    checkExpiredHomework();
  }, 60000); // 60000ms = 1 minute
}

// Initialiser le planificateur quand le DOM est chargé
document.addEventListener("DOMContentLoaded", function() {
  // Ne démarrer le planificateur que sur les pages d'administration
  if (window.location.pathname.includes('/administration/')) {
    startScheduler();
  }
});

console.log("✅ scheduler.js chargé - Planificateur de devoirs initialisé");
