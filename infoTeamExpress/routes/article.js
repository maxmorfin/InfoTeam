var express = require('express');
var router = express.Router();


//GET
router.get('/', function (req, res, next) {
    res.render('article', { connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser})
});
router.get('/ajouter', function(req,res,next){
    res.render('articleAjouter', { 
        connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser
    })
});
router.get('/afficher', function(req,res,next){
    let numArticle = [];
    let titre = [];
    let auteurArticle = [];
    let tag = [];
    let datePublication = [];
    let etat = [];
    let nbVue = [];
    let contenuArticle = [];

    req.getConnection(function(err, connection){
        connection.query("Select * from Article",function(err,result){
            if(err){
                throw err;
            }else {
                for (let i = 0; i < result.length; i++){
                    numArticle[i] = result[i].numArticle;
                    titre[i] = result[i].titre;
                    auteurArticle[i] = result[i].auteurArticle;
                    tag[i] = result[i].tag;
                    datePublication[i] = result[i].datePublication;
                    etat[i] = result[i].etat;
                    nbVue[i] = result[i].nbVue;
                    contenuArticle[i] = result[i].contenuArticle;
                }
                res.render('articleAfficher', {
                    title: 'affichage des articles', tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser
                });
            };
        });
    });
});
router.get('/modifier', function (req, res, next) {
    let numArticle = [];
    let titre = [];
    let auteurArticle = [req.session.nomUser];
    let tag = [];
    let datePublication = [];
    let etat = [];
    let nbVue = [];
    let contenuArticle = [];

    req.getConnection(function (err, connection) {
        connection.query("Select * from Article where auteurArticle = ?",auteurArticle, function (err, result) {
            if (err) {
                throw err;
            } else {
                for (let i = 0; i < result.length; i++) {
                    numArticle[i] = result[i].numArticle;
                    titre[i] = result[i].titre;
                    auteurArticle[i] = result[i].auteurArticle;
                    tag[i] = result[i].tag;
                    datePublication[i] = result[i].datePublication;
                    etat[i] = result[i].etat;
                    nbVue[i] = result[i].nbVue;
                    contenuArticle[i] = result[i].contenuArticle;
                }
                res.render('articleModifier', {
                    title: 'affichage des articles', tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser
                });
            };
        });
    });
});
router.get('/modification/:id', function (req, res, next) {
    let idArticle = req.params.id;
    console.log(idArticle.substr(1));
    
    let numArticle = [];
    let titre = [];
    let auteurArticle = [req.session.nomUser];
    let tag = [];
    let datePublication = [];
    let etat = [];
    let nbVue = [];
    let contenuArticle = [];

    req.getConnection(function (err, connection) {
        connection.query("Select * from Article where auteurArticle = ? and numArticle = ? ",[auteurArticle, idArticle.substr(1)], function (err, result) {
            if (err) {
                throw err;
            } else {
                for (let i = 0; i < result.length; i++) {
                    numArticle[i] = result[i].numArticle;
                    titre[i] = result[i].titre;
                    auteurArticle[i] = result[i].auteurArticle;
                    tag[i] = result[i].tag;
                    datePublication[i] = result[i].datePublication;
                    etat[i] = result[i].etat;
                    nbVue[i] = result[i].nbVue;
                    contenuArticle[i] = result[i].contenuArticle;
                }
                res.render('articleModification', {
                    title: 'affichage des articles', tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser
                });
            };
        });
    });
});
router.get('/suppression/:id', function (req, res, next) {
    let idArticle = req.params.id;
    console.log(idArticle.substr(1));

    let numArticle = [];
    let titre = [];
    let auteurArticle = [req.session.nomUser];
    let tag = [];
    let datePublication = [];
    let etat = [];
    let nbVue = [];
    let contenuArticle = [];

    req.getConnection(function (err, connection) {
        connection.query("Select * from Article where auteurArticle = ? and numArticle = ? ", [auteurArticle, idArticle.substr(1)], function (err, result) {
            if (err) {
                throw err;
            } else {
                for (let i = 0; i < result.length; i++) {
                    numArticle[i] = result[i].numArticle;
                    titre[i] = result[i].titre;
                    auteurArticle[i] = result[i].auteurArticle;
                    tag[i] = result[i].tag;
                    datePublication[i] = result[i].datePublication;
                    etat[i] = result[i].etat;
                    nbVue[i] = result[i].nbVue;
                    contenuArticle[i] = result[i].contenuArticle;
                }
                res.render('articleSupprimer', {
                    title: 'affichage des articles', tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser
                });
            };
        });
    });
});
router.get('/economie', function (req, res, next) {
    let numArticle = [];
    let titre = [];
    let auteurArticle = [];
    let tag = [];
    let datePublication = [];
    let etat = [];
    let nbVue = [];
    let contenuArticle = [];

    req.getConnection(function (err, connection) {
        connection.query("Select * from Article where tag = 'economie'", function (err, result) {
            if (err) {
                throw err;
            } else {
                for (let i = 0; i < result.length; i++) {
                    numArticle[i] = result[i].numArticle;
                    titre[i] = result[i].titre;
                    auteurArticle[i] = result[i].auteurArticle;
                    tag[i] = result[i].tag;
                    datePublication[i] = result[i].datePublication;
                    etat[i] = result[i].etat;
                    nbVue[i] = result[i].nbVue;
                    contenuArticle[i] = result[i].contenuArticle;
                }
                res.render('tagEconomie', {
                    title: 'affichage des articles', tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser
                });
            };
        });
    });
});
router.get('/voyage', function (req, res, next) {
    let numArticle = [];
    let titre = [];
    let auteurArticle = [];
    let tag = [];
    let datePublication = [];
    let etat = [];
    let nbVue = [];
    let contenuArticle = [];

    req.getConnection(function (err, connection) {
        connection.query("Select * from Article where tag = 'voyage'", function (err, result) {
            if (err) {
                throw err;
            } else {
                for (let i = 0; i < result.length; i++) {
                    numArticle[i] = result[i].numArticle;
                    titre[i] = result[i].titre;
                    auteurArticle[i] = result[i].auteurArticle;
                    tag[i] = result[i].tag;
                    datePublication[i] = result[i].datePublication;
                    etat[i] = result[i].etat;
                    nbVue[i] = result[i].nbVue;
                    contenuArticle[i] = result[i].contenuArticle;
                }
                res.render('tagVoyage', {
                    title: 'affichage des articles', tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser
                });
            };
        });
    });
});
router.get('/sport', function (req, res, next) {
    let numArticle = [];
    let titre = [];
    let auteurArticle = [];
    let tag = [];
    let datePublication = [];
    let etat = [];
    let nbVue = [];
    let contenuArticle = [];

    req.getConnection(function (err, connection) {
        connection.query("Select * from Article where tag = 'sport'", function (err, result) {
            if (err) {
                throw err;
            } else {
                for (let i = 0; i < result.length; i++) {
                    numArticle[i] = result[i].numArticle;
                    titre[i] = result[i].titre;
                    auteurArticle[i] = result[i].auteurArticle;
                    tag[i] = result[i].tag;
                    datePublication[i] = result[i].datePublication;
                    etat[i] = result[i].etat;
                    nbVue[i] = result[i].nbVue;
                    contenuArticle[i] = result[i].contenuArticle;
                }
                res.render('tagSport', {
                    title: 'affichage des articles', tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser
                });
            };
        });
    });
});

