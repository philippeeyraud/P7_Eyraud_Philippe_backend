const Test = require('../models/test');
const log = require('../utils/winston');
const { json } = require('express');
const Sauce = require('../models/sauce');



exports.getTest = (req, res) => {
   
    try { 

        Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));

    }
    catch (error) {
log.error(`error dans create test ${error}`);
     return res.status(500).json({ error });
    }

};
