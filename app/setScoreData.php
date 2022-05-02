<?php
// on intègre le fichier DbData.php
require __DIR__.'/DbData.php';

// on instancie la class DbData
$dbdata = new DBData();

// on appelle la fonction setScore en lui passant la valeur de score reçue dans la variable $_POST
$dbdata->setScore($_POST['score']);


