var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var index = require('./routes/index');
var users = require('./routes/users');

var article = require('./routes/article');
var commentaire = require('./routes/commentaire');
var personne = require('./routes/personne');
var mail = require('./routes/mail');
var app = express();

/////////////npm install --save express-session
/////////////npm install --save express-validator 
var expressValidator = require('express-validator');
var expressSession = require('express-session');
///////////

//installation mysql
var mysql = require('mysql');

//connection my sql
var myConnection = require('express-myconnection');
var config = require('./config');
var params = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  port: config.database.port,
  database: config.database.db
};

app.use(myConnection(mysql, params, 'pool'))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

///////////
app.use(expressValidator());
app.use(expressSession({
  secret: 'max',
  saveUninitialized: false, resave: false
}));
/////////

app.use('/', index);
app.use('/users', users);
app.use('/article', article);
app.use('/commentaire', commentaire);
app.use('/personne', personne);
app.use('/mail',mail);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
