<?php

require __DIR__.'/DbData.php';

$dbdata = new DBData();

$result = $dbdata->getBestScores();

echo (json_encode($result)) ;