//POST
router.post('/ajouter', (req,res) => {
    var data = {
        titre : req.body.titre,
        auteurArticle : req.session.nomUser,
        tag : req.body.tag,
        contenuArticle : req.body.contenuArticle
    };
    req.getConnection(function (err, connection) {
        connection.query("Insert into article (titre, auteurArticle, tag, datePublication, contenuArticle) values (?,?,?,now(),?)", [data.titre, data.auteurArticle, data.tag, data.contenuArticle], function(err, rows) {
        if (err) throw err;
        console.log('insertion reussit');
    })
    res.render('articleAjouter', {
        connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser
    });
});
});
router.post('/modification/:id', (req,res) => {
    let idArticle = req.params.id;
    let data = {
        titre : req.body.titre,
        auteurArticle : req.session.nomUser,
        tag : req.body.tag,
        contenuArticle : req.body.contenuArticle
    };
    req.getConnection(function (err, connection){
        connection.query("Update Article set titre=?, auteurArticle=?, tag=?, datePublication=now(), contenuArticle=? where numArticle = ? ", [data.titre, data.auteurArticle, data.tag, data.contenuArticle, idArticle.substr(1)], function(err,rows){
            if (err) throw err;
            console.log('modification reussit'); 
        });
        res.redirect('/article/modifier');
    });
});
router.post('/suppression/:id', (req,res)=>{
    let idArticle = req.params.id;
    let data = {
        titre : req.body.titre,
        auteurArticle : req.session.nomUser,
        tag : req.body.tag,
        contenuArticle : req.body.contenuArticle
    };
    req.getConnection(function (err, connection){
        connection.query("Delete from Article where numArticle = ? ", [idArticle.substr(1)], function(err,rows){
            if (err) throw err;
            console.log('suppression effectuer');
        });
        res.redirect('/article/modifier');
    });
});

module.exports = router;

