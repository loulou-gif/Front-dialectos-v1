# Fonctionnalité de Planification des Devoirs (Version Étendue)

## Vue d'ensemble

Cette fonctionnalité permet aux administrateurs de programmer l'envoi automatique des devoirs aux étudiants à une date et heure spécifiques, avec support pour les devoirs individuels et les dates limites.

## Fonctionnalités

### 1. Planification des Devoirs
- **Création** : Les administrateurs peuvent créer des devoirs avec une date d'envoi programmée
- **Modification** : Possibilité de modifier la date d'envoi d'un devoir existant
- **Validation** : La date d'envoi doit être dans le futur

### 2. Types de Devoirs
- **Collectif** : Devoir pour tous les étudiants d'une classe
- **Individuel** : Devoir pour un étudiant spécifique
- **Date limite** : Possibilité de définir une date limite de soumission

### 3. Statuts des Devoirs
- **Brouillon** : Devoir créé mais non programmé
- **Programmé** : Devoir avec une date d'envoi définie
- **Envoyé** : Devoir automatiquement envoyé aux étudiants (disponible pour les étudiants)
- **Dépublié** : Devoir expiré (date limite dépassée, non visible pour les étudiants)

### 4. Envoi Automatique
- Vérification périodique (toutes les minutes) des devoirs programmés
- Envoi automatique quand la date programmée est atteinte
- Mise à jour du statut à "Envoyé"
- Support pour les devoirs individuels et collectifs

### 5. Gestion des Dates Limites
- Vérification automatique des devoirs expirés
- Changement de statut automatique : "Envoyé" → "Dépublié"
- Masquage automatique des devoirs expirés pour les étudiants
- Rafraîchissement périodique des statuts (toutes les 5 minutes)

## Structure des Données

### API Homework
```json
{
    "name": "string",
    "description": "string", 
    "form_link": "string",
    "course": "integer",
    "classes": "integer",
    "level": "integer",
    "scheduled_date": "datetime",
    "is_scheduled": "boolean",
    "is_sent": "boolean",
    "student": "integer",
    "end_date": "datetime",
    "is_individual": "boolean"
}
```

## Pages Modifiées

### Administration
- `pages/administration/devoirs.html`
  - Ajout des champs de planification dans les formulaires
  - Ajout des champs pour devoirs individuels
  - Ajout du champ date limite de soumission
  - Nouvelle colonne "Type" dans le tableau (Collectif/Individuel)
  - Nouvelle colonne "Statut" dans le tableau
  - Nouvelle colonne "Date d'envoi" dans le tableau
  - Nouvelle colonne "Date limite" dans le tableau
  - Informations complètes dans le modal de détails

### Teacher
- `pages/teacher/devoirs.html`
  - Pas de modification (les teachers ne peuvent pas programmer)

