
//importer mongoose 
const mongoose = require('mongoose');
//On va créer notre schéma de données
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true},
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: { type: Number, default:0},
    dislikes: { type: Number,default:0},
    usersLiked:{type: [String] ,required:false},
    usersDisliked: {type:[String] , required:false }
});
//Pour que ce schema soit utilisable,on va exporter mongoose.model pour utiliser notre schema ds la base de donnée.
module.exports = mongoose.model('Sauce', sauceSchema);
