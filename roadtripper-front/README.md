# RoadTripper

Application web pour organiser ses road trips : un espace par voyage et un tableau Kanban (To Do / Doing / Done) pour suivre la préparation.
Projet du cours MOD8 - Advanced Web Programming (Concordia Continuing Education).

## Technologies

- Front-end : Vue 3, Vite, Vue Router, Pinia, Tailwind CSS, vuedraggable
- Back-end : Node.js (prévu, Milestone 3)
- Base de données : MySQL (prévu, Milestone 3)

## Lancer le front-end

```bash
git clone https://github.com/Morgane2468/RoadTripper.git
cd RoadTripper/roadtripper-front
npm install
npm run dev
```

Puis ouvrir http://localhost:5173/

## Où est quoi ? (dossier `roadtripper-front/src`)

| Dossier / fichier | Rôle |
|---|---|
| `views/` | Les pages : connexion, inscription, liste des voyages, Kanban d'un voyage |
| `components/` | Les morceaux de page réutilisables (barre de navigation, colonne Kanban, carte de tâche, fenêtres de création...) |
| `stores/auth.js` | Utilisateur connecté (email et token) |
| `stores/trips.js` | Voyages et tâches : ajout, suppression, changement de statut, progression |
| `router/index.js` | Liste des pages et protection des pages réservées aux utilisateurs connectés |
| `data/tripTemplates.js` | Tâches suggérées selon le type de voyage (Montagne, Plage...) |
| `mock/data.json` | Données de test de départ |
| `services/api.js` | Appels à l'API Node.js (pas encore utilisé, prévu pour le Milestone 3) |
| `assets/main.css` | Couleurs et polices du thème (Tailwind) |

## Fonctionnalités actuelles

- Inscription et connexion avec validation du formulaire (authentification simulée pour l'instant)
- Création de voyages avec plusieurs options : destination, dates, type, transport, budget, nombre de voyageurs...
- Tâches suggérées automatiquement selon le type de voyage, que l'utilisateur peut décocher
- Kanban à 3 colonnes avec glisser-déposer, catégories de tâches et barre de progression
- Pages protégées : il faut être connecté pour voir les voyages

## État du projet

Les données sont stockées dans le navigateur (localStorage) en attendant le back-end.
Au Milestone 3, elles seront enregistrées dans MySQL via une API Node.js, avec une vraie authentification par token.

## Équipe

Valentin, Morgane, Erwan, Mathieu