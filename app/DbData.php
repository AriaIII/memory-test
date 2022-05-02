<?php

class DBData
{
    private $pdo;

    public function __construct()
    {
        $dsn = 'mysql:dbname=memory;host=localhost;charset=UTF8';
        $username = 'memory';
        $password = 'memory';

        try {
            // on crée la connexion à la BDD
            $this->pdo = new PDO($dsn, $username, $password, $options);
        } catch (\Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }


    public function setScore($score) 
    { 
        // on vérifie que la valeur reçue est numérique comprise entre 0 et 60, sinon on ne fait rien
        if (!is_numeric($score) && 0 < int_val($score) && int_val($score) < 60) {
            return null;
        }

        // on écrit la requête sql
        // on utilise un marqueur :score plutôt que la donnée directement
        $sqlQuery = 'INSERT INTO game(score) VALUES (:score)';

        // on prépare la requête. On va ainsi créer une sorte de template de requête 
        // qui n'attendra plus que les valeurs concrètes pour être exécutée.
        // une des raison de l'utilisation de la préparation des requête est la sécurité. 
        // elle permet d'éviter ce qu'on appelle l'injection SQL
        // mais la préparation permet aussi de gagner en performance
        $setScore = $this->pdo->prepare($sqlQuery);

        // on exécute la requête en passant la valeur de score
        $setScore->execute([
            'score' => $score
        ]);

        return true;

    }


    public function getBestScores() 
    {
        $sqlQuery = 'SELECT score FROM game ORDER BY score ASC LIMIT 5';

        $stmt  = $this->pdo->query($sqlQuery);
        $result = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

        return $result;

    }

}