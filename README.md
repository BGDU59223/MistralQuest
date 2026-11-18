# ⚔️ Mistral Quest

Un gestionnaire de tâches gamifié façon Microsoft Planner, mais dans une vibe rétro pixel art aux couleurs de Mistral : chaque tâche accomplie fait gagner de l'XP et de l'or à ton héros, qui monte de niveau et s'achète du stuff.

## Lancer l'app

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5173

Build de production : `npm run build` · Aperçu : `npm run preview`

## Fonctionnalités

- **Board Kanban** (À faire / En cours / Terminé) avec glisser-déposer
- **4 difficultés de tâches** : Facile (+10 XP), Moyenne (+25), Difficile (+55), Boss (+140)
- **Progression** : barre d'XP, niveaux, titres (Novice → Légende du Mistral)
- **Or & boutique** : chapeaux, capes, familiers (dont le renard pixel 🦊) et thèmes de couleurs, avec raretés commun / rare / épique / légendaire
- **Boss fights** : un gros projet = un boss avec des PV ; chaque sous-tâche terminée lui inflige des dégâts
- **Streak quotidien** : bonus d'XP croissant si tu complètes au moins une tâche par jour
- **Loot boxes** : 1 offerte tous les 3 niveaux, ou achetable pour 60 pièces d'or
- **10 succès** à débloquer
- **Stats hebdo** : graphique des 7 derniers jours
- **Sauvegarde locale** (localStorage), aucun compte requis

## Stack

Vite + React 18 + TypeScript, CSS artisanal, sprites pixel art générés en pur CSS (aucune image).
