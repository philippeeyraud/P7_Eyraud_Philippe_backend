
//importer mongoose 
const mongoose = require('mongoose');
//On va créer notre schéma de données
const messageSchema = mongoose.Schema({
     
    id: { type: Number,unique: true,required: true},
    userId: { type: String, required: true},
    description: { type: String, required: true},
    
    imageUrl: { type: String, required: true},
    
    likes: { type: Number, default:0},
    dislikes: { type: Number,default:0},
    usersLiked:{type: [String] ,required:false},
    usersDisliked: {type:[String] , required:false },
    message_id: { type: Number,unique: true,required: true}
});
//Pour que ce schema soit utilisable,on va exporter mongoose.model pour utiliser notre schema ds la base de donnée.

module.exports = mongoose.model('Message',messageSchema);


