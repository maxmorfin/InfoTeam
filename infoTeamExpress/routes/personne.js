var express = require('express');
var router = express.Router();


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
        errors: req.session.errors
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
            title: 'Page d\'inscription', mailexist: 0, inscriptionsucess: 0, inscriptionsuccess: req.session.inscriptionsuccess,
            errors: req.session.errors
        });
    } else {

        var data = {
            nom: '"' + req.body.nomForm + '"',
            prenom: '"' + req.body.prenomForm + '"',
            mail: '"' + req.body.mailForm + '"',
            mdp: '"' + req.body.mdpForm + '"'
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

                    req.getConnection(function (error, conn) {
                        //conn.query('insert into personne set ?', data, function (err, rows) {
                        conn.query('insert into personne (nom, prenom, mail, mdp) values (' + data.nom + ', ' + data.prenom + ', ' + data.mail + ', SHA1(' + data.mdp + '))', function (err, rows) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("insertion reussie");
                                //res.send("insertion reussie");
                                //res.redirect("/");
                                req.session.inscriptionsuccess = true;
                                res.render('personneInscription', {
                                    title: 'Page d\'inscription', mailexist: 0, inscriptionsucess: 1, inscriptionsuccess: req.session.inscriptionsuccess, errors: req.session.errors
                                });
                            }

                        });
                    });

                } else {
                    console.log("mail existant");

                    //res.redirect('/personne/inscription');
                    res.render('personneInscription', {
                        title: 'Page d\'inscription', mailexist: 1, inscriptionsucess: 0
                    });
                }


            });
        });

    }//fin du else du if des errors des validators
    //res.redirect('/personne/inscription');
});

router.get('/modification', function (req, res, next) {

    //TO DO: modifier avec les sessions pour recuperer les infos de celui qui est connecté
    let num = 3;

    req.getConnection(function (error, conn) {
        conn.query('select * from personne where id=?', [num], function (err, rows) {
            if (err) {
                throw err;
            } else {
                console.log(rows);
                res.render('personneModification', {
                    title: 'Page de gestion de compte', mailexist: 0, modifok: 0, n: rows[0].nom, p: rows[0].prenom, m: rows[0].mail
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

    //TO DO: modifier avec les sessions pour recuperer les infos de celui qui est connecté
    let num = 3;

    var data = {
        nom: '"' + req.body.nomForm + '"',
        prenom: '"' + req.body.prenomForm + '"',
        mail: '"' + req.body.mailForm + '"'
    };

    let mailExistant = 0; // à 1 si on trouve deja le mail dans la bdd

    req.getConnection(function (error, conn) { //requete vers la base pour comparer le mail rentrer en formulaire avec les mails deja present dans la bdd
        conn.query('select mail from personne', function (err, rows) {
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
                    conn.query('update personne set nom=' + data.nom + ', prenom=' + data.prenom + ', mail=' + data.mail + 'where id=' + num, function (err, rows) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("update reussie");
                            //res.send("insertion reussie");
                            //res.redirect("/");
                            req.getConnection(function (error, conn) {
                                conn.query('select * from personne where id=?', [num], function (err, rows) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log(rows);
                                        res.render('personneModification', {
                                            title: 'Page de gestion de compte', mailexist: 0, modifok: 1, n: rows[0].nom, p: rows[0].prenom, m: rows[0].mail
                                        });
                                    }

                                });
                            });
                        }

                    });
                });


            } else {
                console.log("mail existant");

                //res.redirect('/personne/inscription');
                res.render('personneModification', {
                    title: 'Page de gestion de compte', mailexist: 1, modifok: 0, n: rows[0].nom, p: rows[0].prenom, m: rows[0].mail
                });
            }


        });
    });



    /*
    res.render('personnemodification', {
        title: 'Page de gestion de compte', mailexist: 0, modifok:1
    });
    */

});

router.get('/modifmdp', function (req, res, next) {

    res.render('personneModifMdp', {
        title: 'Page de modification de mot de passe'
    });

});


router.get('/connexion', function (req, res, next) {

    console.log("get connexion", req.session);
    if (req.session.inscriptionsuccess != true) {
        req.session.userExist = null;
    }

    res.render('personneConnexion', {
        title: 'Page de connexion', inscriptionsuccess: req.session.inscriptionsuccess,
        errors: req.session.errors, userExist: req.session.userExist
    });

});

router.post('/connexionsubmit', function (req, res, next) {

    req.getConnection(function (error, conn) {
        /*
        conn.query('select mail, mdp from personne', function (err, rows) {
            if (err) {
                throw err;
            } else {
                req.session.userExist = false;
                console.log(rows);
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].mail == req.body.mailLoginForm && rows[i].mdp == req.body.passwordForm) {
                        req.session.userExist = true;
                        req.session.connected = true;
                    }
                }
                console.log(req.session.userExist);
                res.render('index', {
                    title: 'Accueil', connected: req.session.connected, errors: req.session.errors //variable pour la connexion reussie
                  });
            }
        });
        */

        conn.query('select id from personne where mail =? and mdp=sha1(?)', [req.body.mailLoginForm, req.body.passwordForm], function (err, rows) {
            if (err) {
                throw err;
            } else {
                req.session.userExist = false;
                console.log(rows);
                if (rows[0] != null) {
                    req.session.userExist = true;
                    req.session.connected = true;
                    req.session.idUser = rows[0].id;

                    conn.query('select type from personne where id=?', req.session.idUser, function (err, resultype) {
                        if (err) {
                            throw err;
                        } else {
                            console.log(resultype);
                            req.session.type = resultype[0].type;
                            res.render('index', {
                                title: 'Accueil', connected: req.session.connected, errors: req.session.errors, //variable pour la connexion reussie
                                userExist: req.session.userExist, idUser: req.session.idUser, typeUser: req.session.typeUser
                            });
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
    res.redirect('/');
});

module.exports = router;