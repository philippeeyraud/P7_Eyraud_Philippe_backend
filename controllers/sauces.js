const Sauce = require('../models/sauce');
const fs = require('fs');
const { json } = require('express');
//L'objet requête va etre envoyée sous forme Json mais en chaîne de caractere donc il faut parser cet objet
//On va supprimer deux champs _id(id de l'objet va être genéré par la base de données), et userId(la personne qui a crée l objet)
//On va utiliser le userId du token d'auth.

exports.createSauce = (req, res, next) => {

    try {

        console.log(JSON.stringify(req.body));

        const sauceObject = JSON.parse(req.body.sauce);
        console.log(req.auth);

        const sauce = new Sauce({

            ...sauceObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`


        });

        //Enregistrer l'objet ds la base
        sauce.save()
            .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
            .catch(error => { res.status(400).json({ error }) });

    }
    catch (error) {

        return res.status(500).json({ error });
    }

};

exports.modifySauce = (req, res, next) => {
    //Teste l'existence de file(ce qui indique qu'on change d'image)
    //Si il y a un champ file on va récupérer l'objet sauce correspondant  en parsan la chaine de caractères
    //Et l'on recree l'url de l'image
    //Si il ny a pas de fichier, on récupère l'objet directement ds le corps de la requête
    //On va chercher la sauce correspondant à l'utilisateur
    //Avec req.auth.userId on vérifie que la sauce que l'on traite appartient à l'utilisateur connecté
    const sauceObjet = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorised' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                    .catch(error => res.status(401).json({ error }));
                const filename = sauce.imageUrl.split('/images/')[1];

            }




        })
        .catch((error) => {
            res.status(401).json({ error })

        });

};
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorised' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];

                fs.unlink(`images/${filename}`, () => {
                    sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(400).json({ error }));
                });
            }
        });
};









exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//Integration du dislike et du like
//La personne n'aime pas la sauce, ajout d'un dislike,ajout du username et du dislike ds le tabbleau
//La personne aime la sauce, ajout d'un like, ajout du username plus like dans le tableau  
//La personne a fait une erreur
exports.createLike = (req, res) => {
    try {
        Sauce.findOne({
            _id: req.params.id

        })
            .then(sauce => {
                if (req.body.like == -1) {
                    sauce.dislikes++;
                    sauce.usersDisliked.push(req.body.userId);
                    sauce.save();

                }

                if (req.body.like == 1) {
                    sauce.likes++;
                    sauce.usersLiked.push(req.body.userId);
                    sauce.save();
                }

                if (req.body.like == 0) {

                    if (sauce.usersLiked.indexOf(req.body.userId) != -1) {
                        sauce.likes--;
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 3);
                    } else {
                        sauce.dislikes--;
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 3);

                    }
                    sauce.save();

                }
                res.status(200).json({ message: 'Like acceptés !' })


            }


            )
    }

    catch (error) {

        return res.status(500).json({ error });
    }
}















