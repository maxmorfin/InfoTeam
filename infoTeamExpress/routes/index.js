var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/commentaire', function(req, res, next){
  res.render('commentaire')
})
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
