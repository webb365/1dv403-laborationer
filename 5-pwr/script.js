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
		Computer.windowmanager.init();	
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
	},
	windowmanager:{
		widows:[],
		init:function(){
		    $('#start-camera').click(function(){
				console.log('Startar fönster.');
				Computer.windowmanager.create_window(1);
		    });
		},
		create_window:function(appid){
			Computer.windowmanager.widows.push(appid);	
			Computer.windowmanager.render();		
		},
		render:function(){
			var window_id = 1;
			$('#main').html('');
			Computer.windowmanager.widows.forEach(function(appid) {
				if(appid==1){
					var app_meta = {id:window_id,titel: '<i class="fa fa-camera-retro"></i> Bildvisare',footer: '',body:''};
				}else{
					var app_meta = {titel: "FEL",id:'000',footer: 'FEL',body:'Starta om datorn för att fixa felet.'};
				}
				var template = $('#window-template').html();
				Mustache.parse(template);
				var rendered = Mustache.render(template, app_meta);
				$('#main').append(rendered);
				console.log('Fönster ' + window_id + ' renderat.');
				window_id++;
			});
		}
	}
};

$( document ).ready(function() {
	Computer.init();
});