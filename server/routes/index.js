var express = require('express');
var router = express.Router();
var ctrlLocations = require("../controllers/locations");
var ctrlOthers = require("../controllers/others");

/* GET locations page. */
router.get('/', ctrlLocations.homeList);
router.get('/locations/:locationid', ctrlLocations.locationInfo);
router.get('/locations/:locationid/reviews/new', ctrlLocations.addReview);
router.post('/locations/:locationid/reviews/new', ctrlLocations.doAddReview);

/* Get about page */
router.get("/about",ctrlOthers.about);

module.exports = router;
