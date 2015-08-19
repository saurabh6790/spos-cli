var image_object = {

"a":["../images/letters/blue/letters_s-1.png"],
"b":["../images/letters/blue/letters_s-2.png"],
"c":["../images/letters/blue/letters_s-3.png"],
"d":["../images/letters/blue/letters_s-4.png"],
"e":["../images/letters/blue/letters_s-5.png"],
"f":["../images/letters/blue/letters_s-6.png"],
"g":["../images/letters/blue/letters_s-7.png"],
"h":["../images/letters/blue/letters_s-8.png"],
"i":["../images/letters/blue/letters_s-9.png",],
"j":["../images/letters/blue/letters_s-10.png"],
"k":["../images/letters/blue/letters_s-11.png"],
"l":["../images/letters/blue/letters_s-12.png"],
"m":["../images/letters/blue/letters_s-13.png"],
"n":["../images/letters/blue/letters_s-14.png"],
"o":["../images/letters/blue/letters_s-15.png"],
"p":["../images/letters/blue/letters_s-16.png"],
"q":["../images/letters/blue/letters_s-17.png"],
"r":["../images/letters/blue/letters_s-18.png"],
"s":["../images/letters/blue/letters_s-19.png"],
"t":["../images/letters/blue/letters_s-20.png"],
"u":["../images/letters/blue/letters_s-21.png"],
"v":["../images/letters/blue/letters_s-22.png"],
"w":["../images/letters/blue/letters_s-23.png"],
"x":["../images/letters/blue/letters_s-24.png"],
"y":["../images/letters/blue/letters_s-25.png"],
"z":["../images/letters/blue/letters_s-26.png"],
"0":["../images/letters/blue/letters_s-1.png"],
"1":["../images/letters/blue/letters_s-2.png"],
"2":["../images/letters/blue/letters_s-3.png"],
"3":["../images/letters/blue/letters_s-4.png"],
"4":["../images/letters/blue/letters_s-5.png"],
"5":["../images/letters/blue/letters_s-6.png"],
"6":["../images/letters/blue/letters_s-7.png"],
"7":["../images/letters/blue/letters_s-8.png"],
"8":["../images/letters/blue/letters_s-9.png",],
"9":["../images/letters/blue/letters_s-10.png"],

}






