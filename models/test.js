//importer mongoose 
const mongoose = require('mongoose');
//On va créer notre schéma de données
const testSchema = mongoose.Schema({
     
    id: { type: Number,unique: true,required: true},
    userId: { type: String, required: true},
 
    
   
});
//Pour que ce schema soit utilisable,on va exporter mongoose.model pour utiliser notre schema ds la base de donnée.
module.exports = mongoose.model('Test',testSchema);
