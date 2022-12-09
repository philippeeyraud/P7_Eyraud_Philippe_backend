const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require('../middleware/multer-config');
const testCtrl = require('../controllers/test');

router.get('/', auth, testCtrl.getTest);

module.exports = router;