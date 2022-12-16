const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const log = require("../utils/winston");
const sanitize = require("mongo-sanitize");
const { stringifyStyle } = require("@vue/shared");
const { Console } = require("console");
const { any } = require("webidl-conversions");

//Création de nouveau user à partir de l'app frontend
//On récupere le hash du mot de passe que l'on va enregistrer ds un nouveau user ds la base de donnée
//On enregistre le user ds la base de donnée
exports.signup = (req, res, next) => {

   log.info('SIGNUP');

   //Importation de cryptojs pour  chiffrer le mail
   const cryptojs = require("crypto-js");
   const validator = require("email-validator");
   // La fonction sanitize élimine toutes les clés qui commencent par '$' dans l'entrée,
   const emailIsValid = validator.validate(sanitize(req.body.email));
   if (!emailIsValid) {
      res.status(400).json({ message: 'email non valide' });
   } else {
      log.info("CONTENU :cryptojs");
      log.info(cryptojs);
      //Chiffre le mail avant de l'envoyer dans la base de donnée
      const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();
      log.info("-CONTENU: emailCryptoJs - contollers/auth")
      log.info(emailCryptoJs)


      bcrypt.hash(req.body.password, 10)
         .then(hash => {
            log.info(hash);
           const user = new User({
              name:req.body.name,
               email: emailCryptoJs,
               password: hash,

            })


            log.info(`user = ${JSON.stringify(user)}`);
            user.save()

               .then(() => res.status(201).json({ message: 'Utilisateur crée!' }))

               .catch((error) => {
                  log.info(`error ${error}`);
                  return res.status(400).json({ error })
               }
               );
         })
         .catch(error => res.status(500).json({ error }));

   };

  log.info("signup");

  
};

//On utilise login pour que l'utilisateur existant puisse se connecter à l'application
//On va trouver le user, ds la base de donnée ,qui correspond à l'adresse email qui est rentré par l'utilisateur ds l'appliocation
//On compare le mot de passe entré avec le hash donné ds la base de donnée
//Si la comparaison est bonne on lui renvoi le userid et le token
//On utilise cryptojs pour vérifier que le login et le hash de la base sont conformes
exports.login = (req, res, next) => {
  const cryptojs = require("crypto-js");
  //Contenu de la requête
  log.info("-CONTENU login: req.body.email- contollers/auth");
  log.info(req.body.email);
  log.info("--->CONTENU login: req.body.password - contollers/auth");
  log.info(req.body.password);
  //Chiffrer l'email de la requête
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`)
    .toString();
  log.info("--->CONTENU: emailCryptoJs - contollers/auth");
  log.info(emailCryptoJs);

  User.findOne({ email: emailCryptoJs })

    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: "Paire identifiant /mot de passe incorect" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "Paire identifiant /mot de passe incorect" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN),
              });
            }
          })

          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getCurrent = async (req, res, next) => {

   res.status(200).json({ "message": "authentifié" });

}

exports.deleteCurrent = (req, res, next) => {
 user.findOne({ _id: req.params.id })
      .then((user) => {
         if (user.userId != req.auth.userId) {
            res.status(401).json({ message: 'Not authorised' });
         }
      })

        user.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: ' supprimé !' }) })
            .catch(error => res.status(400).json({ error }));

}         







