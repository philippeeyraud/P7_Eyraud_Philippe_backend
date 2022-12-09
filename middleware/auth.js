
const jwt = require('jsonwebtoken');

module.exports =(req , res , next) => {
console.log(exports)
   try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
      const userId = decodedToken.userId;
      req.auth = {
         userId: userId
       }; 
      if (req.body.userId && req.body.userId !== userId) {
         throw "requête non authentifiée !";
     } else {
         next();
     }
   }catch(error){
    res.status(401).json({error});

   }

  
      };

    console.log(exports)


