var express = require('express');
var router = express.Router();


//GET
router.get('/', function(req,res,next){
    res.render('article')
});
router.get('/ajouter', function(req,res,next){
    res.render('ajouter')
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
                res.render('afficher', {
                    title: 'affichage des articles', tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle
                });
            };
        });
    });
});
router.get('/modifier', function (req, res, next) {
    let numArticle = [];
    let titre = [];
    let auteurArticle = [];
    let tag = [];
    let datePublication = [];
    let etat = [];
    let nbVue = [];
    let contenuArticle = [];

    req.getConnection(function (err, connection) {
        connection.query("Select * from Article where auteurArticle = 'morfin'", function (err, result) {
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
                res.render('modifier', {
                    title: 'affichage des articles', tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle
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
    let auteurArticle = [];
    let tag = [];
    let datePublication = [];
    let etat = [];
    let nbVue = [];
    let contenuArticle = [];

    req.getConnection(function (err, connection) {
        connection.query("Select * from Article where auteurArticle = 'morfin' and numArticle = ? ",[idArticle.substr(1)], function (err, result) {
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
                res.render('modification', {
                    title: 'affichage des articles', tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle
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
    let auteurArticle = [];
    let tag = [];
    let datePublication = [];
    let etat = [];
    let nbVue = [];
    let contenuArticle = [];

    req.getConnection(function (err, connection) {
        connection.query("Select * from Article where auteurArticle = 'morfin' and numArticle = ? ", [idArticle.substr(1)], function (err, result) {
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
                res.render('suppression', {
                    title: 'affichage des articles', tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle
                });
            };
        });
    });
});

//POST
router.post('/ajouter', (req,res) => {
    var data = {
        titre : req.body.titre,
        auteurArticle : 'morfin',
        tag : req.body.tag,
        contenuArticle : req.body.contenuArticle
    };
    req.getConnection(function (err, connection) {
    connection.query("Insert into article set ? ", data, function(err, rows) {
        if (err) throw err;
        console.log('insertion reussit');
    })
    res.render('ajouter')
});
});
router.post('/modification/:id', (req,res) => {
    let idArticle = req.params.id;
    let data = {
        titre : req.body.titre,
        auteurArticle : 'morfin',
        tag : req.body.tag,
        contenuArticle : req.body.contenuArticle
    };
    req.getConnection(function (err, connection){
        connection.query("Update Article set ? where numArticle = ? ",[data, idArticle.substr(1)], function(err,rows){
            if (err) throw err;
            console.log('modification reussit'); 
        });
        res.redirect('/article/afficher');
    });
});
router.post('/suppression/:id', (req,res)=>{
    let idArticle = req.params.id;
    let data = {
        titre : req.body.titre,
        auteurArticle : 'morfin',
        tag : req.body.tag,
        contenuArticle : req.body.contenuArticle
    };
    req.getConnection(function (err, connection){
        connection.query("Delete from Article where numArticle = ? ", [idArticle.substr(1)], function(err,rows){
            if (err) throw err;
            console.log('suppression effectuer');
        });
        res.redirect('/article/afficher');
    });
});

module.exports = router;

