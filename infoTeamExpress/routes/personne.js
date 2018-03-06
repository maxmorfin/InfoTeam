var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.get('/affichage', function (req, res, next) {
    console.log("dans la route testget");

    let tabId = [];
    let tabNom = [];
    let tabPrenom = [];
    let tabMail = [];
    let tabMdp = [];
    let tabType = [];

    req.getConnection(function (error, conn) {
        conn.query('select * from Personne', function (err, result) {
            if (err) {
                console.error(err);
            } else {
                for (let i = 0; i < result.length; i++) {

                    tabId[i] = result[i].id;
                    tabNom[i] = result[i].nom;
                    tabPrenom[i] = result[i].prenom;
                    tabMail[i] = result[i].mail;
                    tabMdp[i] = result[i].mdp;
                    tabType[i] = result[i].type;
                }
            }

            //console.log(result[0].nom); 
            //res.send(reponse);

            res.render('personneAffichage', {
                title: 'Affichage des membres du site', tabN: tabNom, tabP: tabPrenom, tabMa: tabMail
            });

        });
    });


});

router.get('/inscription', function (req, res, next) {

    req.session.errors = "";
    req.session.inscriptionsuccess = "";

    res.render('personneInscription', {
        title: 'Page d\'inscription', mailexist: 0, inscriptionsucess: 0, inscriptionsuccess: req.session.inscriptionsuccess,
        errors: req.session.errors, connected : req.session.connected
    });

});


router.post('/inscription', function (req, res, next) {

    console.log("post inscription");
    console.log(req.check('mailForm', 'email invalide').isEmail());
    req.check('mdpForm', 'mot de passe(s) invalide(s)').isLength({ min: 4 }).equals(req.body.mdpFormBis);
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        req.session.errors = errors;
        req.session.inscriptionsuccess = false;
        res.render('personneInscription', {
            title: 'Page d\'inscription', mailexist: 0, inscriptionsucess: 0, inscriptionsuccess: req.session.inscriptionsuccess, errors: req.session.errors, connected : req.session.connected
        });
    } else {

        var data = {
            nom: req.body.nomForm,
            prenom: req.body.prenomForm,
            mail: req.body.mailForm,
            mdp: req.body.mdpForm
        };

        //mot de passe d'alfred : mdpwayne

        let mailExistant = 0; // à 1 si on trouve deja le mail dans la bdd

        req.getConnection(function (error, conn) { //requete vers la base pour comparer le mail rentrer en formulaire avec les mails deja present dans la bdd
            conn.query('select mail from personne', function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    for (let i = 0; i < rows.length; i++) {
                        //console.log(rows[i].mail);
                        if (rows[i].mail == data.mail) {
                            mailExistant = 1;
                        }
                    }
                }

                if (mailExistant == 0) {
                    console.log("on peut continuer");

                    //confirmation par mail
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'infoTeamRoger@gmail.com',
                            pass: 'infoteam13100'
                        }
                    });

                    var mailOptions = {
                        from: 'infoTeamRoger@gmail.com',
                        to: data.mail,
                        subject: 'Confirmation d\'inscription',
                        text: 'Bonjour ' + req.body.prenomForm + ',vous êtes maintenant inscrit sur notre site.'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    req.getConnection(function (error, conn) {
                        //conn.query('insert into personne set ?', data, function (err, rows) {
                        conn.query('insert into personne (nom, prenom, mail, mdp) values (?,?,?, SHA1(?))',[data.nom,data.prenom,data.mail,data.mdp], function (err, rows) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("insertion reussie");
                                //res.send("insertion reussie");
                                //res.redirect("/");
                                req.session.inscriptionsuccess = true;
                                res.render('personneInscription', {
                                    title: 'Page d\'inscription', mailexist: 0, inscriptionsucess: 1, inscriptionsuccess: req.session.inscriptionsuccess, errors: req.session.errors, connected : req.session.connected
                                });
                            }

                        });
                    });

                } else {
                    console.log("mail existant");

                    //res.redirect('/personne/inscription');
                    res.render('personneInscription', {
                        title: 'Page d\'inscription', mailexist: 1, inscriptionsucess: 0, inscriptionsuccess: req.session.inscriptionsuccess, errors: req.session.errors, connected: req.session.connected
                    });
                }


            });
        });

    }//fin du else du if des errors des validators
    //res.redirect('/personne/inscription');
});

