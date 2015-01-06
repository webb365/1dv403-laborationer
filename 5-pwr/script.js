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
		layer: 1,
		init:function(){
		    $('#start-camera').click(function(){
				console.log('Startar fönster.');
				Computer.windowmanager.create_window(1);
		    });
		},
		create_window:function(appid){
			Computer.windowmanager.widows.push({id:appid,x:0,y:0});	
			Computer.windowmanager.render();		
		},
		close_window:function(id){
			Computer.windowmanager.widows.splice((id-1), 1);
			Computer.windowmanager.render();
		},
		move_window:function(e,id){
			if(e.pageY>33&&e.pageY<($('#desktop').height()-125)&&e.pageX>180&&e.pageX<($('#desktop').width()-68)){
				$('#window-'+id).css({"top":(e.pageY-35)+'px',"left":(e.pageX-180)+'px'});
			}
			Computer.windowmanager.widows[(id-1)].x=e.pageX-180;
			Computer.windowmanager.widows[(id-1)].y=e.pageY-35;
			
		},
		render:function(){
			var window_id = 1;
			$('#main').html('');
			Computer.windowmanager.widows.forEach(function(obj) {
				var appid = obj.id;
				if(appid==1){
					var app_meta = {id:window_id,titel: '<i class="fa fa-camera-retro"></i> Bildvisare',footer: '',body:''};
				}else{
					var app_meta = {titel: "FEL",id:'000',footer: 'FEL',body:'Starta om datorn för att fixa felet.'};
				}
				var template = $('#window-template').html();
				Mustache.parse(template);
				var rendered = Mustache.render(template, app_meta);
				$('#main').append(rendered);
				$('#window-'+window_id).css({"top":(Computer.windowmanager.widows[(window_id-1)].y)+'px',"left":(Computer.windowmanager.widows[(window_id-1)].x)+'px'});
				console.log('Fönster ' + window_id + ' renderat.');
				$('#quit-'+window_id).click(function(){
					var id = $(this).attr("data-id");
					Computer.windowmanager.close_window(id);
				});	
				$('.window').on('mousedown',function() {
					var window_id = $(this).attr("data-id");
					$('#window-'+window_id).css('z-index',Computer.windowmanager.layer);
					Computer.windowmanager.layer++;
				});
				$('.panel-heading').on('mousedown',function() {
					var window_id = $(this).attr("data-id");
					$(window).on('mousemove',function( event ) {
						Computer.windowmanager.move_window(event,window_id);
					});
				});
				$('.panel-heading').on('mouseup',function() {
					$(window).off('mousemove');
				});
				window_id++;
			});
		}
	}
};

$( document ).ready(function() {
	Computer.init();
});