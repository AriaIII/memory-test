# Memory

## Fonctionnalités

- Au commencement du jeu, des cartes sont disposées face cachée à l'écran.
- Le joueur doit cliquer sur deux cartes. Si celles-ci sont identiques, la paire est validée. Sinon, les cartes sont retournées face cachée et le joueur doit sélectionner une nouvelle paire de cartes.
- Un compteur de temps, avec une barre de progression, s’affiche en dessous du plateau.
- Le joueur gagne s'il arrive à découvrir toutes les paires avant la fin du temps imparti.
- Chaque temps de partie effectuée doit être sauvegardée en base de données.
Avant le début du jeu, les meilleurs temps s’affichent à l’écran.

## Installation

- Le script bdd-script.sh à lancer en ligne de commande permettra de créer la BDD et l'utilisateur qui lui est lié.
- Le point d'entrée du jeu se fait par le fichier index.html dans localhost
- technos : CSS avec Sass, Javascript et jQuery, HTML, PHP