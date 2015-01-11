"use strict";

var Computer = {
	init:function(){
		console.log('Initsierar platformen.');
		if(localStorage['applicationmanager']!=undefined && localStorage['windowmanager']!=undefined){
			Computer.desktop.init();
		}else{
			var template = $('#start-template').html();
			Mustache.parse(template);
			var rendered = Mustache.render(template);
			$('.container').html(rendered);
			$('#start').click(function(){
				Computer.start();
			});				
		}
	},
	start:function(){
		console.log('Startar datorn.');
		Computer.lockscreen.init();	
	
	},
	shutdown:function(){
		var template = $('#start-template').html();
		Mustache.parse(template);
		var rendered = Mustache.render(template);
		$('.container').html(rendered);
		Computer.windowmanager.widows = [];
		Computer.applicationmanager.applications = [];
		Computer.windowmanager.layer = 1;
		delete localStorage['applicationmanager'];
		delete localStorage['windowmanager'];
		$('#start').click(function(){
			Computer.start();
		});	
		console.log('Datorn avstängd.');
	},
	disk:{
		save:function(){
			console.log('Sparar till disk');
			localStorage['applicationmanager'] = JSON.stringify(Computer.applicationmanager.applications);
			localStorage['windowmanager'] = JSON.stringify(Computer.windowmanager.widows);
		},
		load:function(){
			console.log('Laddar in session från disk');
			Computer.applicationmanager.applications = JSON.parse(localStorage['applicationmanager']);
			Computer.windowmanager.widows =JSON.parse(localStorage['windowmanager']);
		}
	},
	desktop:{
		init:function(){
			if(localStorage['applicationmanager']!=undefined && localStorage['windowmanager']!=undefined){
				Computer.disk.load();
			}
			var template = $('#computer-template').html();
			Mustache.parse(template);
			var rendered = Mustache.render(template);
			$('.container').html(rendered);
			if(localStorage['Background_url']!=undefined){
				$('#desktop').css('background-image','url('+localStorage['Background_url']+')');
			}
			$('#stop').click(function(){
				console.log('Stänger av datorn.');
				Computer.shutdown();
			});
			$('#lock').click(function(){
				console.log('Låser datorn.');
				Computer.lockscreen.lock();
			});
			Computer.desktop.powerSaver();
			Computer.windowmanager.init();
			Computer.applicationmanager.init();
			Computer.windowmanager.render();
			console.log('Datorn startad.');

		},
		powerSaver:function(){
			$(window).blur(function(){
				console.log('Sätter datorn i viloläge.');
				Computer.lockscreen.lock();
				$(".container").fadeOut("slow");
			});
			$(window).focus(function() {
				console.log('Datorn vaknar från viloläge.');
				$(".container").fadeIn("slow");
			});			
		}	
	},
	lockscreen:{
		init:function(){
			if(localStorage['users']==undefined){
				localStorage['users']= JSON.stringify([{username:'admin',password:'password',admin:true},{username:'user',password:'password',admin:false}]);
			}
			Computer.lockscreen.lock();
		},
		lock:function(){
			Computer.disk.save();
			var template = $('#locked-template').html();
			Mustache.parse(template);
			var rendered = Mustache.render(template);
			$('.container').html(rendered);
			$('#logginerror').hide();
			$("#loggain").submit(function(e){
			    return false;
			});	
			$('#loggin').click(function(){
				var username = $('#inputUsername').val();
				var password = $('#inputPassword').val();
				if(Computer.lockscreen.control(username,password)){	
					console.log('Datorn upplåst.');
					Computer.desktop.init();	
				}else{
					console.log('Fel lösenord eller användarnamn.');
					$('#logginerror').show();
				}
			});		
		},
		control:function(username,password){
			var match = false;
			var users = JSON.parse(localStorage['users']);
			users.forEach(function(user){
				if(username==user.username&&password==user.password){
					match = true;
					Computer.type=user.type;
					Computer.username=user.username;
				}
			});
			if(match){
				return true;
			}else{
				return false;
			}
		}

	},
	applicationmanager:{
		applications:[],
		init:function(){
		    console.log('applicationmanager startad.');
		},
		camera:{
			create:function(id){	
				$.getJSON( "http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/", function( data ) {
					console.log(data);
					var camera = {thumbHeight:0,thumbWidth:0,html:'<div class="camera" id="camera-'+(Computer.applicationmanager.applications.length+1)+'"><ul>'};
					data.forEach(function(obj) {
						if(obj.thumbHeight > camera.thumbHeight){
							camera.thumbHeight = obj.thumbHeight;
						}
						if(obj.thumbWidth > camera.thumbWidth){
							camera.thumbWidth = obj.thumbWidth;
						}
						camera.html += '<a href="#" data-url="'+obj.URL+'" class="change_background"><li><img src="'+obj.thumbURL+'"></li></a>'; 
					});
					camera.html += '</ul></div>';
					camera.thumbWidth += 10;
					camera.thumbHeight += 10;
					Computer.windowmanager.widows[(id-1)].footer = '';
					Computer.applicationmanager.applications.push(camera);
					Computer.windowmanager.widows[(id-1)].appsession = Computer.applicationmanager.applications.length;
					Computer.windowmanager.render();
				});
			},
			display:function(id,appsession){
				if(appsession != 0){
					Computer.windowmanager.widows[(id-1)].body =  Computer.applicationmanager.applications[(appsession-1)].html;
					setTimeout(function(){ 
						$('#camera-'+appsession+' li').css({height: Computer.applicationmanager.applications[(appsession-1)].thumbHeight , width : Computer.applicationmanager.applications[(appsession-1)].thumbWidth });
						$('.change_background').click(function(){
							var bg_url = $(this).attr("data-url");
							localStorage['Background_url'] = bg_url;
							$('#desktop').css('background-image','url('+bg_url+')');
						});	
					 }, 1);
					
				}
			}
		}
		
	},
	windowmanager:{
		widows:[],
		layer: 1,
		init:function(){
		    $('#start-camera').click(function(){
				console.log('Startar fönster.');
				Computer.windowmanager.create_window(1);
		    });
		    $( window ).resize(function() {
			    Computer.windowmanager.render();
		    });
		    console.log('Windowmanager startad.');
		},
		create_window:function(appid){
			Computer.windowmanager.widows.push({id:appid,appsession:0,x:0,y:0,footer:'<i class="fa fa-refresh fa-spin"></i> Laddar',body:''});
			Computer.applicationmanager.camera.create(Computer.windowmanager.widows.length);	
			console.log('Fönster har skapats.');
			Computer.windowmanager.render();		
		},
		close_window:function(id){
			Computer.windowmanager.widows.splice((id-1), 1);
			console.log('Fönster har stängts.');
			Computer.windowmanager.render();
		},
		move_window:function(e,id){
			
			if(e.pageY>33&&e.pageY<(($('#desktop').height()-$('#window-'+id).height()-16))&&e.pageX>180&&e.pageX<($('#desktop').width()+180-$('#window-'+id).width())){
				$('#window-'+id).css({"top":(e.pageY-35)+'px',"left":(e.pageX-180)+'px'});
			}
			Computer.windowmanager.widows[(id-1)].x=e.pageX-180;
			Computer.windowmanager.widows[(id-1)].y=e.pageY-35;
			Computer.disk.save();
		},
		render:function(){
			var window_id =1;
			$('#main').html('');
			Computer.windowmanager.widows.forEach(function(obj) {
				var appid = obj.id;
				var appsession = obj.appsession;
				if(appid==1){
					Computer.applicationmanager.camera.display(window_id,appsession);
					var app_meta = {id:window_id,titel: '<i class="fa fa-camera-retro"></i> Bildvisare', footer: obj.footer , body: obj.body};
				}else{
					var app_meta = {titel: "FEL",id:'000',footer: 'FEL',body:'Starta om datorn för att fixa felet.'};
				}
				var template = $('#window-template').html();
				Mustache.parse(template);
				var rendered = Mustache.render(template, app_meta);
				$('#main').append(rendered);
				$('#window-'+window_id).css({"top":(Computer.windowmanager.widows[(window_id-1)].y)+'px',"left":(Computer.windowmanager.widows[(window_id-1)].x)+'px'});
				$('.camera').css('max-height',($('#desktop').height()-200)+'px');
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
			Computer.disk.save();
		}
	}
};

$( document ).ready(function() {
	Computer.init();
});