# Task Quest — Découpage du projet en sessions de travail

> Unité de session = 1 chantier réalisable en **1 à 2 h** de travail assisté.
> Statuts : `à faire` · `en cours` · `fait` · `bloqué` · `rangé (à valider)` = ne démarre que sur feu vert explicite.

## État du projet (résumé)

1. **Task Quest** = suivi de tâches gamifié, livré en un **fichier unique** `mistral-quest.html` (4 570 lignes, 268 Ko, vanilla JS, zéro build), déployé automatiquement sur GitHub Pages depuis `main` (workflow `pages.yml`).
2. **App principale complète et validée** : quêtes auto-niveau, filtres, récurrences, chrono avec fenêtre PiP, héros personnalisable, boutique (21 objets), Stuff, export/import, sons.
3. **Le Château (roguelite) fonctionnel** : 8 combos animaux façon champion select (Z actif / E passif / roulade), lame en couche séparée + miroir exact, hitboxes généreuses, boss avec flash d'annonce et boule de feu renvoyable, onglet plein écran `?castle=1`.
4. **Qualité** : 259 assertions vertes sur 5 suites jsdom (hors dépôt, dans `/tmp` — risque de perte), déploiement continu avec re-jeu manuel en cas d'incident API artefacts.
5. **En attente** : « gagner des combos en jouant » (architecture prête), code mort React dans `src/` (~84 Ko), rangés à re-valider (mana, pouvoirs par classe, boss spéciaux, équilibrage, voix), puis le portage Godot.

## Les sessions

| # | Session | Objectif précis & testable | Fichiers / zones | Dépendances | Taille | Statut |
|---|---|---|---|---|---|---|
| 1 | 🗳️ **Audit d'inventaire** | Checklist live de tout ce qui est demandé/implémenté/rangé (tri échéances, sons, mana, voix…) validée ; README à jour (usage, archi, déploiement) | `README.md`, `mistral-quest.html` (lecture seule) | aucune | S | à faire |
| 2 | ✅ **Tests dans le dépôt + CI** | Les 5 suites déplacées dans le repo (`tests/`), `npm test` qui lance tout, GitHub Action à chaque push (déploiement refusé si rouge) | `tests/*.js` (depuis `/tmp/jsdomtest`), `package.json`, nouveau `.github/workflows/tests.yml` | 1 (pour figer la liste) | M | à faire |
| 3 | 🧹 **Nettoyage du dépôt** | Suppression du React mort (`src/`, `tsconfig.json`, `vite.config.ts`, `index.html` racine si doublon) ; Pages toujours vertes après | `src/` (84 Ko), `tsconfig.json`, `vite.config.ts` | 2 (la CI protège la suppression) | S | à faire |
| 4 | 🃏 **Gagner des combos en jouant** | Combos verrouillés/débloqués : seuils par profondeur de salles (ex. 3/6/10/15+), cartes grises + cadenas dans picker & galerie, déverrouillage persisté, toast de victoire | `MAGIC_SPELLS`/`COMBOS` (~l. 1332-1370), `dungeonComboPickerHTML`, `magicView`, `state.combosUnlocked`, `dungeonEnd` | 1 (seuils à valider ensemble) | M | à faire |
| 5 | 💰 **Boucle économie Château ↔ quêtes** | L'or pillé + fin de run alimente clairement le compte principal ; écran de fin avec gains détaillés ; équilibrage loot or | `dungeonEnd`, `grantReward`, `dungeonRunHTML` (bloc résultats), boutique | 4 (le déverrouillage complète l'écran de fin) | S | à faire |
| 6 | 📱 **Château mobile & tactile** | Roulade/déplacement/sorts jouables au doigt en plein écran, viewport collé aux bords mobiles, HUD lisible sur petit écran | CSS `.castle-win`, `.dg-controls`, handlers touch | 3 | M | à faire |
| 7 | 👐 **Tutoriel & aide au 1er lancement** | Au 1er démarrage : écran d'accueil expliquant quêtes → or → stuff → combos ; aide dans chaque écran | `state.firstRun`, vues `dungeonView`, hub, picker | 1 | S | à faire |
| 8 | ⏱️ **Stats & temps de jeu** | Temps passé réellement joué au Château et par partie visible dans l'écran Stats ; meilleur run, monstres tués | `state.stats`, `dungeonTick` (accumulation), écran Stats | aucune | S | à faire |
| 9 | 🔧 **Rendu optimisé du combat** | Fin des re-rendus innerHTML complets à chaque tick (50 ms) : couches stables (héros, monstres) mises à jour ciblées ; partie de 10 min sans dérive mémoire | `dungeonRender`, `dungeonTick` | 2 | M-L | à faire |
| 10 | ⚖️ **Équilibrage difficulté** (rangé — à re-valider) | Courbes PV/dégâts/or par salle jouables en continu jusqu'au boss 1 sans frustration ; grille d'équilibrage documentée | `DG_MONS`, `dungeonSetupRoom`, spawn boss | 5, 9 + retour de ta partie | M | rangé (à valider) |
| 11 | 👾 **Boss spéciaux & variété** (rangé — à re-valider) | 2-3 patterns de boss distincts (invocations, volées de projectiles, téléport?) annoncés par leur propre flash | `dungeonBossTick`, sprites `DG_SPRITES`, `bossflash` | 10 | M-L | rangé (à valider) |
| 12 | ✨ **Pouvoirs par classe & mana** (rangé — à re-valider) | Après validation : soit mana budgétant les sorts actifs, soit passifs de classe au choix du héros (guerrier/mage/assassin/chasseur déjà créables) | `MAGIC_SPELLS`, `CLASSES`, création héros, HUD | 4, 10 ; **décision utilisateur préalable** | M-L | rangé (à valider) |
| 13 | 📋 **Audit de portage Godot** | Fiche de portage : liste figée des mécaniques, formats de données (JSON save → Resource), extraction des PNG/base64 en assets, mapping écran→scènes Godot, version Godot cible | `mistral-quest.html` (analyse), nouvelle doc `docs/godot-port.md`, export assets | 1-12 figés (état de référence stable) | S | à faire |
| 14 | 🚀 **Bascule vers Godot — cœur jouable** | Projet Godot initial : sauvegarde/chargement du save JSON existant + une scène jouable (le Château au minimum : déplacement, frappe, 1 combo) ; critère de fin : tu joues au Château dans Godot exportable | Nouveau dossier Godot dans le repo (ou repo dédié — à trancher), assets extraits en 13 | **13 impératif** ; tout le reste | L | à faire |

**Ordre recommandé** : 1 → 2 → 3 → 4 → 5 (socle autonome) ; 6-8 indépendantes, à prendre dans l'ordre qui arrange ; 9-12 = chantiers gameplay sous réserve de tes retours de test + décisions sur les rangés ; **13 puis 14** terminent le projet sur la bascule Godot.