### Student
- `pages/student/devoir.html`
  - Filtrage pour ne montrer que les devoirs envoyés ou programmés et dont la date est arrivée
  - Support pour les devoirs individuels (affichage uniquement pour l'étudiant concerné)
  - Indication visuelle des devoirs individuels

## Scripts Modifiés

### 1. `assets/js/API/Quiz/CreateModifyTest.js`
- Ajout de la logique de planification dans les formulaires
- Ajout de la logique pour devoirs individuels
- Validation des dates d'envoi et dates limites
- Gestion de l'affichage/masquage des champs conditionnels
- Chargement des étudiants pour les devoirs individuels

### 2. `assets/js/API/Quiz/getTest.js`
- Affichage des statuts avec des badges colorés
- Affichage du type de devoir (Collectif/Individuel)
- Formatage des dates d'envoi et dates limites
- Chargement des données complètes dans les modals
- Gestion des champs de modification pour devoirs individuels

### 3. `assets/js/API/Quiz/student/devoir.js`
- Filtrage des devoirs pour les étudiants
- Support pour les devoirs individuels
- Affichage uniquement des devoirs disponibles
- Indication visuelle des devoirs individuels

### 4. `assets/js/API/Quiz/scheduler.js` (Nouveau)
- Vérification périodique des devoirs programmés
- Envoi automatique des devoirs (collectifs et individuels)
- Gestion des notifications différenciées
- Support pour les devoirs individuels

## Utilisation

### Pour les Administrateurs

1. **Créer un devoir collectif programmé** :
   - Cliquer sur "Créer un devoir"
   - Remplir les informations du devoir
   - Cocher "Planifier l'envoi du devoir"
   - Sélectionner la date et heure d'envoi
   - Optionnel : Définir une date limite de soumission
   - Cliquer sur "Créer"

2. **Créer un devoir individuel** :
   - Cliquer sur "Créer un devoir"
   - Remplir les informations du devoir
   - Cocher "Devoir individuel"
   - Sélectionner un étudiant spécifique
   - Optionnel : Planifier l'envoi et définir une date limite
   - Cliquer sur "Créer"

3. **Modifier un devoir** :
   - Cliquer sur l'icône de modification
   - Modifier les informations souhaitées
   - Ajuster la planification si nécessaire
   - Cliquer sur "Modifier"

4. **Surveiller les devoirs** :
   - Le tableau affiche le type, statut et dates de chaque devoir
   - Les devoirs individuels sont marqués en bleu
   - Les devoirs collectifs sont marqués en gris
   - Les devoirs programmés sont marqués en orange
   - Les devoirs envoyés sont marqués en vert
   - Les devoirs expirés sont marqués en rouge (Dépublié)
   - Rafraîchissement automatique des statuts toutes les 5 minutes

### Pour les Étudiants

- Les devoirs collectifs apparaissent automatiquement dans leur liste quand ils sont envoyés
- Les devoirs individuels n'apparaissent que pour l'étudiant concerné
- Les devoirs programmés n'apparaissent qu'à la date d'envoi prévue
- Les devoirs individuels sont marqués avec un badge "Individuel"
- Les devoirs expirés (date limite dépassée) disparaissent automatiquement de la liste
- Rafraîchissement automatique de la liste toutes les 5 minutes

## Configuration Backend Requise

### Endpoints API Nécessaires

1. **GET /api/homework/** - Récupérer les devoirs
2. **POST /api/homework/** - Créer un devoir
3. **PUT /api/homework/{id}/** - Modifier un devoir
4. **PATCH /api/homework/{id}/** - Mettre à jour le statut
5. **POST /api/send-homework-notifications/** - Envoyer les notifications

### Champs de Base de Données

```sql
ALTER TABLE homework ADD COLUMN scheduled_date DATETIME NULL;
ALTER TABLE homework ADD COLUMN is_scheduled BOOLEAN DEFAULT FALSE;
ALTER TABLE homework ADD COLUMN is_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE homework ADD COLUMN student INTEGER NULL;
ALTER TABLE homework ADD COLUMN end_date DATETIME NULL;
ALTER TABLE homework ADD COLUMN is_individual BOOLEAN DEFAULT FALSE;
```

## Sécurité

- Seuls les administrateurs peuvent programmer des devoirs
- Les teachers peuvent créer des devoirs mais sans planification
- Les étudiants ne voient que les devoirs qui leur sont destinés
- Les devoirs individuels ne sont visibles que par l'étudiant assigné
- Validation des dates pour éviter les erreurs de planification

## Notes Techniques

- Le planificateur fonctionne côté client et vérifie toutes les minutes
- Pour une production, il est recommandé d'implémenter un cron job côté serveur
- Les dates sont gérées en UTC côté serveur et converties en local côté client
- Support complet pour les devoirs individuels et collectifs
- Gestion différenciée des notifications selon le type de devoir
- Validation côté client et serveur pour éviter les erreurs
- Vérification automatique des dates limites toutes les 5 minutes
- Changement de statut automatique basé sur les dates limites
- Masquage automatique des devoirs expirés pour les étudiants
