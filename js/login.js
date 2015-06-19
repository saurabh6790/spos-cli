$(document).ready(function(){
	$('.form-signin').on("submit", function(event){
		usr = $("#user").val();
		pwd = $('#inputPassword').val();
		$.ajax({
			url: 'http://test_phr/api/method/login',
			method: "POST",
			async: false,
			data:{"usr":usr, "pwd":pwd},
			dataType: "json",
			success: function(r) {
				window.location.href = "http://spos/pages/pos.html";
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(textStatus);
			}
		});
	})
})