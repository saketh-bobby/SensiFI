angular
	.module("SensiFI")
	.directive("ratingStars",ratingStars);

function ratingStars() {
	return {
		restrict:"EA",
		scope: {
			thisRating: "=rating"
		},
		templateUrl: "/directives/ratingStars/ratingStars.template.html"
	};
}
