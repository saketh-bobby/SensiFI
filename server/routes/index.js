var express = require('express');
var router = express.Router();
var ctrlMain = require("../controllers/main").index;
/* GET home page. */
router.get('/', ctrlMain);

module.exports = router;
