"use strict";

var Computer = {
	init:function(){
		console.log('Initsierar platformen.');
		if(localStorage['applicationmanager']!=undefined && localStorage['windowmanager']!=undefined){
			if(localStorage['locked']=='true'){
				Computer.lockscreen.init();	
			}else{
				Computer.desktop.init();	
			}
			
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
				Computer.lockscreen.preLock();
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
				Computer.lockscreen.preLock();
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
		preLock:function(){
			Computer.disk.save();
			localStorage['locked']=true;
			Computer.lockscreen.lock();
		},
		lock:function(){
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
					localStorage['locked'] = false;
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
		memory:{
			create:function(id){
				var memory =  Computer.applicationmanager.memory.render((Computer.applicationmanager.applications.length+1),{html:'<div id="game-'+id+'" class="game"><div id="memory"><div class="row">', rand: Computer.applicationmanager.memory.randomGenerator.getPictureArray(3,4),changes:[]});			
				Computer.windowmanager.widows[(id-1)].footer = '';
				Computer.applicationmanager.applications.push(memory);
				Computer.windowmanager.widows[(id-1)].appsession = Computer.applicationmanager.applications.length;
				Computer.windowmanager.render();
			},
			display:function(id,appsession){
				if(appsession != 0){
					Computer.windowmanager.widows[(id-1)].body =  Computer.applicationmanager.applications[(appsession-1)].html;
					setTimeout(function(){
						$('#game-'+id+' .brick').unbind().click(function(){
							var brick_id = $(this).attr("id");;
							Computer.applicationmanager.memory.click(brick_id,id,appsession);
						});
					},1);			
				}
			},
			render:function(id,memory){
				var cols = 4;
				var rows = 3;
				var rand_array = memory.rand;
				var width = Math.floor(12/cols);
				var i = 0;
				var current_col = 0;
				var current_row = 0;
				memory.changes.push.apply(memory.changes, memory.finished);
				rand_array.forEach(function (item){
					var skip = false;
					var used = [];
				 memory.changes.forEach(function (value){
					 if(i == value.brick_id && used.indexOf(value.brick_id) == -1 ){
						used.push(value.brick_id);
						memory.html += '<div class="col-xs-' + width + '"><a id="card-'+ i +'" class="brick">' + Computer.applicationmanager.memory.getIconHTML(value.brick) + '</a></div>'; 					
						skip = true;
					 }
				  	
				 });
				 if(!skip){
				 	memory.html += '<div class="col-xs-' + width + '"><a id="card-'+ i +'" class="brick">' + Computer.applicationmanager.memory.getIconHTML(0) + '</a></div>'; 
				 }
				  current_col++;
				  i++;
				  if(current_col==cols){
					  current_col = 0;
					  current_row++;
					  if(current_row==rows){
						   memory.html += '</div>';
					  }else{
					 	  memory.html += '</div><div class="row">';
					  }
				  }
				});
				memory.html += '</div></div>';		
				return memory;
			},
			click:function(brick,id,appsession){
				brick =parseInt(brick.substring(5));
				Computer.applicationmanager.applications[(appsession-1)].changes.push({brick_id:brick,brick:Computer.applicationmanager.applications[(appsession-1)].rand[brick]});
				Computer.applicationmanager.applications[(appsession-1)].html = '<div id="game-'+id+'" class="game"><div id="memory"><div class="row">';  
				var memory = Computer.applicationmanager.applications[(appsession-1)];
				if(memory.finished == undefined){
					memory.finished = [];
				}

				if(memory.attempts == undefined){
					memory.attempts = 0;
				}
				memory = Computer.applicationmanager.memory.render(appsession,memory);					
				
				
				memory.changes = memory.changes.filter(function(item) {
				    return memory.finished.indexOf(item) === -1;
				});
				if(memory.changes.length == 2){
					if(memory.changes[0].brick == memory.changes[1].brick && memory.changes[0].brick_id != memory.changes[1].brick_id){
						memory.finished.push(memory.changes[0]);
						memory.finished.push(memory.changes[1]);
						memory.changes = [];
					}else{
						memory.changes = [];
					}
					memory.attempts++;
					
				}
				if(memory.finished.length==12){
					memory.html += '<div class="attempts"><h2>Du klarade det på '+memory.attempts+' försök</h2></div>';
				}
				Computer.applicationmanager.applications.push(memory);
				Computer.windowmanager.render();
			},
			getIconHTML:function(id){
			   var icon = '';
			   switch (id) {
				    case 0:
				        icon = "fa-question";
				        break;
				    case 1:
				        icon = "fa-btc";
				        break;
				    case 2:
				        icon = "fa-cc-mastercard";
				        break;
				    case 3:
				        icon = "fa-android";
				        break;
				    case 4:
				        icon = "fa-apple";
				        break;
				    case 5:
				        icon = "fa-cc-visa";
				        break;
				    case 6:
				        icon = "fa-github-alt";
				        break;
					case 7:
				        icon = "fa-spotify";
				        break;
				    case 8:
				        icon = "fa-wordpress";
				        break;
				    case 9:
				        icon = "fa-steam";
				        break;
				    case 10:
				        icon = "fa-paypal";
				        break;
				} 
		       return '<span class="fa-stack fa-lg  icon-style"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa ' + icon + ' fa-stack-1x"></i></span>';
		   },
		   randomGenerator:{
				getPictureArray: function(rows, cols)
				{
					var numberOfImages = rows*cols;
					var maxImageNumber = numberOfImages/2;
				
				   	var imgPlace = [];
				
				   for(var i=0; i<numberOfImages; i++)
					  imgPlace[i] = 0;
				
					for(var currentImageNumber=1; currentImageNumber<=maxImageNumber; currentImageNumber++)
					{		
						var imageOneOK = false;
						var imageTwoOK = false;
						
						do
						{
							if(imageOneOK == false)
							{
								var randomOne = Math.floor( (Math.random() * (rows*cols-0) + 0) );				
								
								if( imgPlace[randomOne] == 0 )
								{
									imgPlace[randomOne] = currentImageNumber;
									imageOneOK = true;
								}
							}
							
							if(imageTwoOK == false)
							{
								var randomTwo = Math.floor( (Math.random() * (rows*cols-0) + 0) );				
											
								if( imgPlace[randomTwo] == 0 )
								{
									imgPlace[randomTwo] = currentImageNumber;
									imageTwoOK = true;
								}
							}			
						}
						while(imageOneOK == false || imageTwoOK == false);		
					}
					
					return imgPlace;
				}
			}
		},
		rss:{
			create:function(id){	
				$.get( "http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url="+escape("http://www.dn.se/m/rss/senaste-nytt"), function( data ) {
					data =data.replace('<a href="http://www.dn.se/m/rss/senaste-nytt">http://www.dn.se/m/rss/senaste-nytt</a><br/>','');
					data =data.replace("<h2 class='rss_title'>DN.se - Nyheter - Senaste nytt - Nyheter</h2>",'');
					data =data.replace('<p>DN.se - Nyheter - Senaste nytt - Nyheter</p>','');
					console.log(data);
					var rss = {html:data};
					var d = new Date();
					var h = d.getHours();
					var m = d.getMinutes();
					Computer.windowmanager.widows[(id-1)].footer = 'Uppdaterad senast: '+h+':'+m;
					Computer.applicationmanager.applications.push(rss);
					Computer.windowmanager.widows[(id-1)].appsession = Computer.applicationmanager.applications.length;
					Computer.windowmanager.render();
				});
				
			},
			display:function(id,appsession){				
				if(appsession != 0){
					Computer.windowmanager.widows[(id-1)].body =  Computer.applicationmanager.applications[(appsession-1)].html;
					
				}
			}

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
						camera.html += '<a href="#" data-url="'+obj.URL+'" class="images"><li><img src="'+obj.thumbURL+'"></li></a>'; 
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

						$('#camera-'+appsession+' .images').unbind().click(function(){
							var url = $(this).attr("data-url");
							Computer.windowmanager.create_window(2);
							Computer.applicationmanager.camera.image.create(url,Computer.windowmanager.widows.length);
						});	
						$('.images').bind("contextmenu",function(e){
							var bg_url = $(this).attr("data-url");
							localStorage['Background_url'] = bg_url;
							$('#desktop').css('background-image','url('+bg_url+')');
						    return false;
						});
					 }, 1);
					
				}
			},
			image:{
				create:function(url,id){
					var image = {html:'<image src="'+url+'" id="bild-'+(Computer.applicationmanager.applications.length+1)+'">'}
					Computer.windowmanager.widows[(id-1)].footer = '';
					Computer.applicationmanager.applications.push(image);
					Computer.windowmanager.widows[(id-1)].appsession = Computer.applicationmanager.applications.length;
					Computer.windowmanager.render();
				},
				display:function(id,appsession){
					if(appsession != 0){
						Computer.windowmanager.widows[(id-1)].body =  Computer.applicationmanager.applications[(appsession-1)].html;
					}
				}
			}
		}
		
	},
	windowmanager:{
		widows:[],
		layer: 1,
		x:0,
		y:0,
		init:function(){
		    $('#start-camera').click(function(){
				console.log('Startar fönster.');
				Computer.windowmanager.create_window(1);
		    });
		    $('#start-rss').click(function(){
				console.log('Startar fönster.');
				Computer.windowmanager.create_window(3);
		    });
		    $('#start-memory').click(function(){
				console.log('Startar fönster.');
				Computer.windowmanager.create_window(4);
		    });
		    $( window ).resize(function() {
			    Computer.windowmanager.render();
		    });
		    console.log('Windowmanager startad.');
		},
		create_window:function(appid){
			Computer.windowmanager.widows.push({id:appid,appsession:0,x:Computer.windowmanager.x,y:Computer.windowmanager.y,footer:'<i class="fa fa-refresh fa-spin"></i> Laddar',body:''});
			if(appid==1){
				Computer.applicationmanager.camera.create(Computer.windowmanager.widows.length);	
			}else if(appid==3){
				Computer.applicationmanager.rss.create(Computer.windowmanager.widows.length);
			}else if(appid==4){
				Computer.applicationmanager.memory.create(Computer.windowmanager.widows.length);
			}
			if(Computer.windowmanager.x > ($('#desktop').width()-400)){
				Computer.windowmanager.x = 0
			}
			if(Computer.windowmanager.y > ($('#desktop').height()-600)){
				Computer.windowmanager.y = 0
			}
			Computer.windowmanager.x += 20;
			Computer.windowmanager.y += 20;
			console.log('Fönster har skapats.');
			Computer.windowmanager.render();		
		},
		close_window:function(id){
			Computer.windowmanager.widows.splice((id-1), 1);
			console.log('Fönster har stängts.');
			Computer.windowmanager.render();
		},
		move_window:function(e,id){
			
			if(e.pageY>33&&e.pageY<($('#desktop').height()-$('#window-'+id).height())&&e.pageX>180&&e.pageX<($('#desktop').width()-$('#window-'+id).width()+180)){
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
				}else if(appid==2){
					Computer.applicationmanager.camera.image.display(window_id,appsession);
					var app_meta = {id:window_id,titel: '<i class="fa fa-picture-o"></i> Bild', footer: obj.footer , body: obj.body};
				}else if(appid==3){
					Computer.applicationmanager.rss.display(window_id,appsession);
					var app_meta = {id:window_id,titel: '<i class="fa fa-rss"></i> Rss', footer: obj.footer , body: obj.body};
				}else if(appid==4){
					Computer.applicationmanager.memory.display(window_id,appsession);
					var app_meta = {id:window_id,titel: '<i class="fa fa-gamepad"></i> Memory', footer: obj.footer , body: obj.body};
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