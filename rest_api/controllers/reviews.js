var mongoose = require("mongoose");
var Location = mongoose.model("Location");


var sendJsonResponse = function(res,status,content){
	res.status(status);
	res.json(content);
};

function doSetAvgRating(location) {
	var totalRating,avgRating;
	if(location.reviews && location.reviews.length > 0) {
		totalRating = location.reviews
			.map(function(review){
				return review.rating;
			})
			.reduce(function(acc,b){
				return acc + b;
			});
		avgRating = totalRating / location.reviews.length;
		location.rating = avgRating;
		location.save(function(err,location){
			if(err) {
				console.log(err);
			} else{
				console.log("Average rating updated to:"+location.rating);
			}
		});
	}
}
function updateAvgRating(id) {
	Location
		.findById(id)
		.select("rating reviews")
		.exec(function(err,location){
			console.log(location);
			if(!err){
				doSetAvgRating(location);
			}
		});
}
function doAddReview(req, res, location) {
	var author = req.body.author;
	var rating = req.body.rating;
	var reviewText = req.body.reviewText;
	if(!location){
		sendJsonResponse(res,404,{"message":"locationid not found"});
	}
	location.reviews.push(
		{
			author:author,
			rating:rating,
			reviewText:reviewText
		}
	);

	location.save(function(err,location){
		if(err) {
			console.log(err);
			sendJsonResponse(res,400,err);
		} else {
			updateAvgRating(location._id);
			sendJsonResponse(res,201,location.reviews[location.reviews.length - 1]);
		}
	});
}
exports.reviewsCreate = function(req,res){
	var locationid = req.params.locationid;
	if(locationid) {
		Location
			.findById(locationid)
			.select("reviews")
			.exec(function(err,location){
				if(err) {
					sendJsonResponse(res,404,err);
				} else{
					doAddReview(req,res,location);
				}
			});
	} else{
		sendJsonResponse(res,404,{"message":"Not found,locationid required"});
	}
};

exports.reviewsReadOne = function(req,res){
	if(req.params && req.params.locationid && req.params.reviewid){
		Location
			.findById(req.params.locationid)
			.select("name reviews")
			.exec(function(err,location){
				var response,review;
				if(!location){
					sendJsonResponse(res,404,{"message":"Location id not found"});
				} else if(err){
					sendJsonResponse(res,404,err);
				}
				if (location.reviews && location.reviews.length > 0) {
					review = location.reviews.id(req.params.reviewid);
					if (!review) {
						sendJsonResponse(res, 404, {
							"message": "reviewid not found"
						});
					} else {
						response = {
							location : {
								name : location.name,
								id : req.params.locationid
							},
							review : review
						};
						sendJsonResponse(res, 200, response);
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "No reviews found"
					});
				}
			});

	} else {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationid and reviewid are both required"
		});
	}
};

exports.reviewsUpdateOne = function(req,res){
	if (!req.params.locationid || !req.params.reviewid) {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationid and reviewid are both required"
		});
		return;
	}
	Location
		.findById(req.params.locationid)
		.select('reviews')
		.exec(
			function(err, location) {
				var thisReview;
				if (!location) {
					sendJsonResponse(res, 404, {
						"message": "locationid not found"
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}
				if (location.reviews && location.reviews.length > 0) {
					thisReview = location.reviews.id(req.params.reviewid);
					if (!thisReview) {
						sendJsonResponse(res, 404, {
							"message": "reviewid not found"
						});
					} else {
						thisReview.author = req.body.author;
						thisReview.rating = req.body.rating;
						thisReview.reviewText = req.body.reviewText;
						location.save(function(err, location) {
							if (err) {
								sendJsonResponse(res, 404, err);
							} else {
								updateAverageRating(location._id);
								sendJsonResponse(res, 200, thisReview);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "No review to update"
					});
				}
			}
		);
};

exports.reviewsDeleteOne = function(req,res){
	if (!req.params.locationid || !req.params.reviewid) {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationid and reviewid are both required"
		});
		return;
	}
	Location
		.findById(req.params.locationid)
		.select('reviews')
		.exec(
			function(err, location) {
				if (!location) {
					sendJsonResponse(res, 404, {
						"message": "locationid not found"
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}
				if (location.reviews && location.reviews.length > 0) {
					if (!location.reviews.id(req.params.reviewid)) {
						sendJsonResponse(res, 404, {
							"message": "reviewid not found"
						});
					} else {
						location.reviews.id(req.params.reviewid).remove();
						location.save(function(err) {
							if (err) {
								sendJsonResponse(res, 404, err);
							} else {
								updateAvgRating(location._id);
								sendJsonResponse(res, 204, null);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "No review to delete"
					});
				}
			}
		);
};