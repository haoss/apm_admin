'use strict';

// Document ready
$(document).on('ready', function(){

  // Magnific popup video
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  $('.open-popup-link').magnificPopup({
    type: 'inline',
    midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
  });

  $("form").each(function(){
    $(this).validate();
  });

  $('.svg-inline').each(function() {
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');
    jQuery.get(imgURL, function(data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');
      // Add replaced image's ID to the new SVG
      if (typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if (typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass + ' replaced-svg');
      }
      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');
      // Replace image with new SVG
      $img.replaceWith($svg);
    }, 'xml');
  });

  $('.selectric').selectric();
  $('.lang-selectric').selectric({
    disableOnMobile: true,
    onOpen: function() {
      $('.navigation.--bottom').addClass('--hidden');
    },
    onClose: function() {
      $('.navigation.--bottom').removeClass('--hidden');
    }
  });
  $('.select2-multiple').select2();

  $('.datepicker-here').datepicker({
    autoClose: true,
    language: 'en',
    dateFormat: 'mm.dd.yyyy'
  });

  $('.tooltip').tooltipster({
    theme: 'default',
    position: 'bottom',
    trigger: 'click'
  });

  $("select").on("select2:unselect", function (evt) {
    if (!evt.params.originalEvent) {
      return;
    }
    evt.params.originalEvent.stopPropagation();
  });

  phoneMask();
  jNavigation();
  expandReady();

  countTest();

  // Chrome Smooth Scroll
  try {
    $.browserSelector();
    if($("html").hasClass("chrome")) {
      $.smoothScroll();
    }
  } catch(err) {

  };
});

$(window).on('load', function() { });
$(window).on('scroll', function() { });
$(window).on('resize', function() { });

function phoneMask() {
  var phone = $('.j-phone-mask');
  phone.each(function () {
    $(this).mask("+7 (999) 999-99-99");
  });
}

jQuery.extend(jQuery.validator.messages, {
  required: "???????????????????????? ????????",
  remote: "Please fix this field.",
  email: "?????????????? ???????????????????? e-mail.",
  url: "Please enter a valid URL.",
  date: "Please enter a valid date.",
  dateISO: "Please enter a valid date (ISO).",
  number: "Please enter a valid number.",
  digits: "Please enter only digits.",
  creditcard: "Please enter a valid credit card number.",
  equalTo: "???????????? ???? ??????????????????.",

  accept: "Please enter a value with a valid extension.",
  maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
  minlength: jQuery.validator.format("Please enter at least {0} characters."),
  rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
  range: jQuery.validator.format("Please enter a value between {0} and {1}."),
  max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
  min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
});

function jNavigation() {
  var btn = $('.j-btn');
  var navigation = $('.j-btn-target');
  var body = $('body');
  var shadow = $('.base-shadow');
  var btnTarget;
  
  $(document).on('click', '.j-btn', function(e){
    e.stopPropagation();
    var _this = $(this);
    btnTarget = $('#' + _this.data('id'));
    body.removeClass('is-fixed');
    
    if (btnTarget.hasClass('is-active')) {
      btnTarget.removeClass('is-active');
      shadow.removeClass('is-active');
    } else if (!btnTarget.hasClass('is-active')) {
      navigation.removeClass('is-active');
      btnTarget.addClass('is-active');
      body.addClass('is-fixed');
      shadow.addClass('is-active');
    }
  });

  $(document).on('click', function(e){
    navigation.removeClass('is-active');
    shadow.removeClass('is-active');
    body.removeClass('is-fixed');
  });

  $(document).on('click', '.j-btn-target', function(e){
    e.stopPropagation();
  });
}

;( function ( document, window, index ) {
	var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});

		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
	});
}( document, window, 0 ));

function countTest() {
  var block = $('.j-count');

  block.each(function(){
    var _this = $(this);
    var plus = _this.find('.btn-plus');
    var minus = _this.find('.btn-minus');
    var input = _this.find('input');
    var value = input.val();

    plus.on('click', function(){
      value = parseFloat(value) + 1;
      input.val(value);
    });
  
    minus.on('click', function(){
      if (value <= 1) return;
      value = parseFloat(value) - 1;
      input.val(value);
    });
  });
}

function expandReady() {
  var btn = $('.j-expand-tr');

  btn.on('click', function(){
    var _this = $(this);
    var ariaControls = _this.attr('aria-controls');
    console.log(ariaControls);
    if (_this.attr('aria-expanded') == 'false') {
      $('a[aria-controls='+ariaControls+']').find('span').text('Roll up order');
      $('a[aria-controls='+ariaControls+']').addClass('is-active');
    } else if (_this.attr('aria-expanded') == 'true') {
      $('a[aria-controls='+ariaControls+']').find('span').text('Expand order');
      $('a[aria-controls='+ariaControls+']').removeClass('is-active');
    }
  });
}