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
    "z":["../images/letters/blue/letters_s-26.png"]

}






$(document).ready(function(){
    if(!$.jStorage.get("user")){
       window.location = "spos/";
    }

    $("a.dropdown-toggle.user").prepend("<p style='display: inline-block;'>{0}</p>".replace("{0}",$.jStorage.get("user")))
      
    $.each($.jStorage.get("customer"),function(index,value){
    	$("body").find('select[id=customer]').append("<option>{0}</option>".replace("{0}",value.customer_id))

    })

    $.each($.jStorage.get("vendor"),function(index,value){
    	$("body").find('select[id=vendor]').append("<option>{0}</option>".replace("{0}",value.vendor_id))

    })



    $.each($.jStorage.get("item_group"),function(index,value){
    	$("body").find('select[id=sub_category]').append("<option>{0}</option>".replace("{0}",value))

    })

    append_all_items_to_select()


   $('.combobox').combobox()

    render_thumbnails($.jStorage.get("item"))

        
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
             $("#cart_body").append('<div class="row pos-bill-row pos-bill-item" item_code="'+item_code+'" description="'+description+'" cost="'+cost+'"  quantity='+quantity+'>\
                                <div class="col-md-2 col-sm-2 col-xs-2"><h5>'+item_code+'</h5></div>\
                                <div class="col-md-4 col-sm-4 col-xs-4"><h5>'+description+'</h5></div>\
                                <div class="col-md-2 col-sm-2 col-xs-2"><input type="number" class="form-control" placeholder="Qty" value='+quantity+' id="quantity" min="0" onkeypress="return isNumberKey(event)" style="width:100%"></div>\
                                <div class="col-md-2 col-sm-2 col-xs-2"><h5>'+cost+'</h5></div>\
                                <div class="col-md-2 col-sm-2 col-xs-2"><div class="cancel"><span class="glyphicon glyphicon-trash" style="padding-top:10px;"></span></div></div>\
                                </div>')

        }       
       
       $('#exampleModal').modal('hide')
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


   $("[name=vendor][type=text]").change(function(){
        check_for_render_thumbnails()
        if(!$(this).val()){
            check_for_render_thumbnails()
        }


    })


  

    $("[name=sub_category][type=text]").change(function(){
        check_for_render_thumbnails()
        if(!$(this).val()){
           check_for_render_thumbnails()
        }

    })



    $("[name=item][type=text]").change(function(){
        // $("[name=item][type=text]").siblings("span").find("span:first").attr("check","deactive")
        item_dict = $.grep($.jStorage.get("item"), function(e){ return e.item_code == $("[name=item][type=text]").val(); });        
        if(item_dict.length){
          render_thumbnails(item_dict)
        }         
        else if(!$(this).val()){

           check_for_render_thumbnails()
        }


    })

      $("[name=item][type=text]").keypress(function(){
         execute_item_search_span_trigger()
         validate_for_vendor_selection_on_item_selection()
      })
 

    $("#submit_order").click(function(){
        return_value = validate_for_customer_and_vendor_selection()
        if (return_value == false && $("#cart_body").children().length !=0){
          
          create_and_submit_order_data()
        }
    })

     $("#sign_out").click(function(){
       window.location = "spos/";
       $.jStorage.deleteKey("user")
       $.jStorage.deleteKey("domain")
       $.jStorage.deleteKey("email")
    })

     
    init_for_item_span_trigger()
    init_for_sub_category_span_trigger()
    init_for_vendor_span_trigger()
    create_orders_from_jstorage_data()

  });



function init_for_sorted_item_rendering(item_list){

    $("body").find('ul[id=item]').empty()
    $("body").find('select[id=item]').empty()
    $.each(item_list,function(index,value){
        $("body").find('select[id=item]').append("<option>{0}</option>".replace("{0}",value))

        })
   append_item_list_to_ul(item_list)
   $('select[id=item]').my_combobox(item_list);

}


function init_for_all_item_rendering(){
    $("body").find('ul[id=item]').empty()
    $("body").find('select[id=item]').empty()
    append_all_items_to_select()
    append_all_items_to_ul()


}



