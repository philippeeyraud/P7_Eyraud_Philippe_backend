const Message = require('../models/message');
const log = require('../utils/winston');
const fs = require('fs');
const { json } = require('express');
//L'objet requête va etre envoyée sous forme Json mais en chaîne de caractere donc il faut parser cet objet
//On va supprimer deux champs _id(id de l'objet va être genéré par la base de données), et userId(la personne qui a crée l objet)
//On va utiliser le userId du token d'auth.




exports.createMessage = (req, res, next) => {


    try {

        console.log(JSON.stringify(req.body));

        const messageObject = JSON.parse(req.body.message);
        console.log(req.auth);

        const message = new Message({

            ...messageObject,
            userId: req.auth.userId,

          //  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`*/

          



        });

        //Enregistrer l'objet ds la base
            message.save()
            .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
            .catch(error => { res.status(400).json({ error }) });

    }
    catch (error) {
log.error(`error dans create message ${error}`);
     return res.status(500).json({ error });
    }

};

exports.getActual = (_req, res) => {
   
    try { 

        Message.find()
        .then(_message => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));

    }
    catch (error) {
log.error(`error dans create test ${error}`);
     return res.status(500).json({ error });
    }

};
















