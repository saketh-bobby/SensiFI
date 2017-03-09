$(document).ready(function(){
	$('#addReview').submit(function () {
		var dangerAlert = $('.alert-danger');
		dangerAlert.hide();
		if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
			if (dangerAlert.length) {
				$('.alert.alert-danger').show();
			} else {
				$(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again</div>');
			}
			return false;
		}
	});
});
