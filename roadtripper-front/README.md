# RoadTripper 🚗

Application web pour organiser ses road trips : un espace par voyage et un tableau Kanban (To Do / Doing / Done) pour suivre la préparation. Projet du cours MOD8 – Advanced Web Programming.

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

## Fonctionnalités actuelles

- Inscription et connexion avec validation (authentification simulée pour l'instant)
- Création et suppression de voyages
- Kanban à 3 colonnes avec drag & drop, badges de catégories, barre de progression
- Création et suppression de tâches
- Pages protégées par une garde de navigation

## État du projet

Les données sont stockées dans le navigateur (localStorage) en attendant le back-end.

## Équipe

Valentin, Morgane, Erwan, Mathieu