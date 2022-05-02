#!/bin/bash

# il faut lancer le script en sudo pour pouvoir créer l'utilisateur donc on affiche une erreur si l'utilisateur n'est pas root
if [ $(id -u) -ne 0 ] 
then
echo "You must be root to run this script"
exit 1
fi 

# on crée la database et l'utilisateur pour cette base puis la table game dans la database
# on vérifie avant la création que l'utilisateur ou la base n'existe pas et si oui, on la supprime
mysql <<EOF
DROP DATABASE IF EXISTS memory;
CREATE DATABASE memory;
DROP USER IF EXISTS 'memory'@'localhost';
CREATE USER 'memory'@'localhost' IDENTIFIED BY 'memory';
GRANT ALL ON memory.* TO 'memory'@'localhost';
FLUSH PRIVILEGES;
USE memory;
CREATE TABLE game (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, score INT);

EOF
