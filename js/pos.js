$(document).ready(function(){
    
    $.each($.jStorage.get("customer"),function(index,value){
    	$('#customer').append("<option>{0}</option>".replace("{0}",value.customer_id))

    })

    $.each($.jStorage.get("vendor"),function(index,value){
    	$('#vendor').append("<option>{0}</option>".replace("{0}",value.vendor_id))

    })

    $.each($.jStorage.get("item"),function(index,value){
    	$('#item').append("<option>{0}</option>".replace("{0}",value.item_code))

    })

    $.each($.jStorage.get("item_group"),function(index,value){
    	$('#sub_category').append("<option>{0}</option>".replace("{0}",value))

    })


    $('.combobox').combobox();
    // $('#customer').



  });