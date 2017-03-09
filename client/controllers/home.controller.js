(function(){
	angular
		.module("SensiFI")
		.controller("homeCtrl",homeCtrl);

	homeCtrl.$inject = ["$scope","sensiData","geolocation"];
	function homeCtrl($scope,sensiData,geolocation) {
		var vm = this;
		vm.pageHeader = {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		};
		vm.sidebar = {
			content: "Looking for wifi and a seat? Loc8r helps you find places to work " +
			"when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help " +
			"you find the place you're looking for."
		};
		vm.message = "Checking your location";

		vm.getData = function (position) {
			var lat = position.coords.latitude,
			    lng = position.coords.longitude;
			vm.message = "Searching for nearby places";
			sensiData
				.locationByCoords(lat,lng)
				.then(function(response) {
					vm.message = response.data.length > 0 ? "" : "No locations found";
					vm.data = { locations: response.data };
				})
				.catch(function (e) {
					vm.message = "Sorry, something's gone wrong";
				});
		};

		vm.showError = function (error) {
			$scope.$apply(function() {
				vm.message = error.message;
			});
		};
		vm.noGeo = function () {
			$scope.$apply(function() {
				vm.message = "Geolocation not supported by this browser.";
			});
		};
		geolocation.getPosition(vm.getData,vm.showError,vm.noGeo)
	}

})();