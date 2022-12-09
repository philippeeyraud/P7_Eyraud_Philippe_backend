//importer express pour créer un router
//création de l'application express
//Importation de mongoose et connection à mongoDB. Utilisation de .end pour permettre al'utilisateur de mettre ses propres info sans toucher au code.
const express = require('express');
require("dotenv").config()
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

console.log(authRoutes);

const messagesRoutes = require('./routes/messages');
const saucesRoutes = require('./routes/sauces');
const path = require('path');
const testRoutes = require('./routes/test');
const log =require('./utils/winston');
log.info("test");
const helmet = require("helmet");
const { Console } = require('console');
//Strict-Transport-Policy , indique au navigateur de préférer HTTPS à HTTP
app.use(helmet.hsts({
   maxAge: 123456,
   includeSubDomains: false,
})
);
//Helmet définit les x-frame-Options dans le header afin de prévenir les attaques de type clickjacking(afficher une page sur une autre page)
app.use(
    helmet.frameguard({
      action: "deny",
    })
   );
//helmet.noSniff définit l'en-tête X-Content-Type-Options à nosniff. Cela empêche le reniflage des types MIME.
app.use(helmet.noSniff());


mongoose.connect(`${process.env.DB_URL}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL_CLUSTER}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => log.info('Connexion à MongoDB réussie !'))
    .catch(() => log.info('Connexion à MongoDB échouée !'));



//definition des headers pour le CORS(cross origin ressource share)
//Le middelware intercepte toute les requêtes qui ont un content type json et met a disposition ce contenu sur l objet requete body

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization,');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/messages',messagesRoutes);
app.use('/api/sauces', saucesRoutes);

app.use('/api/test', testRoutes);



app.use('/api/images', express.static(path.join(__dirname, 'images')));
//export de l application express pour que l'on puisse y accèder depuis les fichiers de notre projet et particulierement node.
module.exports = app;