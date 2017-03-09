
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

function config($routeProvider) {
	$routeProvider
		.when("/",{
			templateUrl:"/views/home.view.html",
			controller:"homeCtrl",
			controllerAs:"vm"
		})
		.otherwise({redirectTo:"/"})

}
angular
	.module("SensiFI", ["ngRoute"])
	.config(["$routeProvider",config])