function execute_common_sub_category_rendering(subcategory_list){
  $("body").find('ul[id=sub_category]').empty()
  $("body").find('select[id=sub_category]').empty()
  $.each(subcategory_list,function(index,value){
      $("body").find('select[id=sub_category]').append("<option>{0}</option>".replace("{0}",value))

    })
  append_subcategory_list_to_ul(subcategory_list)
  $('select[id=sub_category]').my_combobox(subcategory_list);
}



function append_subcategory_list_to_ul(subcategory_list){
  $.each(subcategory_list,function(index,value){
      strong_tag = create_custom_ul_for_sub_category(value)
       $("body").find('ul[id=sub_category]').append("<li  data-value='{1}'><a href=#>{0}</a></li>".replace("{0}",strong_tag).replace("{1}",value))

  }) 

}

function create_custom_ul_for_sub_category(sub_category){
  var strong_tag = ''
  $.each(sub_category.split(''),function(index,value){
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
        strong_tag = create_custom_ul(value)
         $("body").find('ul[id=item]').append("<li  data-value='{1}'><a href=#>{0}</a></li>".replace("{0}",strong_tag).replace("{1}",value.item_code))
           item_list.push(value.item_code)
    })
     $('select[id=item]').my_combobox(item_list);
}

function append_item_list_to_ul(item_list){
    item_dict = get_item_dict_from_item_list(item_list)
    
     $.each(item_dict,function(index,value){
        strong_tag = create_custom_ul(value)
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

function create_custom_ul(value){
    my_str = value.item_code
    strong_tag = ''
    $.each(my_str.split(''),function(index,value){
        strong_tag = strong_tag + '<strong></strong>{0}'.replace("{0}",value)
    })
    strong_tag = strong_tag + "<br><p style='font-size:12px'>"
    $.each(value.item_description.split(''),function(index,value){
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
    if ($("[name=sub_category][type=text]").val() &&  !$("[name=vendor][type=text]").val()){
      item_list = get_item_against_this_sub_category($("[name=sub_category][type=text]").val())
      init_for_sorted_item_rendering(item_list)
    }
    else if($("[name=sub_category][type=text]").val()  &&  $("[name=vendor][type=text]").val() ){
      item_list = get_item_against_this_sub_category_and_vendor($("[name=sub_category][type=text]").val() ,$("[name=vendor][type=text]").val())
      init_for_sorted_item_rendering(item_list)
    }
    else if(!$("[name=sub_category][type=text]").val() && !$("[name=vendor][type=text]").val() ){
      init_for_all_item_rendering()

    }
    else if ($("[name=vendor][type=text]").val() && !$("[name=sub_category][type=text]").val() ){
      item_list = get_item_against_this_vendor($("[name=vendor][type=text]").val())
      init_for_sorted_item_rendering(item_list)
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
      execute_common_sub_category_rendering(sub_category_list)
    }
    else if(!$("[name=vendor][type=text]").val()){
      sub_category_list = $.jStorage.get("item_group")
       execute_common_sub_category_rendering(sub_category_list)

    }   


}


function init_for_vendor_span_trigger(){


    $("[name=vendor][type=text]").siblings("span").on("click","",function(){
       if (  $("[name=vendor][type=text]").siblings("span").find("span:first").attr("check") != "active" ){
              execute_vendor_remove_span_trigger()
        
        }
    }); 


}

function execute_vendor_remove_span_trigger(){   
         check_for_render_thumbnails()   

}




function check_for_render_thumbnails(){

    if ($("[name=vendor][type=text]").val() &&  !$("[name=sub_category][type=text]").val()  && !$("[name=item][type=text]").val()){
        item_list = get_item_against_this_vendor($("[name=vendor][type=text]").val())
        item_dict = get_item_dict_from_item_list(item_list)
        render_thumbnails(item_dict)
    }

    else if ($("[name=sub_category][type=text]").val() &&  !$("[name=vendor][type=text]").val()  && !$("[name=item][type=text]").val()){
        item_list = get_item_against_this_sub_category($("[name=sub_category][type=text]").val())
        item_dict = get_item_dict_from_item_list(item_list)
        render_thumbnails(item_dict)
    }

    else if ($("[name=sub_category][type=text]").val() &&  $("[name=vendor][type=text]").val()  && !$("[name=item][type=text]").val()){
        item_list = get_item_against_this_sub_category_and_vendor($("[name=sub_category][type=text]").val() ,$("[name=vendor][type=text]").val())
        item_dict = get_item_dict_from_item_list(item_list)
        render_thumbnails(item_dict)
    }

    else if (!$("[name=sub_category][type=text]").val() &&  !$("[name=vendor][type=text]").val()  && !$("[name=item][type=text]").val()){
         render_thumbnails($.jStorage.get("item"))

    }


}

function render_thumbnails(item_dict){

    $('.item_thumnails').empty()
    $.each(item_dict,function(index,value){
    var initial = value.item_description[0].toLowerCase()
    $('.item_thumnails').append('<div class="col-sm-4 col-md-3 col-xs-6">\
                        <div class="thumbnail"    data-toggle="modal" data-target="#exampleModal" data-item_code="'+value.item_code+'" data-description="'+value.item_description+'" >\
                        <div  class="thumbnail-img">\
                        <img style="width:60px;height:60px" src='+image_object[initial][0]+'></img>\
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


function set_pos_required_data_in_jstorage(){
  var key_list = ["customer","vendor","item_group","item"]
  $.each(key_list,function(index,value){
     $.jStorage.set(value,pos_required_data[value])    
  })
}


function validate_for_vendor_selection_on_item_selection(){

    if(!$("[name=vendor][type=text]").val()){
        $('#validate_model').modal("show")
         $('#validate_model').find('.modal-body').text('Please Select Vendor for Item Selection')
    }

}


function create_and_submit_order_data(){
   order_dict = create_order_data() 

  if ($.jStorage.get("orders") === null){
    $.jStorage.set("orders",[])

  }

  init_for_so_po_creation(order_dict)
  console.log(order_dict)
}



function create_order_data(){
  this.order_dict = {}
  time_stamp = Date.now()
  this.order_dict[time_stamp] = {}
  this.order_dict[time_stamp]["customer"] = $("[name=customer][type=text]").val()
  this.order_dict[time_stamp]["supplier"] = $("[name=vendor][type=text]").val() 
  this.order_dict[time_stamp]["selling_price_list"] = $.jStorage.get("price_list")
  this.order_dict[time_stamp]["grand_total"] = $("#grand_total").text()
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
        arg['email'] = JSON.stringify($.jStorage.get("email"))
          $.ajax({
              method: "POST",
              url: "http://{0}/api/method/spos.spos.spos_api.create_so_and_po".replace("{0}",$.jStorage.get("domain")),
              data: arg,
              timeout:7000,
              dataType: "json",
              success:function(r){
                if (r.message == 'fail'){
                  store_order_in_jstorage(order_dict)  
                }
                show_order_submission_message()  
                
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(textStatus)
                store_order_in_jstorage(order_dict)
                show_order_submission_message()
              }
            });
  }
  else if(connection_flag == false)
  {
    store_order_in_jstorage(order_dict)
    show_order_submission_message() 
  }
}

function store_order_in_jstorage(order_dict){
  item_list = $.jStorage.get("orders")
  item_list.push(order_dict)
  $.jStorage.set("orders",item_list) 
}

function show_order_submission_message(){
  $('#validate_model').modal("show")
  $('#validate_model').find('.modal-body').text('Order Submitted Successfully')
}


function check_for_internet_connectivity(){
  var xhr = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );
  xhr.open( "HEAD","http://spos/", false)
  try {
        xhr.send();
        if ( xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304) ){
          return true
        };
    } 
    catch (error) {
        return false
    }

}

function create_orders_from_jstorage_data(){
    setInterval(function(){
      connection_flag = check_for_internet_connectivity()
      if (connection_flag == true){
        init_for_so_po_creation_from_jstorage()
      }

    },100000)
}

function init_for_so_po_creation_from_jstorage(){
    $.each($.jStorage.get("orders"),function(index,value){
      connection_flag = check_for_internet_connectivity()
        if (connection_flag == true){          
            execute_so_po_creation_from_jstorage(value)
        }
        else if (connection_flag == false){
            return false
        }

    })
}

function execute_so_po_creation_from_jstorage(order_dict){
    var arg = {}
    arg['order_dict'] = JSON.stringify(order_dict);
    arg['email'] = JSON.stringify($.jStorage.get("email"))
    $.ajax({
          method: "POST",
          url: "http://{0}/api/method/spos.spos.spos_api.create_so_and_po".replace("{0}",$.jStorage.get("domain")),
          data: arg,
          timeout:7000,
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