const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');
const password = require("../Utils/password");

const auth = require("../middleware/auth");
//pour intercepter les req post on crée une nouvelle instance de notre modele user.
router.post('/signup',password,authCtrl.signup); 
router.post('/login',authCtrl.login); 
router.get('/:id', auth,authCtrl.getCurrent)
router.delete('/:id',auth,authCtrl.deleteCurrent)

module.exports = router;