router.get('/modification', function (req, res, next) {

    let num = req.session.idUser;

    req.getConnection(function (error, conn) {
        conn.query('select * from personne where id=?', [num], function (err, rows) {
            if (err) {
                throw err;
            } else {
                req.session.errors = null;
                console.log(rows);
                res.render('personneModification', {
                    title: 'Page de gestion de compte', mailexist: 0, modifok: 0, n: rows[0].nom, p: rows[0].prenom, m: rows[0].mail, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser, errors: req.session.errors
                });
            }

        });
    });

    /*
    res.render('personnemodification', {
        title: 'Page de gestion de compte', mailexist: 0, modifok: 0
    });
    */
});

router.post('/modification', function (req, res, next) {

    let num = req.session.idUser;

    var data = {
        nom: req.body.nomForm,
        prenom: req.body.prenomForm,
        mail: req.body.mailForm
    };

    console.log(req.check('mailForm', 'email invalide').isEmail());
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        req.session.errors = errors;
        req.getConnection(function (error, conn) {
            conn.query('select * from personne where id=?', [num], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    res.render('personneModification', {
                        title: 'Page de gestion de compte', mailexist: 0, modifok: 0, n: rows[0].nom, p: rows[0].prenom, m: rows[0].mail, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser, errors: req.session.errors
                    });
                }

            });
        });

    } else {
        req.session.errors = null;
        let mailExistant = 0; // à 1 si on trouve deja le mail dans la bdd

        req.getConnection(function (error, conn) { //requete vers la base pour comparer le mail rentrer en formulaire avec les mails deja present dans la bdd
            conn.query('select mail from personne where id!=?', [num], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    for (let i = 0; i < rows.length; i++) {
                        console.log(rows[i].mail);
                        if (rows[i].mail == data.mail) {
                            mailExistant = 1;
                        }
                    }
                }

                if (mailExistant == 0) {
                    console.log("on peut continuer");

                    //TO DO: requete à modifier, update

                    req.getConnection(function (error, conn) {
                        conn.query('update personne set nom = ?, prenom = ? , mail = ?  where id = ? ', [data.nom, data.prenom, data.mail, num], function (err, rows) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("update reussie");
                                //res.send("insertion reussie");
                                //res.redirect("/");
                                req.getConnection(function (error, conn) {
                                    conn.query('select * from personne where id=?', [num], function (err, rows2) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            console.log(rows2);
                                            req.session.nomUser = rows2[0].nom;
                                            req.session.prenomUser = rows2[0].prenom;
                                            req.session.mailUser = rows2[0].mail;
                                            res.render('personneModification', {
                                                title: 'Page de gestion de compte', mailexist: 0, modifok: 1, n: rows2[0].nom, p: rows2[0].prenom, m: rows2[0].mail, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser, errors: req.session.errors
                                            });
                                        }

                                    });
                                });
                            }

                        });
                    });


                } else {
                    console.log("mail existant");

                    req.getConnection(function (error, conn) {
                        conn.query('select * from personne where id=?', [num], function (err, rows) {
                            if (err) {
                                throw err;
                            } else {
                                //res.redirect('/personne/inscription');
                                res.render('personneModification', {
                                    title: 'Page de gestion de compte', mailexist: 1, modifok: 0, n: rows[0].nom, p: rows[0].prenom, m: rows[0].mail, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser, errors: req.session.errors
                                });
                            }
                        });
                    });
                }
            });
        });


    }//fin du else du if des errors des validators
    /*
    res.render('personnemodification', {
        title: 'Page de gestion de compte', mailexist: 0, modifok:1
    });
    */

});

