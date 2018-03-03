var express = require('express');
var router = express.Router();



/* GET home page. */


router.get('/', function (req, res, next) {
  let numArticle = [];
  let titre = [];
  let auteurArticle = [];
  let tag = [];
  let datePublication = [];
  let etat = [];
  let nbVue = [];
  let contenuArticle = [];
  if (req.session.connected == undefined){
    req.session.connected = false;
  }
  let x = req.session.connected;
  console.log(x, 'cest la valeur de x');
  req.getConnection(function (err, connection) {
    connection.query("Select * from Article", function (err, result) {
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
         res.render('index', {
          title: 'Accueil', connected: x, errors: req.session.errors, idUser: req.session.idUser, typeUser: req.session.typeUser, tabN: numArticle, tabT: titre, tabA: auteurArticle, tabTag: tag, tabD: datePublication, tabE: etat, tabV: nbVue, tabC: contenuArticle, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser
         });
        //res.render('index');
      };
    });
  });
});
router.get('/commentaire', function(req, res, next){
  res.render('commentaire')
});


router.get('/personne', function (req, res, next) {
  res.render('personne', { title: 'Express' });
});

module.exports = router;
