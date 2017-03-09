var request = require("request");
var apiOptions = {
	server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "http://warm-castle-28369.heroku.com";
}


exports.homeList = function(req,res){
	var url = apiOptions.server + "/api/locations";
	var options = {
		url:url,
		qs:{
			lng: -0.7992599,
			lat : 51.378091,
			maxDistance:200000000000000000
		},
		json:{}
	}; // fix the distance bug later
	function successCb(err,response,responseBody){
		var i, data;
		var message;
		if (!(responseBody instanceof Array)) {
			message = "API lookup error";
			responseBody = [];
		} else {
			if (!responseBody.length) {
				message = "No places found nearby";
			}
		}
		data = responseBody;
		if (response.statusCode === 200 && data.length) {
			for (i=0; i<data.length; i++) {
				data[i].rating = parseInt(data[i].rating);
			}
		}
		res.render("locations-list",
			{
				title:"SensiFI - find a place to work with wifi",
				pageHeader:{
					title:"SensiFI",
					strapline:"Find places to work with wifi near you"
				},
				// locations: data,
				message:message,
				sidebar: "Looking for wifi and a seat? Loc8r helps you find places to " +
				"work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r " +
				"help you find the place you're looking for."
			}
		);
	}
	request(options,successCb);

};

var _showError = function (req, res, status) {
	var title, content;
	if (status === 404) {
		title = "404, page not found";
		content = "Oh dear. Looks like we can't find this page. Sorry.";
	} else {
		title = status + ", something's gone wrong";
		content = "Something, somewhere, has gone just a little bit wrong.";
	}
	res.status(status);
	res.render('generic-text', {
		title : title,
		content : content
	});
};
function getLocationInfo(req,res,callback){
	var requestOptions = {
		url: apiOptions.server+"/api/locations/"+req.params.locationid,
		method:"get",
		json:{}
	};
	request(requestOptions,function(err,response,body) {
			var data = body;
			if (response.statusCode === 200) {
				data.coords = {
					lng: body.coords[0],
					lat: body.coords[1]
				};
				data.rating = parseInt(body.rating);
				callback(req, res, data);
			} else {
				_showError(req, res, response.statusCode);
			}
		}
	);
}

function renderDetailPage(req,res,responseData){
	res.render("location-info",
		{
			title: responseData.name,
			pageHeader: {title: responseData.name},
			sidebar: {
				context: 'is on SensiFI because it has accessible wifi and space to sit \ ' +
				'down with your laptop and get some work done.',
				callToAction: 'If you\'ve been and you like it - or if you don\'t - \ ' +
				'please leave a review to help other people just like you.'
			},
			location: responseData
		}
	);
}

exports.locationInfo = function(req,res){
	getLocationInfo(req,res,function(req,res,responseData){
		renderDetailPage(req,res,responseData);
	});
};

function renderReviewForm(req, res, locDetail) {
	res.render('location-review-form', {
		title: 'Review '+ locDetail.name + 'on SensiFI',
		pageHeader: { title: 'Review '+locDetail.name },
		error: req.query.err,
		url:req.originalUrl
	});
}
exports.addReview = function(req,res){
	getLocationInfo(req,res,function(req,res,responseData){
		renderReviewForm(req,res,responseData);
	});

};

exports.doAddReview = function(req,res){
	var postData = {
		author:req.body.name,
		rating:parseInt(req.body.rating,10),
		reviewText:req.body.review
	};
	var path = "/api/locations/"+req.params.locationid+"/reviews";
	var requestOptions = {
		url: apiOptions.server + path,
		method:"POST",
		json:postData
	};
	if (!postData.author || !postData.rating || !postData.reviewText) {
		res.redirect('/location/' + locationid + '/reviews/new?err=val');
	} else{
		request(requestOptions,function(err,response,body){
			if (response.statusCode === 201) {
				res.redirect('/locations/' + req.params.locationid);
			} else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
				res.redirect('/locations/' + req.params.locationid + '/reviews/new?err=val');
			}else {
				_showError(req, res, response.statusCode);
			}
		});
	}
};