$(document).ready(function(){
    if(!$.jStorage.get("user")){
       window.location = window.location.origin;
    }
    if ($.jStorage.get("login_count") == 1){
      waitingDialog.show('Welcome {0}.Please Wait while data is loading........'.replace("{0}",$.jStorage.get('user')), {dialogSize: 'md'});
    }
    
    $("a.dropdown-toggle.user").prepend("<p style='display: inline-block;'>{0}</p>".replace("{0}",$.jStorage.get("user")))
     $("#company").html("<b>{0}</b>".replace("{0}",$.jStorage.get("company")))

    $.each($.jStorage.get("customer"),function(index,value){
    	$("body").find('select[id=customer]').append("<option description='{1}'>{0}</option>".replace("{0}",value.customer_id).replace("{1}",value.customer_name))

    })

    $.each($.jStorage.get("vendor"),function(index,value){
    	$("body").find('select[id=vendor]').append("<option>{0}</option>".replace("{0}",value.vendor_id))

    })



    $.each($.jStorage.get("item_group"),function(index,value){
    	$("body").find('select[id=sub_category]').append("<option>{0}</option>".replace("{0}",value))

    })

    append_all_items_to_select()


   $('.combobox').combobox()

    if ($.jStorage.get("login_count") == 1){
       setTimeout(function () {waitingDialog.hide();},5000)
       $.jStorage.set("login_count",2)  
    }
   
        
    $('#exampleModal').on('show.bs.modal', function (event) {
        var thumbnail = $(event.relatedTarget) // div that triggered the modal
        var item_code = thumbnail.data('item_code') // Extract info from data-* attributes
        var description = thumbnail.data('description')
        qty = get_qty_of_existing_item(item_code)
        var modal = $(this)
        modal.find('#modal_item_code').val(item_code)
        modal.find('#modal_item_description').val(description)
        modal.find('#modal_item_quantity').val(qty)
        modal.find('input:last').focus()  
        modal.find('#add_to_cart').attr("item_code",item_code)
        modal.find('#add_to_cart').attr("description",description)
        cost = $.grep($.jStorage.get("item"), function(e){ return e.item_code == item_code; })
        modal.find('#add_to_cart').attr("cost",cost[0].cost)  
    })

    $('#exampleModal').on('shown.bs.modal', function (event) {
       $("#modal_item_quantity").focus()
       $("#modal_item_quantity").select()
    })


    $("#add_to_cart").click(function(){
        var modal = $(this).parent().parent().parent().parent()
        var quantity = modal.find('#modal_item_quantity').val()
        item_code = $(this).attr("item_code")
        description = $(this).attr("description")
        cost = $(this).attr("cost")
        existing_item = check_if_item_exists_in_cart(item_code)  
        if (existing_item.length){
           $("#cart_body").find("[item_code='{0}']".replace("{0}",String(item_code))).find("#quantity").val(quantity)
           $("#cart_body").find("[item_code='{0}']".replace("{0}",String(item_code))).attr("quantity",quantity)
        }else{
             $("#cart_body").prepend('<div class="row pos-bill-row pos-bill-item" item_code="'+item_code+'" description="'+description+'" cost="'+cost+'"  quantity='+quantity+'>\
                                <div class="col-md-2 col-sm-2 col-xs-2"><h5>'+item_code+'</h5></div>\
                                <div class="col-md-4 col-sm-4 col-xs-4"><h5>'+description+'</h5></div>\
                                <div class="col-md-2 col-sm-2 col-xs-2 cart-row-padding"><input type="number" class="form-control" placeholder="Qty" value='+quantity+' id="quantity" min="1" max="999999999999" step=1 onkeypress="return isNumberKey(event)" style="width:100%"></div>\
                                <div class="col-md-2 col-sm-2 col-xs-2"><h5>'+cost+'</h5></div>\
                                <div class="col-md-1 col-sm-2 col-xs-2 cart-row-padding"><div class="cancel"><button class="glyphicon glyphicon-trash btn btn-danger btn-sm" style="padding-top:10px;"></button></div></div>\
                                </div>')

        }       
       
       $('#exampleModal').modal('hide')
        calculate_grand_total()
    })


    $(document).on("click","div.cancel",function(){
        $(this).parent().parent().remove()
        calculate_grand_total()
    })

    var max_chars =12;
    $(document).on('input',"#quantity",function(e) { 
      if ($(this).val().length >= 12) { 
          $(this).val($(this).val().substr(0, max_chars));
       }
       $(this).parent().parent().attr("quantity",$(this).val()) 
       calculate_grand_total()  
            
    });

     $(document).on('keydown',"#quantity",function(e) {
        if ( ( e.keyCode== 48 && !$(this).val() ) ||  ( $(this).val() >= 999999999999 && !check_for_provided_keys(e.keyCode)  )){
          e.preventDefault();
        }
            
    });


    $(document).on('keydown',"#modal_item_quantity",function(e) {
      if ( (e.keyCode== 48 && !$(this).val() ) || ( $(this).val() >= 999999999999 && !check_for_provided_keys(e.keyCode)  )  ){
            e.preventDefault();
        } 
    });

   $("[name=vendor][type=text]").change(function(){
        check_for_render_thumbnails()
        if(!$(this).val()){
           execute_vendor_remove_span_trigger()
        }


    })

    $("[name=customer][type=text]").change(function(){
        if(!$(this).val()){
          execute_customer_remove_span_trigger()
        }
    })

    $("[name=sub_category][type=text]").change(function(){
        check_for_render_thumbnails()

    })


    $("[name=item][type=text]").change(function(){
        return_flag = validate_for_vendor_selection_on_item_selection()
        if (return_flag){
          item_dict = $.grep($.jStorage.get("item"), function(e){ return e.item_code == $("[name=item][type=text]").val(); });
          if(item_dict.length){
            render_thumbnails(item_dict)
          }
          else if(!$(this).val()){
             check_for_render_thumbnails()
          }
        }

    })

    $("[name=item][type=text]").scannerDetection(function(){
        return_flag = validate_for_vendor_selection_on_item_selection()
        if (return_flag){
          item_dict = $.grep($.jStorage.get("item"), function(e){ return e.item_code == $("[name=item][type=text]").val(); });        
          if(item_dict.length){
            $(".thumbnail").trigger("click")
          }     
        }
     })

      // $("[name=item][type=text]").keypress(function(){
      //   // return_flag = validate_for_vendor_selection_on_item_selection()
      //   // if (return_flag){
      //   //   execute_item_search_span_trigger()  
      //   // }     
      // })
 
      $("[name=sub_category][type=text]").keypress(function(){
        execute_sub_category_search_span_trigger()         
      })

    $("#submit_order").click(function(){
        return_value = validate_for_customer_and_vendor_selection()
        validate_cart_body_empty()
        if (return_value == false && $("#cart_body").children().length !=0){          
          create_and_submit_order_data()
        }
    })

     $("#sign_out").click(function(){
       window.location = window.location.origin;
       $.jStorage.deleteKey("user")
       $.jStorage.deleteKey("domain")
       $.jStorage.deleteKey("email")
    })

    $("#auto_sync").click(function(){
       $("#auto_sync_model").modal('show')
       $("#auto_sync_model").find(".modal-title").text("Update System")
       $("#auto_sync_model").find('.modal-body').html('<b>Are you sure you want to update the system ?</b>')
       $("#auto_sync_model").find('.modal-footer').html('<button type="submit" class="btn btn-success" id="continue_auto_sync">Continue</button><button type="submit" class="btn btn-primary" id="cancel_auto_sync">Cancel</button>')

    })

    $(document).on("click","#continue_auto_sync",function(){
      start_auto_sync()
    })

    $(document).on("click","#cancel_auto_sync",function(){
      $("#auto_sync_model").modal("hide")
    })

    $("#cust_address").click(function(){
      if ($("[name=customer][type=text]").val()){
        $("#validate_model").modal("show")
         cust_address = get_customer_address()
        $("#validate_model").find(".modal-title").text("Customer Address")
        $("#validate_model").find(".modal-body").html("<textarea class='form-control textarea-address' disabled rows='8'>{0}</textarea>".replace("{0}",cust_address))  
      }else{
        show_message("Please Select Customer First","Mandatory Field")
      }
      
    })
   

    // $("#cancel_auto_sync").click(function(){
    //   $("#auto_sync_model").modal("hide")
    // })

    // $("#cancel_auto_sync").click(function(){
    //   $("#auto_sync_model").modal("hide")
    // })

    $("#modal_item_quantity").keyup(function(args){
      if ( !check_for_provided_keys(args.keyCode) ){
        if ($(this).val().length >= 12) { 
           $(this).val($(this).val().substr(0, max_chars));
        }
      }
      if (args.keyCode == 13) {
          $('#add_to_cart').click();
          return false;
      }
    })

    $("#brand").click(function(){
      window.location.reload()
    })
    
    var d = new Date
    $("#year").text("  "+d.getFullYear())

    init_for_item_span_trigger()
    init_for_sub_category_span_trigger()
    // init_for_vendor_span_trigger()
    // init_for_customer_span_trigger()
    create_orders_from_jstorage_data()
    show_message_for_selection_of_vendor()
  });


