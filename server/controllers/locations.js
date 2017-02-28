exports.homeList = function(req,res){
	res.render("locations-list",{title:"Home"});
};

exports.locationInfo = function(req,res){
	res.render("location-info",{title:"Location Info"});
};

exports.addReview = function(req,res){
	res.render("location-review-form",{title:"Add Review"});
};