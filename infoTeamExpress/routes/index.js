var express = require('express');
var router = express.Router();



/* GET home page. */


router.get('/', function (req, res, next) {
  if (req.session.connected == undefined){
    req.session.connected = false;
  }
  let x = req.session.connected;
  console.log(x, 'cest la valeur de x alors marche ta raaaace');
  
  res.render('index', {
    title: 'Accueil', connected:x, errors: req.session.errors, idUser: req.session.idUser, typeUser: req.session.typeUser
  });
});
router.get('/commentaire', function(req, res, next){
  res.render('commentaire')
});


router.get('/personne', function (req, res, next) {
  res.render('personne', { title: 'Express' });
});

module.exports = router;
