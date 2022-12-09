//importer mongoose 
const passwordValidator = require("password-validator")
//On va créer notre schéma de données
const passwordSchema = new passwordValidator();
//Définir le schema
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces


module.exports =(req, res, next)  => {
if(passwordSchema.validate(req.body.password)){
    next();
}else{
    return res.status(400).json({error : `mot de passe pas assez fort `})
}


}
