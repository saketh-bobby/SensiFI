function _isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
function formatDistance() {
	return function (distance) {
		var numDistance, unit;
		if (distance && _isNumeric(distance)) {
			if (distance > 1) {
				numDistance = parseFloat(distance).toFixed(1);
				unit        = 'km';
			} else {
				numDistance = parseInt(distance * 1000, 10);
				unit        = 'm';
			}
			return numDistance + unit;
		} else {
			return "?";
		}
	};
}

function locationListCtrl($scope,sensiData,geolocation) {
	$scope.message = "Checking your location";

	$scope.getData = function (position) {
		var lat = position.coords.latitude,
		    lng = position.coords.longitude;
		$scope.message = "Searching for nearby places";
		sensiData
			.locationByCoords(lat,lng)
			.then(function(response) {
				$scope.message = response.data.length > 0 ? "" : "No locations found";
				$scope.data = { locations: response.data };
			})
			.catch(function (e) {
				$scope.message = "Sorry, something's gone wrong";
			});
	};

	$scope.showError = function (error) {
		$scope.$apply(function() {
			$scope.message = error.message;
		});
	};
	$scope.noGeo = function () {
		$scope.$apply(function() {
			$scope.message = "Geolocation not supported by this browser.";
		});
	};
	geolocation.getPosition($scope.getData,$scope.showError,$scope.noGeo)
}
function ratingStars() {
	return {
		scope: {
			thisRating: "=rating"
		},
		templateUrl: "/directives/rating-stars.html"
	};
}

function sensiData($http){
	var locationByCoords = function (lat, lng) {
		return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=200000000000000'); //TODO: fix location bug
	};
	return {
		locationByCoords : locationByCoords
	};
}
var geolocation = function () {
	var getPosition = function (cbSuccess, cbError, cbNoGeo) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
		}
		else {
			cbNoGeo();
		}
	};
	return {
		getPosition : getPosition
	};
};
angular
	.module("SensiFI", [])
	.controller("locationListCtrl", locationListCtrl)
	.filter("formatDistance", formatDistance)
	.directive("ratingStars", ratingStars)
	.service("sensiData",sensiData)
	.service("geolocation",geolocation);
