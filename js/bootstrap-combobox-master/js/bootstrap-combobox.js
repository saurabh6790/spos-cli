/* =============================================================
 * bootstrap-combobox.js v1.1.6
 * =============================================================
 * Copyright 2012 Daniel Farrell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

!function( $ ) {

 "use strict";

 /* COMBOBOX PUBLIC CLASS DEFINITION
  * ================================ */

  var Combobox = function ( element, options ) {
    this.options = $.extend({}, $.fn.combobox.defaults, options);
    this.$source = $(element);
    this.$container = this.setup();
    this.$element = this.$container.find('input[type=text]');
    this.$target = this.$container.find('input[type=hidden]');
    this.$button = this.$container.find('.dropdown-toggle');
    this.$menu = $(this.options.menu).appendTo('body');
    $(this.$menu).attr("id",$(element).attr("id"))
    this.template = this.options.template || this.template
    this.matcher = this.options.matcher || this.matcher;
    this.sorter = this.options.sorter || this.sorter;
    this.highlighter = this.options.highlighter || this.highlighter;
    this.shown = false;
    this.selected = false;
    this.refresh();
    this.transferAttributes();
    this.listen();
    // this.render = this.render()
    // this.show = this.show()

  };


  Combobox.prototype =  {

    constructor: Combobox

  , setup: function () {
      var combobox = $(this.template());
      this.$source.before(combobox);
      this.$source.hide();
      return combobox;
    }

  , disable: function() {
      this.$element.prop('disabled', true);
      this.$button.attr('disabled', true);
      this.disabled = true;
      this.$container.addClass('combobox-disabled');
    }

  , enable: function() {
      this.$element.prop('disabled', false);
      this.$button.attr('disabled', false);
      this.disabled = false;
      this.$container.removeClass('combobox-disabled');
    }
  , parse: function () {
      var that = this
        , map = {}
        , source = []
        , selected = false
        , selectedValue = '';
      this.$source.find('option').each(function() {
        var option = $(this);
        if (option.val() === '') {
          that.options.placeholder = option.text();
          return;
        }
        map[option.text()] = option.val();
        source.push(option.text());
        if (option.prop('selected')) {
          selected = option.text();
          selectedValue = option.val();

        }
      })
      this.map = map;
      if (selected) {
        this.$element.val(selected);
        this.$target.val(selectedValue);
        this.$container.addClass('combobox-selected');
        this.selected = true;
      }
      return source;
    }

  , transferAttributes: function() {
    this.options.placeholder = this.$source.attr('data-placeholder') || this.options.placeholder
    this.$element.attr('placeholder', this.options.placeholder)
    this.$target.prop('name', this.$source.prop('name'))
    this.$element.attr('name', this.$source.attr('name'))
    this.$target.val(this.$source.val())
    this.$source.removeAttr('name')  // Remove from source otherwise form will pass parameter twice.
    this.$element.attr('required', this.$source.attr('required'))
    this.$element.attr('rel', this.$source.attr('rel'))
    this.$element.attr('title', this.$source.attr('title'))
    this.$element.addClass(this.$source.attr('class')+' form-control')
    this.$element.attr('tabindex', this.$source.attr('tabindex'))
    this.$source.removeAttr('tabindex')
    if (this.$source.attr('disabled')!==undefined)
      this.disable();
  }

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value');
      this.$element.val(this.updater(val)).trigger('change');
      this.$target.val(this.map[val]).trigger('change');
      this.$source.val(this.map[val]).trigger('change');
      this.$container.addClass('combobox-selected');
      this.selected = true;
      return this.hide();
    }

  , updater: function (item) {
      return item;
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      });

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show();

      $('.dropdown-menu').on('mousedown', $.proxy(this.scrollSafety, this));

      this.shown = true;
      return this;
    }

  , hide: function () {
      this.$menu.hide();
      $('.dropdown-menu').off('mousedown', $.proxy(this.scrollSafety, this));
      this.$element.on('blur', $.proxy(this.blur, this));
      this.shown = false;
      return this;
    }

  , lookup: function (event) {
      this.query = this.$element.val();
      return this.process(this.source,this.$element.attr("name"));
    }

  , process: function (items,name) {
      var that = this;

      items = $.grep(items, function (item) {
        return that.matcher(item,name);
      })
      items = this.sorter(items);

      if (!items.length) {
        return this.shown ? this.hide() : this;
      }
      return this.render(items.slice(0, this.options.items)).show();
    }

  , template: function() {
      if (this.options.bsVersion == '2') {
        return '<div class="combobox-container"><input type="hidden" /> <div class="input-append"> <input type="text"  autocomplete="off" /> <span class="add-on dropdown-toggle" data-dropdown="dropdown"> <span class="glyphicon glyphicon-search"/> <i class="icon-remove"/> </span> </div> </div>'
      } else {
        return '<div class="combobox-container"> <input type="hidden" /> <div class="input-group"> <input type="text"  autocomplete="off"   /> <span class="input-group-addon dropdown-toggle" data-dropdown="dropdown"> <span class="glyphicon glyphicon-search"  /> <span class="glyphicon glyphicon-remove" id="remove"/> </span> </div> </div>'
      }
    }

  , matcher: function (item,name) {
      if (name=='customer'){
       $.each($.jStorage.get("customer"), function(index,e){ 
          if (e.customer_id == item){
            item += e.customer_name
            return false
          }; 
        });
      }
      if (name=='item'){
       $.each($.jStorage.get("item"), function(index,e){ 
          if (e.item_code == item){
            item += e.item_description + e.barcode;
            return false

          }; 
        });
      }
      return ~item.toLowerCase().indexOf(this.query.toLowerCase());
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item;

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) {beginswith.push(item);}
        else if (~item.indexOf(this.query)) {caseSensitive.push(item);}
        else {caseInsensitive.push(item);}
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>';
      })
    }

  , render: function (items) {
      var that = this;
      var result= ''
      var result_attr = ''
      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item);
      if(that.$element[0].name == 'customer'){
        result = $.grep($.jStorage.get("customer"), function(e){ return e.customer_id == item; });
        i.find('a').html(that.highlighter(item)+"</br><p style='font-size:12px'>"+that.highlighter(result[0].customer_name)+"</p>");
      }
      else if(that.$element[0].name == 'item'){
         result = $.grep($.jStorage.get("item"), function(e){ return e.item_code == item; });
        i.find('a').html(that.highlighter(item)+"</br><p style='font-size:12px'>"+that.highlighter(result[0].item_description)+"</p>");
      }else{
        i.find('a').html(that.highlighter(item));
      }
        
        return i[0];
      })

      items.first().addClass('active');
      this.$menu.html(items);
      return this;
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next();

      if (!next.length) {
        next = $(this.$menu.find('li')[0]);
      }

      next.addClass('active');
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev();

      if (!prev.length) {
        prev = this.$menu.find('li').last();
      }

      prev.addClass('active');
    }

  , toggle: function () {
    if (!this.disabled) { 
      if (this.$container.hasClass('combobox-selected')) {
        $(this.$button).find("span:first").attr("check","deactive")
         this.validate_before_remove_trigger()          
      } else {
         $(this.$button).find("span:first").attr("check","active")
        if (this.shown) {
          this.hide();
        } else {
          console.log("lookup")
          this.clearElement();
          if(this.$source.attr("id") == 'item'){
            this.set_item_list()
            
          }
          this.lookup();
        }
      }
    }
  }

  , scrollSafety: function(e) {
      if (e.target.tagName == 'UL') {
          this.$element.off('blur');
      }
  }
  , clearElement: function () {
    this.$element.val('').focus();
  }

  , clearTarget: function () {
    this.$source.val('');
    this.$target.val('');
    this.$container.removeClass('combobox-selected');
    this.selected = false;
  }

  , triggerChange: function () {
    this.$source.trigger('change');
  }
  
  , validate_before_remove_trigger:function(){
     if ($("#cart_body").children().length && (this.$source.attr("id") == 'vendor' || this.$source.attr("id") == 'customer') ){
         $("#auto_sync_model").modal('show')
         $("#auto_sync_model").find(".modal-title").text("Warning !!!!")
         $("#auto_sync_model").find('.modal-body').html('<b>Collection area will be flushed, Are you sure you want continue ?</b> ')
         $("#auto_sync_model").find('.modal-footer').html('<button type="submit" class="btn btn-success" id="flush_continue">Continue</button><button type="submit" class="btn btn-primary" id="cancel_auto_sync">Cancel</button>')
         this.trigger_default_methods()
      }
      else{
          this.clearTarget();
          this.triggerChange();
          this.clearElement();
          if (this.$source.attr("id") == 'vendor'){
            this.vendor_remove_span_trigger()
          }
      }
    }
  ,  trigger_default_methods :function(){
      var me  = this
      $("#flush_continue").click(function(){
          $("#auto_sync_model").modal("hide")
          me.clearTarget();
          me.triggerChange();
          me.clearElement();
          if (me.$source.attr("id") == 'vendor' ){
            me.vendor_remove_span_trigger()
          }
          else if(me.$source.attr("id") == 'customer'){
            me.execute_customer_remove_span_trigger()
          }
      })
      $("#flush_cancel").click(function(){
          $(me.$container).find('ul').css("display","none")
      })
  
   }

   ,vendor_remove_span_trigger:function(){
      $('.item_thumnails').empty()
      $('.item_thumnails').html("<div class='well' style='height:280px;margin-top:50px;margin-right:10px'><h1 style='font-size:50px'>Please Choose Vendor to display Items</h1></div>")  
      $("#cart_body").empty()
      $("[name=item][type=text]").val("")
      $("[name=sub_category][type=text]").val("")
      $("[name=item][type=hidden]").parent().removeClass("combobox-selected")
      $("[name=sub_category][type=hidden]").parent().removeClass("combobox-selected")
      $(this.$container).find('ul').css("display","none") 
   }

   ,execute_customer_remove_span_trigger:function(){
      $("#cart_body").empty()
   }

  , refresh: function () {
    this.source = this.parse();
    this.options.items = this.source.length;
  }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this));

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this));
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this));

      this.$button
        .on('click', $.proxy(this.toggle, this));
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element;
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;');
        isSupported = typeof this.$element[eventName] === 'function';
      }
      return isSupported;
    }

  , move: function (e) {
      if (!this.shown) {return;}

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault();
          break;

        case 38: // up arrow
          e.preventDefault();
          this.prev();
          break;

        case 40: // down arrow
          e.preventDefault();
          this.next();
          break;
      }

      e.stopPropagation();
    }

  , keydown: function (e) {
      if ($("#cart_body").children().length && (this.$source.attr("id") == 'vendor' || this.$source.attr("id") == 'customer')){
          if (e.keyCode == 8 || e.keyCode == 46){
              e.preventDefault();
          }
      }

      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
      this.move(e);
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) {return;}
      this.move(e);
    }

  , keyup: function (e) {
      var flag ;
      switch(e.keyCode) {
        case 40: // down arrow
        case 39: // right arrow
        case 38: // up arrow
        case 37: // left arrow
        case 36: // home
        case 35: // end
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break;

        case 9: // tab
        case 13: // enter
          if (!this.shown) {return;}
          this.select();
          break;

        case 27: // escape
          if (!this.shown) {return;}
          this.hide();
          break;
        case 8:
          flag = this.check_if_backspace_or_delete_fired();
          if (flag){
             break;  
          }          
        case 46:
          flag = this.check_if_backspace_or_delete_fired();
          if (flag){
             break;  
          }    
        default:
          this.clearTarget();
          if(this.$source.attr("id") == 'item'){
            this.set_item_list()
            
          }
          else if(this.$source.attr("id") != 'item'){
            this.lookup();
          }

      }

      e.stopPropagation();
      e.preventDefault();
  }
  , set_item_list:function(){
       var return_flag = validate_for_vendor_selection_on_item_selection()
        console.log("new code")
        if (return_flag){
          var item_list = execute_item_search_span_trigger()
          console.log(item_list)
          var data  = this.$source.data('combobox')
          data.source = item_list
          data.options.items = data.source.length;
          this.lookup();  
        }   
  }

  , check_if_backspace_or_delete_fired:function(){
      if ($("#cart_body").children().length && (this.$source.attr("id") == 'vendor' || this.$source.attr("id") == 'customer') ){
           this.validate_before_remove_trigger()
           return true
        }
       return false     
  }

  , focus: function (e) {
      this.focused = true;
    }

  , blur: function (e) {
      var that = this;
      this.focused = false;
      var val = this.$element.val();
      if (!this.selected && val !== '' ) {
        this.$element.val('');
        this.$source.val('').trigger('change');
        this.$target.val('').trigger('change');
      }
      if (!this.mousedover && this.shown) {setTimeout(function () { that.hide(); }, 200);}
    }

  , click: function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.select();
      this.$element.focus();
    }

  , mouseenter: function (e) {
      this.mousedover = true;
      this.$menu.find('.active').removeClass('active');
      $(e.currentTarget).addClass('active');
    }

  , mouseleave: function (e) {
      this.mousedover = false;
    }
  };

  /* COMBOBOX PLUGIN DEFINITION
   * =========================== */
   var parent = '';
  $.fn.combobox = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('combobox')
        , options = typeof option == 'object' && option;
      if(!data) {$this.data('combobox', (data = new Combobox(this, options)));}
      if (typeof option == 'string') {data[option]();}
    });
  };

  $.fn.my_combobox = function (item_list) {
     return this.each(function () {  
          var $this = $(this)
        , data = $this.data('combobox')
        console.log($(this))
        if(data){
          // data.source = this.parse();
          data.source = item_list
          data.options.items = data.source.length;

      }
   })
  };

  $.fn.combobox.defaults = {
    bsVersion: '3'
  , menu: '<ul class="typeahead typeahead-long dropdown-menu"></ul>'
  , item: '<li ><a href="#"></a></li>'
  };

  $.fn.combobox.Constructor = Combobox;


}( window.jQuery );