function get_customer_address(){
    customer_dict =  $.grep($.jStorage.get("customer"),function(e){
      return e.customer_id == $("[name=customer][type=text]").val()
    })
    if (customer_dict){
      return customer_dict[0].cust_address ?  customer_dict[0].cust_address : "Customer Address Not Available"
    }else{
      return "Customer Address Not Available"
    }

}



function init_for_sorted_item_rendering(item_list){
    flush_select_ul_fields_for_data("item")
    $.each(item_list,function(index,value){
        $("body").find('select[id=item]').append("<option>{0}</option>".replace("{0}",value))

        })
   append_item_list_to_ul(item_list)
   $('select[id=item]').my_combobox(item_list);

}


function init_for_all_item_rendering(){
  flush_select_ul_fields_for_data("item")
  append_all_items_to_select()
  append_all_items_to_ul()

}

function flush_select_ul_fields_for_data(data_name){
  $("body").find('ul[id={0}]'.replace("{0}",data_name)).empty()
  $("body").find('select[id={0}]'.replace("{0}",data_name)).empty()
}

function execute_common_data_rendering(data_list,data_name){
  flush_select_ul_fields_for_data(data_name)
  $.each(data_list,function(index,value){
      $("body").find('select[id={0}]'.replace("{0}",data_name)).append("<option>{0}</option>".replace("{0}",value))

    })
  append_data_list_to_ul(data_list,data_name)
  $('select[id={0}]'.replace("{0}",data_name)).my_combobox(data_list);
}



