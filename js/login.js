$(document).ready(function(){
	bind_login_event()
	$("#forgot_password").click(function(){
		var my_flag = check_if_domain_is_given()
		if (my_flag == "success"){
			 check_for_internet_connectivity() ? redirect_to_forget_password_link() : show_message("Internet Connection not available","Error ....")

		}else{
			show_message("Domain name is mandatory","Mandatory Field")
		}
	})
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
			show_message("Domain name ,User name and Password are mandatory","Mandatory Field")
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
 					set_pos_required_data_in_jstorage(result.message)
					$.jStorage.set("user", r.full_name)
					$.jStorage.set("domain",args['domain'])
					$.jStorage.set("email",args['usr'])
					$.jStorage.set("login_count",1)
					window.location = "./pages/pos.html";
				},
 				error: function(XMLHttpRequest, textStatus, errorThrown) {
					// setTimeout(function () {waitingDialog.hide();},1000) 
					show_message("Can not load data due to request failure","Error .....")
					window.location = "../"
				}
			});		
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			show_message("Invalid Login","Error .....")
			$("#inputUser").val("");
			$("#inputPassword").val("");
			$("#inputhDomain").val("")			
		}
	}).always(function(){
		$('.btn-primary').prop("disabled", false);
	})
}


function set_pos_required_data_in_jstorage(pos_required_data){
  var key_list = ["customer","vendor","item_group","item","price_list","company"]
  $.each(key_list,function(index,value){
     $.jStorage.set(value,pos_required_data[value])    
  })
}

function check_if_domain_is_given(){
	return $("#inputhDomain").val() ? "success" : "fail" 
}


function show_message(message,title){
  $('#validate_model').modal("show")
  $('#validate_model').find('.modal-title').text(title)
  $('#validate_model').find('.modal-body').text(message)
}


function check_for_internet_connectivity(){
 var flag
 $.ajax({
        type: "GET",
        url: "{0}".replace("{0}",window.location.origin),
        async: false,
        success : function(data) {
            flag = true
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
            flag = false
        } 
    });
 return flag
}

function redirect_to_forget_password_link(){
	window.open("http://{0}/login#forgot".replace("{0}",$("#inputhDomain").val()))
}