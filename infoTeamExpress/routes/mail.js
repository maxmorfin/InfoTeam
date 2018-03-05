//var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'infoTeamRoger@gmail.com',
//       pass: 'infoteam13100'
//     }
//   });

//   var mailOptions = {
//     from: 'infoTeamRoger@gmail.com',
//     to: 'aureliencrest@icloud.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });

router.get('/newsletter', function (req, res, next) {


    let num = req.session.idUser;

    req.getConnection(function (error, conn) {
        conn.query('select abonne from personne where id = ? ', [num], function (err, result) {
            if (err) {
                console.log(err);
            } else {
                let answer = result[0].abonne;
                let nona;
                let ouia;
                if (answer == 0) {
                    nona = 'checked';
                    ouia = '';
                } else {
                    ouia = 'checked';
                    nona = '';
                }
                res.render('newsletter', {
                    title: 'abonnez vous', connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser, ouiabonne: ouia, nonabonne: nona, toggleabonne: -1
                });
            }



        });
    });

});


router.post('/abonnement', function (req, res, next) {

    let num = req.session.idUser;

    req.getConnection(function (error, conn) {
        conn.query('select abonne from personne where id = ? ', [num], function (err, result) {
            if (err) {
                throw err;
            } else {
                if (result[0].abonne != req.body.x) {
                    conn.query('update personne set abonne = ? where id = ? ', [req.body.x, num], function (err, result2) {
                        if (err)
                            throw err;
                        let toggleabonne;
                        if (req.body.x == 0) {
                            nona = 'checked';
                            ouia = '';
                            toggleabonne = 0;
                        } else {
                            ouia = 'checked';
                            nona = '';
                            toggleabonne = 1;
                        }
                        res.render('newsletter', {
                            title: 'abonnez vous', connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser, ouiabonne: ouia, nonabonne: nona, toggleabonne: toggleabonne
                        });
                    });
                } else {
                    res.redirect('/mail/newsletter');
                }
            }
        });
    });
});

module.exports = router;