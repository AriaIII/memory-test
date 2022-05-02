var app= {
    // nombre de paires de cartes pour la partie
    nbPair: 14,
    // variables dans lesquelles on stocke les cartes retournées
    firstCard: null,
    secondCard: null,
    // les div qui contiennent les images
    images: [],
    // le nb de clic du joueur, égal à 2 max puis remis à 0
    nbClick: 0,
    // compteur qui va permettre de savoir combien de cartes ont été retournées
    nbReturnedCards: 0,
    // valeur de la balise progress dans le html
    progressValue: 0,
    // durée de la partie gagnée envoyée en base
    score: 0,
    // liste des scores récupérés en base
    scores: null,
    // temps limit de la partie en secondes
    maxTime: 60,
    // élément html progress
    progressBar: $("progress"),
    // chronomètre lancé pour la partie
    timer: null,


    init: function () {
        // on fait une requête ajax pour récupérer les meilleurs scores des parties précédentes
        app.getHighScore();
        // toutes les classes card dans board lance la fonction play lors d'un clic
        $('#board').on('click', '.card', app.play);
        // on génère les cartes pour le jeu
        app.generateCards();
        // on les inclut dans la page
        app.appendCards();
        // on lance la partie : le timer démarre au premier clic sur le plateau
       $( "#board" ).one( "click", function() {
        app.startTimer();            
    });

    },

    getHighScore: function () {
        $.ajax({
            // le type de la requête, GET pour récupérer les données en base
            type: "GET",
            // on récupère du json
            dataType: 'json',    
            // le fichier php qui va traiter la requête
            url: '../app/getScoreData.php',
            success: function(data, textStatus, jqXHR) {
                scores = data;
                // on vérifie qu'il n'y a pas d'erreur sur la requête
                if (!("error" in scores)) {
                    // on affiche dans une popup les scores
                    alert("Voici les meilleurs scores :\n" + scores.join("\n") + "\nA toi de faire mieux ;)");
                }
            },
        });
    },

    // pour mélanger, on utilise l'algorithme de Fisher-Yates qui permet de mélanger un tableau
    // https://fr.wikipedia.org/wiki/M%C3%A9lange_de_Fisher-Yates
    fisherYatesShuffle: function (arr){
        for(var i =arr.length-1 ; i>0 ;i--){
            var j = Math.floor( Math.random() * (i + 1) );
            [arr[i],arr[j]]=[arr[j],arr[i]];
        }
    },

    generateCards : function () {
        // on génère un tableau qui contiendra nbPair div avec des images différentes
        for(var i = 0; i<app.nbPair; i++) {
            element = "<div class='card'> <div class='image' style ='background-position: 0 -" + i * 100 + "px'></div> <div class='hidden'></div> </div>";
            // on a besoin de paires donc on injecte 2 fois les données dans le tableau
            app.images.push(element);
            app.images.push(element);
        }
    },

    appendCards: function() {
        // on efface les images s'il y en a
        $("#board").html('');
        // on mélange le tableau pour que les paires soient séparées
        app.fisherYatesShuffle(app.images);
        // on boucle sur le tableau pour insérer chaque div dans le plateau de jeu
        app.images.forEach(element => {
            $("#board").append(element);
        });
    },

    // on utilise le css pour afficher l'un ou l'autre des enfants
    showCard : function(card) {
        card.children(".image").css("display", "block");
        card.children(".hidden").css("display", "none");
    },

    hideCard : function(card) {
        card.children(".image").css("display", "none");
        card.children(".hidden").css("display", "block");
    },

    reset: function(){
        // réinitialisation du jeu pour une nouvelle partie
        app.score=0;
        app.nbReturnedCards=0;
        app.nbClick=0;
        app.firstCard=null;
        app.secondCard=null;
        app.progressValue=0;
        // on récupère les meilleurs temps
        app.getHighScore();
        // on insère les images
        app.appendCards();
        // on démarre le timer au premier clic sur le plateau
        $( "#board" ).one( "click", function() {
            app.startTimer();            
        });
    },

    lost: function(){
        // on affiche une pop up
        window.alert("Vous avez perdu :/");
        // on relance le jeu
        app.reset();
    },

    won: function() {        
        // on affiche une pop up
        window.alert("Vous avez gagnééééééééééééééééééé !");
        
        // on stocke la valeur du timer pour pouvoir l'enregistrer en base
        app.score = app.progressValue;

        // on fait une requête ajax par laquelle on envoie la donnée score au script php qui va la persister en base
        $.ajax({
            // le type de la requête, post pour envoyer des données en base
            type: "POST",
            // le fichier php qui va traiter la requête
            url: '../app/setScoreData.php',
            // les données que l'on veux transmettre
            data: {score : app.score},
        })
        // quand la requête est terminée on peut relancer la partie
        .done(function() {
            // on remet la page à son état de départ
            app.reset();
        });
    },

    stopTimer: function() {
        // on reinitialise le timer à zéro
        app.changeProgressValue(0);
        clearInterval(app.timer);
    },
    
    changeProgressValue: function(value) {
        // on transmet la valeur de la progression à la balise progress
        app.progressBar.val(value);
    },
    
    startTimer: function() {
        // avec setInterval, on lance l'incrémentation du compteur toutes les secondes (1000 millisecondes)
        app.timer = setInterval(function() {
           // on incrémente la valeur de la barre de progression
           app.changeProgressValue(app.progressValue ++);
           // si on atteint le temps limite, on a perdu
            if (app.progressValue === app.maxTime) {
                app.stopTimer();
                app.lost();
            }
        }, 1000);
    },

    play : function () {
        app.showCard($(this));
            
        // on incrémente le nb de clics
        app.nbClick ++
        // pour la première carte,
        if (app.nbClick === 1) {
            // on stocke la valeur de la première carte
            app.firstCard = $(this);
            // on bloque le clic sur la carte déjà retournée
            app.firstCard.css("pointer-events", "none");

        // pour la deuxième carte
        }else if (app.nbClick === 2) {
            // on stocke sa valeur
            app.secondCard = $(this);
            // on blocque le clic
            app.secondCard.css("pointer-events", "none");

            // on bloque les clics sur les cartes dès que 2 cartes sont retournées
            $(".card").css("pointer-events", "none");
            // on réinitialise les 2 clicks
            app.nbClick = 0;

            // on compare les images en utilisant la propriété background-position
            if (app.firstCard.children(".image").css("background-position") === app.secondCard.children(".image").css("background-position")) {
                // on empêche de pouvoir cliquer à nouveau sur les cartes gagnées en changeant la class de la carte
                app.firstCard.removeClass("card").addClass("wincard");
                app.secondCard.removeClass("card").addClass("wincard");
                $(".wincard").css("pointer-events", "none");
                // on réautorise le clic sur les autres cartes
                $(".card").css("pointer-events", "auto")

                // on doit tester si toutes les cartes ont été retournées pour savoir quand on gagne
                app.nbReturnedCards ++;
                // quand on atteint nbPair paires retournées, on a gagné
                if (app.nbReturnedCards === app.nbPair) {
                    // on arrête le timer
                    app.stopTimer();
                    app.won();
                }

            } else {
                // on laisse une seconde au joueur pour mémoriser les cartes et on les retourne
                // on rend également la main pour cliquer
                window.setTimeout(function() {
                    $(".card").css("pointer-events", "auto");
                    app.hideCard(app.firstCard);
                    app.hideCard(app.secondCard);
                }, 1000)
            }
        }
    },
  
 };
// on initialise le jeu quand le contenu de la page est chargé
 document.addEventListener('DOMContentLoaded', app.init);