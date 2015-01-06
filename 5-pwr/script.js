"use strict";

var Computer = {
	init:function(){
	  var template = $('#computer-template').html();
	  Mustache.parse(template);
	  var rendered = Mustache.render(template, {name: "Luke"});
	  $('.container').html(rendered);
	}
};

$( document ).ready(function() {
	$('#start').click(function(){
		Computer.init();
	});	
});