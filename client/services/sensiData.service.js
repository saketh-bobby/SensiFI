(function(){
	angular
		.module('SensiFI')
		.service("sensiData",sensiData);

	sensiData.$inject = ["$http"];

	function sensiData($http){
		var locationByCoords = function (lat, lng) {
			return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=200000000000000'); //TODO: fix location bug
		};
		return {
			locationByCoords : locationByCoords
		};
	}
})();