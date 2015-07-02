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
			$.ajax({
 				method: "GET",
  				url: "http://"+args['domain']+"/api/method/spos.spos.spos_api.get_pos_required_data?sales_user="+args['usr'],
 				dataType: "json",
 				success:function(result){
 					var pos_required_data
 					pos_required_data = result.message
 					set_pos_required_data_in_jstorage(pos_required_data)
					window.location = "./pages/pos.html";
					$.jStorage.set("user", r.full_name)
				},
 				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert("Can not load data")
					window.location = "../"
				}
			});

		
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Invalid Login")
			window.location = "../"
		}
	}).always(function(){
		$('.btn-primary').prop("disabled", false);
	})
}


function set_pos_required_data_in_jstorage(pos_required_data){
  var key_list = ["customer","vendor","item_group","item","price_list"]
  $.each(key_list,function(index,value){
     $.jStorage.set(value,pos_required_data[value])    
  })
}