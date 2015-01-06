"use strict";

var Computer = {
	init:function(){
		console.log('Initsierar platformen.');
		var template = $('#start-template').html();
		Mustache.parse(template);
		var rendered = Mustache.render(template);
		$('.container').html(rendered);
		$('#start').click(function(){
			console.log('Startar datorn.');
			Computer.start();
		});	
	},
	start:function(){
	  var template = $('#computer-template').html();
	  Mustache.parse(template);
	  var rendered = Mustache.render(template);
	  $('.container').html(rendered);
	  $('#stop').click(function(){
		console.log('Stänger av datorn.');
		Computer.shutdown();
	  });	
	  console.log('Datorn startad.');
	},
	shutdown:function(){
	  var template = $('#start-template').html();
	  Mustache.parse(template);
	  var rendered = Mustache.render(template);
	  $('.container').html(rendered);
	  $('#start').click(function(){
		Computer.start();
	  });	
	  console.log('Datorn avstängd.');
	}
};

$( document ).ready(function() {
	Computer.init();
});