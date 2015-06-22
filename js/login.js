$(document).ready(function(){
	bind_login_event()	
})

function bind_login_event(){
	var args = {};
	$('#signin').click(function(){
		args.cmd = "login";
		args.usr = ($("#inputUser").val() || "").trim();
		args.pwd = $("#inputPassword").val();
		args.domain = $("#inputhDomain").val();

		$('.btn-primary').prop("disabled", true);
		if(!args.usr || !args.pwd || !args.domain)  {
			alert("Domain, Login and Password required");
			return false;
		}
		login(args)
	})	
}

function login(args){
	$.ajax({
		type: "POST",
		url: "http://"+args['domain']+"/api/method/login?usr="+args['usr']+"&pwd="+args['pwd'],
		dataType: "json",
		success: function(r) {
			console.log(r)
			window.location = "./pages/pos.html";
			$.jStorage.set("user", r.full_name)
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Invalid Login")
			window.location = "../"
		}
	}).always(function(){
		$('.btn-primary').prop("disabled", false);
	})
}