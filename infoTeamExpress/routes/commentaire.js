var express = require('express');
var router = express.Router();

//Affichage des commentaires
router.get('/affichage', function (req, res, next) {

    let idCommentaire = [];
    let auteurCommentaire = [];
    let dateCommentaire = [];
    let etatCommentaire = [];
    let contenuCommentaire = [];
    let idPersonne = [];

    req.getConnection(function (error, conn) {
        conn.query('select * from Commentaire', function (err, result) {
            if (err) {
                console.log(err);
            } else {
                for (let i = 0; i < result.length; i++) {
                    idCommentaire[i] = result[i].idCommentaire;
                    auteurCommentaire[i] = result[i].auteurCommentaire;
                    dateCommentaire[i] = result[i].dateCommentaire;
                    etatCommentaire[i] = result[i].etatCommentaire;
                    contenuCommentaire[i] = result[i].contenuCommentaire;
                    idPersonne[i] = result[i].idPersonne;
                }
                res.render('commentaireAffichage', {
                    title: 'affichage des commentaires', tabN: auteurCommentaire, tabD: dateCommentaire, tabE: etatCommentaire, tabC: contenuCommentaire, tabI: idCommentaire
                });
            }



        });
    });

});
//récupération des commentaires
router.post('/creation', function (req, res) {


    var data = {
        auteurCommentaire: req.body.prenom,

        contenuCommentaire: req.body.commentaire
    };

    req.getConnection(function (error, conn) {
        conn.query('insert into Commentaire(auteurCommentaire, contenuCommentaire, dateCommentaire) values(?,?, now()) ', [data.auteurCommentaire, data.contenuCommentaire], function (err, rows) {
            if (err) throw err;
            console.log("insertion reussie");

            res.redirect('/')


        });
    });
});
//supprimer un commentaire
router.post('/supplink/:id', function (req, res) {



    idCommentaire = req.params.id;
    req.getConnection(function (error, conn) {
        conn.query('Delete from Commentaire where idCommentaire  = ? ', [idCommentaire.substr(1)], function (err, rows) {
            if (err) throw err;
            console.log("suppression reussie");
            res.redirect('/')


        });
    });
});


//modification d'un commentaire
router.post('/modiflink/:id', function (req, res) {


    idCommentaire = req.params.id;
    var data = {
        auteurCommentaire: req.body.prenom,
        contenuCommentaire: req.body.commentaire,

    };
    req.getConnection(function (error, conn) {
        conn.query('Update Commentaire set auteurCommentaire =?, dateCommentaire=now(),contenuCommentaire=? where idCommentaire =  ? ', [data.auteurCommentaire, data.contenuCommentaire, idCommentaire.substr(1)], function (err, rows) { //
            if (err) throw err;
            console.log("modification reussie");
            res.redirect('/')
        });
    });
});

module.exports = router;