function append_data_list_to_ul(data_list,data_name){
  $.each(data_list,function(index,value){
      strong_tag = create_custom_ul_for_data(value)
       $("body").find('ul[id={0}]'.replace("{0}",data_name)).append("<li  data-value='{1}'><a href=#>{0}</a></li>".replace("{0}",strong_tag).replace("{1}",value))

  }) 

}

function create_custom_ul_for_data(data){
  var strong_tag = ''
  $.each(data.split(''),function(index,value){
      strong_tag = strong_tag + '<strong></strong>{0}'.replace("{0}",value)
  })
  return strong_tag

}


function calculate_grand_total(){
    total_value = 0.0
    $.each($("#cart_body").children(),function (argument) {
        if (parseFloat($(this).attr("quantity"))){
             total_value = total_value + parseFloat($(this).attr("quantity")) * parseFloat($(this).attr("cost"))
        }

    })
    $("#grand_total").text(total_value).css("font-weight","bold")

}


function append_all_items_to_select(){
    $.each($.jStorage.get("item"),function(index,value){
        $("body").find('select[id=item]').append("<option>{0}</option>".replace("{0}",value.item_code))
    })
}

function append_all_items_to_ul(){
     item_list = []   
     $.each($.jStorage.get("item"),function(index,value){
        strong_tag = create_custom_ul(value.item_code,value.item_description)
        $("body").find('ul[id=item]').append("<li  data-value='{1}'><a href=#>{0}</a></li>".replace("{0}",strong_tag).replace("{1}",value.item_code))
        item_list.push(value.item_code)
    })
     $('select[id=item]').my_combobox(item_list);
}

function append_item_list_to_ul(item_list){
    item_dict = get_item_dict_from_item_list(item_list)    
    $.each(item_dict,function(index,value){
        strong_tag = create_custom_ul(value.item_code,value.item_description)
         $("body").find('ul[id=item]').append("<li  data-value='{1}'><a href=#>{0}</a></li>".replace("{0}",strong_tag).replace("{1}",value.item_code))


    })
}

function get_item_dict_from_item_list(item_list){
  item_dict = []
  $.each(item_list,function(index,value){
      $.grep($.jStorage.get("item"), function(e){ 
          if (e.item_code == value){
              return item_dict.push(e)
          } 
      });
  })
  return item_dict
}

