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

    $.each($.jStorage.get("item"),function(index,value){
    $('.item_thumnails').append('<div class="col-sm-4 col-md-3 col-xs-6">\
                        <div class="thumbnail"  data-target="#exampleModal" item_code="'+value.item_code+'" description="'+value.item_name+'" >\
                        <div  class="thumbnail-img">\
                        <span class="glyphicon glyphicon-home"></span>\
                        </div>\
                        <div class="caption">\
                              <b >'+value.item_code+'</b>\
                              <p style="font-size:11px" >'+value.item_name+'</p>\
                              </div>\
                              </div>\
                               </div>')


    })


   

    $(".thumbnail").click(function(){
        item_code = $(this).attr("item_code")
        description = $(this).attr("description")
        cost = $.grep($.jStorage.get("item"), function(e){ return e.item_code == item_code; })
         $("#cart_body").append('<div class="row pos-bill-row pos-bill-item" item_code="'+item_code+'" description="'+description+'" cost="'+cost[0].cost+'"  quantity=1>\
                                <div class="col-md-2 col-sm-2 col-xs-2"><h5>'+item_code+'</h5></div>\
                                <div class="col-md-4 col-sm-4 col-xs-4"><h5>'+description+'</h5></div>\
                                <div class="col-md-3 col-sm-3 col-xs-3"><input type="number" class="form-control" placeholder="Quantity" value=1 id="quantity" onkeypress="return isNumberKey(event)"></div>\
                                <div class="col-md-2 col-sm-2 col-xs-2"><h5>'+cost[0].cost+'</h5></div>\
                                <div class="col-md-1 col-sm-1 col-xs-1"><div class="cancel"><span class="glyphicon glyphicon-trash" style="padding-top:10px;"></span></div></div>\
                                </div>')

        calculate_grand_total()
    })


    $(document).on("click","div.cancel",function(){
        $(this).parent().parent().remove()
        calculate_grand_total()
    })

    $(document).on('input',"#quantity",function() { 
       $(this).parent().parent().attr("quantity",$(this).val()) 
       calculate_grand_total()  
            
    });

     


  });








function calculate_grand_total(){
    total_value = 0.0
    $.each($("#cart_body").children(),function (argument) {
        if (parseFloat($(this).attr("quantity"))){
             total_value = total_value + parseFloat($(this).attr("quantity")) * parseFloat($(this).attr("cost"))
        }

    })
    $("#grand_total").text(total_value).css("font-weight","bold")

}



function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31
    && (charCode < 48 || charCode > 57))
        return false;

    return true;
}




// function init_modal_creation(cur_this){
//    diaog_html = '<div class="modal-dialog fade" id="exampleModal">\
//             <div class="modal-dialog">\
//             <div class="modal-content">\
//             <div class="modal-header">\
//             <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
//             <h4 class="modal-title">Modal title</h4>\
//             </div>\
//             <div class="modal-body">\
//             <p>One fine body&hellip;</p>\
//             </div>\
//             <div class="modal-footer">\
//             <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
//             <button type="button" class="btn btn-primary">Save changes</button>\
//             </div>\
//             </div><!-- /.modal-content -->\
//             </div><!-- /.modal-dialog -->\
//             </div><!-- /.modal -->'

// }