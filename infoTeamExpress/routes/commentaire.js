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
                    title: 'affichage des commentaires',connected: req.session.connected, nomUser: req.session.nomUser, idUser: req.session.idUser, tabComN: auteurCommentaire, tabComD: dateCommentaire, tabComE: etatCommentaire, tabComC: contenuCommentaire, tabComI: idCommentaire
                });
            }



        });
    });
});
router.get('/affichageComArticle/:id', function (req, res, next) {
    let idArticle = req.params.id.substr(1);
    //idArticle.substr(1);
    let idCommentaire = [];
    let auteurCommentaire = [];
    let dateCommentaire = [];
    let etatCommentaire = [];
    let contenuCommentaire = [];
    let idPersonne = [];
    console.log(idArticle);
    req.getConnection(function (error, conn) {
        conn.query('select * from Commentaire, Article where Article.numArticle = Commentaire.idArticle and Commentaire.idArticle = ? ',[idArticle], function (err, result) {
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
                res.render('affichageComArticle', {
                    title: 'affichage des commentaires', connected: req.session.connected, nomUser: req.session.nomUser, idUser: req.session.idUser, tabComN: auteurCommentaire, tabComD: dateCommentaire, tabComE: etatCommentaire, tabComC: contenuCommentaire, tabComI: idCommentaire, prenomUser: req.session.prenomUser, typeUser: req.session.typeUser, idArticle : idArticle
                });
            }



        });
    });
});
//récupération des commentaires
router.post('/creation', function (req, res) {
    let idCommentaire = [];
    let auteurCommentaire = [];
    let dateCommentaire = [];
    let etatCommentaire = [];
    let contenuCommentaire = [];
    let idPersonne = [];

    var data = {
        auteurCommentaire: req.session.nomUser,

        contenuCommentaire: req.body.commentaire
    };

    req.getConnection(function (error, conn) {
        conn.query('insert into Commentaire(auteurCommentaire, contenuCommentaire, dateCommentaire) values(?,?, now()) ', [data.auteurCommentaire, data.contenuCommentaire], function (err, rows) {
            if (err) throw err;
            console.log("insertion reussie");

            res.render('commentaireAffichage',{
                title: 'affichage des commentaires', connected: req.session.connected, nomUser: req.session.nomUser, idUser: req.session.idUser, tabComN: auteurCommentaire, tabComD: dateCommentaire, tabComE: etatCommentaire, tabComC: contenuCommentaire, tabComI: idCommentaire
            });


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
router.get('/modifierLink/:id', function (req, res, next) {
    let idArticle = req.params.id;
    console.log(idArticle.substr(1));

    let idCommentaire = [];
    let auteurCommentaire = [];
    let dateCommentaire = [];
    let etatCommentaire = [];
    let contenuCommentaire = [];
    let idPersonne = [];

    req.getConnection(function (err, connection) {
        connection.query("Select * from Commentaire where auteurCommentaire = ? and idCommentaire = ? ", [auteurCommentaire, idCommentaire.substr(1)], function (err, result) {
            if (err) {
                throw err;
            } else {
                for (let i = 0; i < result.length; i++) {
                    idCommentaire[i] = result[i].idCommentaire;
                    auteurCommentaire[i] = result[i].auteurCommentaire;
                    dateCommentaire[i] = result[i].dateCommentaire;
                    etatCommentaire[i] = result[i].etatCommentaire;
                    contenuCommentaire[i] = result[i].contenuCommentaire;
                    idPersonne[i] = result[i].idPersonne;
                }
                res.render('affichageComArticle', {
                    title: 'affichage des articles', connected: req.session.connected, nomUser: req.session.nomUser, idUser: req.session.idUser, tabComN: auteurCommentaire, tabComD: dateCommentaire, tabComE: etatCommentaire, tabComC: contenuCommentaire, tabComI: idCommentaire, prenomUser: req.session.prenomUser, typeUser: req.session.typeUser, idArticle: idArticle
                });
            };
        });
    });
});
module.exports = router;
