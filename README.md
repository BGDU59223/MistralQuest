# ⚔️ Mistral Quest

Un gestionnaire de tâches gamifié façon Microsoft Planner, mais dans une vibe rétro pixel art aux couleurs de Mistral : chaque tâche accomplie fait gagner de l'XP et de l'or à ton héros, qui monte de niveau et s'achète du stuff.

## Lancer l'app

### En ligne (GitHub Pages)

L'app est déployée automatiquement à chaque push : **https://bgdu59223.github.io/MistralQuest/** — ouvre le lien, actualise après chaque modification poussée, c'est à jour.

### Version un seul fichier (aucune installation)

Ouvrir simplement `mistral-quest.html` dans un navigateur (double-clic). Tout est embarqué : styles, sprites, logique de jeu, sauvegarde localStorage.

### Version React (développement)

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5173

Build de production : `npm run build` · Aperçu : `npm run preview`

## Fonctionnalités

- **Board Kanban** (À faire / En cours / Terminé) avec glisser-déposer
- **Création de héros** : nom, genre (homme / femme), classes (magicien, guerrier, chasseur, assassin) et couleur de peau — modifiable à tout moment en double-cliquant sur le héros ; en sous-vêtements tant qu'il n'a rien équipé
- **Niveau de quête automatique** : calculé d'après le nombre de points à cocher — 0 point → Libre (0 XP), 1 → Facile (+10 XP), 2–3 → Moyenne (+25), 4–7 → Difficile (+50), 8 et plus → Boss (+120)
- **Barre de progression sur chaque quête** : verte puis jaune puis orange, elle se remplit à chaque étape cochée (0 → N)
- **Modale de quête** : checklist, étapes renommables (double-clic), libellés ajoutables/retirables, échéance modifiable, boutons « Fermer la fenêtre » (gauche) et « Terminer » (droite)
- **Échéances** : la tuile passe entièrement rouge avec texte blanc quand la date est dépassée
- **Libellés personnalisés** : création libre, attribution aux quêtes, code couleur
- **Progression** : barre d'XP, niveaux, titres (Novice → Légende du Mistral)
- **Or & boutique** : armes, armures, casques, bottes, familiers et thèmes de couleurs, avec raretés commun / rare / épique / légendaire
- **Retour en arrière** : bouton Retour depuis En cours vers À faire, et annulation d'une quête terminée (l'XP est rendue, perte de niveau possible)
- **Streak quotidien** : bonus d'XP croissant si tu complètes au moins une tâche par jour
- **Loot boxes** : 1 offerte tous les 3 niveaux, ou achetable pour 60 pièces d'or
- **10 succès** à débloquer
- **Stats hebdo** : graphique des 7 derniers jours
- **Archive** : les quêtes terminées peuvent être archivées par lot ou une à une, avec leur phrase RP
- **Sauvegarde locale** (localStorage) + export/import JSON, aucun compte requis

## Stack

Vite + React 18 + TypeScript, CSS artisanal, sprites pixel art générés en pur CSS (aucune image).