router.get('/modifmdp', function (req, res, next) {
    req.session.errors = null;
    res.render('personneModifMdp', {
        title: 'Page de modification de mot de passe', newMdpSuccess: 0, badOldMdp: 0, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser, errors: req.session.errors
    });

});
router.post('/modifmdp', function (req, res, next) {
    let num = req.session.idUser;
    let mdpOld = req.body.mdpFormOld;
    let newMdp = req.body.mdpFormNew;

    req.check('mdpFormNew', 'mot de passe(s) invalide(s)').isLength({ min: 4 }).equals(req.body.mdpFormNewBis);
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        req.session.errors = errors;
        res.render('personneModifMdp', {
            title: 'Page de modification de mot de passe', newMdpSuccess: 0, badOldMdp: 0, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser, errors: req.session.errors
        });
    } else {

        req.getConnection(function (err, connexion) {
            connexion.query("Select mdp from Personne where id = ? ", [num], function (err, result) {
                if (err) {
                    throw err;
                } else {

                    connexion.query('select sha1(?) as testsha', mdpOld, function (err, resultest) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("mdp bdd:", result[0].mdp, "mdpold entré:", resultest[0].testsha);
                            if (result[0].mdp == resultest[0].testsha) {
                                connexion.query("Update Personne set mdp = sha1(?) where id = ? ", [newMdp, num], function (err, rows) {
                                    if (err) throw err;
                                    res.render('personneModifMdp', {
                                        title: 'Page de modification de mot de passe', newMdpSuccess: 1, badOldMdp: 0, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser, errors: req.session.errors
                                    });
                                })
                            } else {
                                res.render('personneModifMdp', {
                                    title: 'Page de modification de mot de passe', newMdpSuccess: 0, badOldMdp: 1, connected: req.session.connected, typeUser: req.session.typeUser, nomUser: req.session.nomUser, prenomUser: req.session.prenomUser, errors: req.session.errors
                                });
                            }
                        }
                    });

                }
            });
        });
    }//fin du else du if des errors des validators
});


router.get('/connexion', function (req, res, next) {

    console.log("get connexion", req.session);
    if (req.session.inscriptionsuccess != true) {
        req.session.userExist = null;
    }

    res.render('personneConnexion', {
        title: 'Page de connexion', inscriptionsuccess: req.session.inscriptionsuccess,
        errors: req.session.errors, userExist: req.session.userExist, connected: req.session.connected
    });

});

router.post('/connexionsubmit', function (req, res, next) {

    req.getConnection(function (error, conn) {
        conn.query('select id, type, nom, prenom from personne where mail = ? and mdp=sha1(?)', [req.body.mailLoginForm, req.body.passwordForm], function (err, rows) {
            if (err) {
                throw err;
            } else {
                req.session.userExist = false;
                console.log(rows);
                if (rows[0] != null) {
                    req.session.userExist = true;
                    req.session.connected = true;
                    req.session.idUser = rows[0].id;
                    req.session.typeUser = rows[0].type;
                    req.session.nomUser = rows[0].nom;
                    req.session.prenomUser = rows[0].prenom;
                    req.session.mailUser = rows[0].mail
                    console.log(req.session.typeUser);
                    

                    conn.query('select type from personne where id=?', req.session.idUser, function (err, resultype) {
                        if (err) {
                            throw err;
                        } else {
                            console.log(resultype);
                            req.session.type = resultype[0].type;
                            // res.render('index', {
                            //     title: 'Accueil', connected: req.session.connected, errors: req.session.errors, //variable pour la connexion reussie
                            //     userExist: req.session.userExist, idUser: req.session.idUser, typeUser: req.session.typeUser
                            // });
                            res.redirect('/');
                        }
                    });





                } else {
                    res.render('personneConnexion', {
                        title: 'Accueil', connected: req.session.connected, errors: req.session.errors, //variable pour la connexion reussie
                        idUser: req.session.idUser, userExist: req.session.userExist
                    });
                }



            }

        });


    });



});


router.get('/deconnexion', function (req, res, next) {
    req.session.inscriptionsuccess = false;
    req.session.connected = false;
    req.session.idUser = null;
    req.session.typeUser = null;
    req.session.nomUser = null;
    req.session.prenomUser = null;
    req.session.mailUser = null;
    res.redirect('/');
});

module.exports = router;