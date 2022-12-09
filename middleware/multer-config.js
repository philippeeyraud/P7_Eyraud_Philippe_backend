//Comment gerer les fichiers ou les enregistrer et quel nom leurs donner

const multer = require('multer');
const fs = require('fs');


//dictionaire
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'

};
//Création d'un dossier image
const imageDir = "./images";
if(fs.existsSync(imageDir)) {
   
}else {
    fs.mkdir('./images', (err) => {
        if (err) {
            return console.error(err);
        }
    
    });
}





//Création d'un objet de configuration pour multer(storage)
//L'objet de configuration a besoin de deux elements
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null,'images')
    },
    filename: (req, file, callback) => {
       
        let namewithoutext = file.originalname.split('.')[0];
       
       const name = namewithoutext.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
        console.log(name)
    }
});

module.exports = multer({ storage}).single('image')