function create_custom_ul(value_name,value_desc){
    strong_tag = ''
    $.each(value_name.split(''),function(index,value){
        strong_tag = strong_tag + '<strong></strong>{0}'.replace("{0}",value)
    })
    strong_tag = strong_tag + "<br><p style='font-size:12px'>"
    $.each(value_desc.split(''),function(index,value){
        strong_tag = strong_tag + '<strong></strong>{0}'.replace("{0}",value) 
    })

    return strong_tag + "</p>"
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31
    && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function get_qty_of_existing_item(item_code){
    var quantity = 1
    existing_row = check_if_item_exists_in_cart(item_code)
    if (existing_row.length) {
        quantity = $(existing_row).attr("quantity") 
    }
   return quantity
}


function check_if_item_exists_in_cart(item_code){
    existing_row = $.grep($("#cart_body").children(), function(e){ return $(e).attr("item_code") == String(item_code); })
    return existing_row
}

function get_item_against_this_vendor(vendor){
    vendor_dict = $.grep($.jStorage.get("vendor"), function(e){ return e.vendor_id == vendor; }); 
    if (parseInt(Object.keys(vendor_dict).length)){
         return vendor_dict[0].item_list
    }
}

function get_item_against_this_sub_category(sub_category){
    item_list = []
    item_dict = $.grep($.jStorage.get("item"), function(e){ return e.item_group == sub_category; });
     if (parseInt(Object.keys(item_dict).length)){
         $.each(item_dict,function(index,value){
            item_list.push(value.item_code)
         })
    } 
    return item_list
}

function get_item_against_this_sub_category_and_vendor(sub_category,vendor){
    item_list = get_item_against_this_vendor(vendor)
    item_list = check_if_item_exists_against_this_subcategory(sub_category,item_list)
    return item_list
}

function check_if_item_exists_against_this_subcategory(sub_category,item_list){
    sorted_item_list = []
    $.each(item_list,function(index,value){
        $.grep($.jStorage.get("item"), function(e){ 
            if (e.item_group == sub_category && e.item_code == value){
                        
                return sorted_item_list.push(e.item_code); 
            }

        }); 

    })    

    return sorted_item_list
}



function get_sub_category_against_item_list(item_list){
  sub_category_list = []
    $.each(item_list,function(index,value){
        $.grep($.jStorage.get("item"), function(e){ 
            if (e.item_code == value){
                return sub_category_list.push(e.item_group)
            } 
        });
    })
    return sub_category_list
}


function init_for_item_span_trigger(){
    $("[name=item][type=text]").siblings("span").on("click","",function(){

        if (  $("[name=item][type=text]").siblings("span").find("span:first").attr("check") == "active" ){
              validate_for_vendor_selection_on_item_selection()
              execute_item_search_span_trigger()
        
        }else{
            execute_item_remove_span_trigger()
        }
               

   });

}

function execute_item_search_span_trigger(){
    console.log("item search")
    if ($("[name=sub_category][type=text]").val() &&  !$("[name=vendor][type=text]").val()){
      item_list = get_item_against_this_sub_category($("[name=sub_category][type=text]").val())
      return item_list
      // init_for_sorted_item_rendering(item_list)
    }
    else if($("[name=sub_category][type=text]").val()  &&  $("[name=vendor][type=text]").val() ){
      item_list = get_item_against_this_sub_category_and_vendor($("[name=sub_category][type=text]").val() ,$("[name=vendor][type=text]").val())
      return item_list
      // init_for_sorted_item_rendering(item_list)
    }
    else if(!$("[name=sub_category][type=text]").val() && !$("[name=vendor][type=text]").val() ){
      var item_list = []
      $.each($.jStorage.get("item"),function(index,value){
         item_list.push(value.item_code)
        })
      return item_list
      // init_for_all_item_rendering()

    }
    else if ($("[name=vendor][type=text]").val() && !$("[name=sub_category][type=text]").val() ){
      item_list = get_item_against_this_vendor($("[name=vendor][type=text]").val())
      return item_list
      // init_for_sorted_item_rendering(item_list)
    }

}


function execute_item_remove_span_trigger(){   
  check_for_render_thumbnails()   
}



function init_for_sub_category_span_trigger(){

    $("[name=sub_category][type=text]").siblings("span").on("click","",function(){
       
        if (  $("[name=sub_category][type=text]").siblings("span").find("span:first").attr("check") != "active" ){
              execute_sub_category_remove_span_trigger()
        
        }
        else if ( $("[name=sub_category][type=text]").siblings("span").find("span:first").attr("check") == "active"){
              execute_sub_category_search_span_trigger()
          }
    });   
}




function execute_sub_category_remove_span_trigger(){   
    check_for_render_thumbnails()   

}


function execute_sub_category_search_span_trigger(){
    if( $("[name=vendor][type=text]").val()){
      item_list = get_item_against_this_vendor($("[name=vendor][type=text]").val())
      sub_category_list = get_sub_category_against_item_list(item_list)
      sub_category_list = $.unique(sub_category_list)
      execute_common_data_rendering(sub_category_list,"sub_category")
    }
    else if(!$("[name=vendor][type=text]").val()){
      sub_category_list = $.jStorage.get("item_group")
       execute_common_data_rendering(sub_category_list,"sub_category")

    }   


}


// function init_for_vendor_span_trigger(){
//     $("[name=vendor][type=text]").siblings("span").on("click","",function(){
//        if (  $("[name=vendor][type=text]").siblings("span").find("span:first").attr("check") != "active" ){
//               show_message_for_selection_of_vendor()
        
//         }
//     }); 

// }


// function init_for_customer_span_trigger(){
//     $("[name=customer][type=text]").siblings("span").on("click","",function(){
//        if (  $("[name=customer][type=text]").siblings("span").find("span:first").attr("check") != "active" ){
              
             
        
//         }
//     }); 

// }

function execute_customer_remove_span_trigger(){
      $("#cart_body").empty() 
}

function execute_vendor_remove_span_trigger(){
    $('.item_thumnails').empty()
    $("#cart_body").empty()
    $("[name=item][type=text]").val("")
    $("[name=sub_category][type=text]").val("")
    $("[name=item][type=hidden]").parent().removeClass("combobox-selected")
    $("[name=sub_category][type=hidden]").parent().removeClass("combobox-selected")
    show_message_for_selection_of_vendor()   

}




function check_for_render_thumbnails(){
    if ($("[name=vendor][type=text]").val() &&  !$("[name=sub_category][type=text]").val()  && !$("[name=item][type=text]").val()){
        item_list = get_item_against_this_vendor($("[name=vendor][type=text]").val())
        item_dict = get_item_dict_from_item_list(item_list)
        render_thumbnails(item_dict)
    }

    // else if ($("[name=sub_category][type=text]").val() &&  !$("[name=vendor][type=text]").val()  && !$("[name=item][type=text]").val()){
    //     item_list = get_item_against_this_sub_category($("[name=sub_category][type=text]").val())
    //     item_dict = get_item_dict_from_item_list(item_list)
    //     render_thumbnails(item_dict)
    // }

    else if ($("[name=sub_category][type=text]").val() &&  $("[name=vendor][type=text]").val()  && !$("[name=item][type=text]").val()){
        item_list = get_item_against_this_sub_category_and_vendor($("[name=sub_category][type=text]").val() ,$("[name=vendor][type=text]").val())
        item_dict = get_item_dict_from_item_list(item_list)
        render_thumbnails(item_dict)
    }
    else if (!$("[name=sub_category][type=text]").val() &&  !$("[name=vendor][type=text]").val()  && !$("[name=item][type=text]").val()){
           show_message_for_selection_of_vendor()        

    }


}

function render_thumbnails(item_dict){

    $('.item_thumnails').empty()
    var default_img = "../vendor/images/thumb-default.gif"
    if ($("[name=vendor][type=text]").val()){
      var initial =  $("[name=vendor][type=text]").val()[0].toLowerCase()
      default_img = image_object[initial][0]
    }
    $.each(item_dict,function(index,value){
    $('.item_thumnails').append('<div class="col-sm-4 col-md-3 col-xs-6 thumbnail-padding">\
                        <div class="thumbnail"    data-toggle="modal" data-target="#exampleModal" data-item_code="'+value.item_code+'" data-description="'+value.item_description+'" >\
                        <div  class="thumbnail-img">\
                        <img style="width:60px;height:60px" src='+default_img+'></img>\
                        </div>\
                        <div>\
                              <p style="text-align:center;padding-top:5px"><b >'+value.item_code+'</b></p>\
                              <p style="font-size:11px" >'+value.item_description.slice(0,50)+'</p>\
                              </div>\
                              </div>\
                               </div>')


    })

}


function validate_for_customer_and_vendor_selection(){

    my_obj = {"Customer":$("[name=customer][type=text]").val() , "Vendor": $("[name=vendor][type=text]").val() }
    my_flag = false
    $.each(my_obj,function(key,value){
        if(!value){
            $('#validate_model').modal("show")
             $('#validate_model').find('.modal-body').text('Please Select {0} for Order Submission '.replace("{0}",key))
            my_flag = true
            return false
        }

    })

    return my_flag
}



function validate_for_vendor_selection_on_item_selection(){
    console.log("vendor validate")
    if(!$("[name=vendor][type=text]").val()){
        show_message('Please Select Vendor for Item Selection',"Mandatory Field")
        return false
    }
    return true
}


function create_and_submit_order_data(){
   call_block_ui()
   order_dict = create_order_data() 

  if ($.jStorage.get("orders") === null){
    $.jStorage.set("orders",[])

  }

  init_for_so_po_creation(order_dict)
}



function create_order_data(){
  this.order_dict = {}
  time_stamp = Date.now()
  this.order_dict[time_stamp] = {}
  this.order_dict[time_stamp]["customer"] = $("[name=customer][type=text]").val()
  this.order_dict[time_stamp]["supplier"] = $("[name=vendor][type=text]").val() 
  this.order_dict[time_stamp]["selling_price_list"] = $.jStorage.get("price_list")
  this.order_dict[time_stamp]["grand_total"] = $("#grand_total").text()
  this.order_dict[time_stamp]["order_domain"] = $.jStorage.get("domain")
  this.customer_address = get_customer_address()
  this.customer_address = this.customer_address == "Customer Address Not Available" ? "" : this.customer_address
  this.order_dict[time_stamp]["customer_full_address"] =  this.customer_address
  this.order_dict[time_stamp]["items"] = []
  var me = this
  $.each($("#cart_body").children(),function(index,value){
      this.item_row_dict = {}
      this.item_row_dict["item_code"] = $(this).attr("item_code")
      this.item_row_dict["description"] = $(this).attr("description")
      this.item_row_dict["qty"] = $(this).attr("quantity")
      this.item_row_dict["rate"] = $(this).attr("cost")
      me.order_dict[time_stamp]["items"].push(this.item_row_dict)
  })
  return this.order_dict
}



function init_for_so_po_creation(order_dict){
  connection_flag = check_for_internet_connectivity()
  if (connection_flag == true){
        var arg = {}
        arg['order_dict'] = JSON.stringify(order_dict);
        arg['email'] = $.jStorage.get("email")
          $.ajax({
              method: "POST",
              url: "http://{0}/api/method/spos.spos.spos_api.create_so_and_po".replace("{0}",$.jStorage.get("domain")),
              data: arg,
              timeout:15000,
              dataType: "json",
              success:function(r){
                if (r.message == 'fail'){
                  store_order_in_jstorage(order_dict)  
                }
                waitingDialog.hide();
                show_message('Order Submitted Successfully',"Success......")  
                clear_accounting_data_after_submission() 
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                store_order_in_jstorage(order_dict)
                waitingDialog.hide();
                show_message('Order Submitted Successfully',"Success......")
                clear_accounting_data_after_submission() 
              }
            });
  }
  else if(connection_flag == false)
  {
    store_order_in_jstorage(order_dict)
    waitingDialog.hide();
    show_message('Order Submitted Successfully',"Success.....")
    clear_accounting_data_after_submission() 
  }
}

function store_order_in_jstorage(order_dict){
  item_list = $.jStorage.get("orders")
  item_list.push(order_dict)
  $.jStorage.set("orders",item_list) 
}

function show_message(message,title){
  $('#validate_model').modal("show")
  $('#validate_model').find('.modal-title').text(title)
  $('#validate_model').find('.modal-body').text(message)
}

function validate_cart_body_empty(){
  if (!$("#cart_body").children().length){
      $('#validate_model').modal("show")
      $('#validate_model').find('.modal-body').text('Empty Cart Area Found') 
  }
  
}

function check_for_internet_connectivity(){
 var flag
  $.ajax({
        type: "GET",
        url: "http://{0}/api/method/spos.spos.spos_api.check_for_connectivity".replace("{0}",$.jStorage.get("domain")),
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

function create_orders_from_jstorage_data(){
    setInterval(function(){
      connection_flag = check_for_internet_connectivity()
      if (connection_flag == true){
        init_for_so_po_creation_from_jstorage()
      }

    },600000)
}

function init_for_so_po_creation_from_jstorage(){
  $.each($.jStorage.get("orders"),function(index,value){
     try {
          if (value[Object.keys(value)[0]].order_domain == $.jStorage.get("domain")){
              connection_flag = check_for_internet_connectivity()
              if (connection_flag == true){          
                  execute_so_po_creation_from_jstorage(value)
              }
              else if (connection_flag == false){
                  return false
              }
            }  
        }
     catch (err){
     }   
    
    })
}

function execute_so_po_creation_from_jstorage(order_dict){
    var arg = {}
    arg['order_dict'] = JSON.stringify(order_dict);
    arg['email'] = $.jStorage.get("email")
    arg['sync'] = 1
    $.ajax({
          method: "POST",
          url: "http://{0}/api/method/spos.spos.spos_api.create_so_and_po".replace("{0}",$.jStorage.get("domain")),
          data: arg,
          timeout:15000,
          dataType: "json",
          success:function(r){
            if (r.message == 'success'){
              remove_order_from_jstorage(order_dict)  
            }
            
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
          }
      });
}

function remove_order_from_jstorage(order_dict){
   order_key = Object.keys(order_dict)[0]
   orders_list = $.jStorage.get("orders")
   $.each(orders_list, function(index,value){
        if(Object.keys(value)[0] == order_key){
            orders_list.splice(index, 1);
            $.jStorage.set("orders",orders_list)
            return false
        } 

    });
}


function call_block_ui(){
 waitingDialog.show('Please wait.......', {dialogSize: 'md'});
}


function clear_accounting_data_after_submission(){
  execute_vendor_remove_span_trigger()
  $("[name=vendor][type=hidden]").parent().removeClass("combobox-selected")
  $("[name=vendor][type=text]").val("")

}


function start_auto_sync(){
  $("#auto_sync_model").modal("hide")
  connection_flag = check_for_internet_connectivity()
    if (connection_flag == true){
    waitingDialog.show('Sync in progress.Please wait........', {dialogSize: 'md'});
    $.ajax({
          method: "GET",
          url: "http://"+$.jStorage.get("domain")+"/api/method/spos.spos.spos_api.get_pos_required_data?sales_user="+$.jStorage.get("email"),
          dataType: "json",
          timeout:15000,
          success:function(result){
            set_pos_required_data_in_jstorage(result.message)
            init_for_required_data_rendering()
            setTimeout(function () {waitingDialog.hide();},1000) 
          },
          error: function(XMLHttpRequest, textStatus, errorThrown){
            setTimeout(function () {waitingDialog.hide();},1000) 
            show_message('Sync failed due to server is taking lot of time.Please try later.',"Error ....")
            window.location = "../"
          }
    }); 
  }
  else if(connection_flag == false){
       show_message('Sync failed due to unavailablity of internet connectivity',"Error .....")
  }  
}



function set_pos_required_data_in_jstorage(pos_required_data){
  var key_list = ["customer","vendor","item_group","item","price_list","company"]
  $.each(key_list,function(index,value){
     $.jStorage.set(value,pos_required_data[value])    
  })
}


function init_for_required_data_rendering(){
  init_for_all_item_rendering()
  execute_common_data_rendering($.jStorage.get("item_group"),"sub_category")
  vendor_list = get_vendor_list($.jStorage.get("vendor"))
  execute_common_data_rendering(vendor_list,"vendor")
  init_for_all_customer_rendering()
  window.location.reload()
}

function get_vendor_list(vendor_dict){
  vendor_list = []
  $.each(vendor_dict,function(index,value){
    vendor_list.push(value.vendor_id)
  })
  return vendor_list
}

function init_for_all_customer_rendering(){
  flush_select_ul_fields_for_data("customer")
  append_all_customer_to_select()
  append_all_customer_to_ul()
}

function append_all_customer_to_select(){
  $.each($.jStorage.get("customer"),function(index,value){
      $("body").find('select[id=customer]').append("<option>{0}</option>".replace("{0}",value.customer_id))
  })
}

function append_all_customer_to_ul(){
  cust_list = []   
  $.each($.jStorage.get("customer"),function(index,value){
    strong_tag = create_custom_ul(value.customer_id,value.customer_name)
    $("body").find('ul[id=customer]').append("<li  data-value='{1}'><a href=#>{0}</a></li>".replace("{0}",strong_tag).replace("{1}",value.customer_id))
    cust_list.push(value.customer_id)
  })
  $('select[id=customer]').my_combobox(cust_list);
}

function show_message_for_selection_of_vendor(){
    $('.item_thumnails').html("<div class='well' style='height:280px;margin-top:50px;margin-right:10px'><h1 style='font-size:50px'>Please Choose Vendor to display Items</h1></div>")  
}

function check_for_provided_keys(key_code){
  key_obj = {"8":"eight","40":"fourty","38":"fourty","46":"fourty six","37":"thirty seven","39":"thirty nine"}
  return key_code in key_obj
}