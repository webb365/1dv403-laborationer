"use strict";

var Quiz = {
	questions:[],
	nextUrl: '',
	init:function(){
		document.getElementById("answer_btn").addEventListener("click", Quiz.postAnswer);
		Quiz.proccesQuestion('http://vhost3.lnu.se:20080/question/1');
	},
	getQuestion:function(url,callback){
		  var request = new XMLHttpRequest();
		  request.open("GET",url,true);
		  request.send();
		  request.onreadystatechange=function(){
			  if (request.readyState==4 && request.status==200){
				var response = JSON.parse(request.responseText);
				Quiz.nextUrl = response.nextURL;
				callback(response.question);
			  }
		  }
	},
	postAnswer:function(){	
		var answer_txt = document.getElementById('answer_con').value;
		var request = new XMLHttpRequest();
		  request.open("POST",Quiz.nextUrl,true);
		  request.setRequestHeader('Content-Type', 'application/json');
		  request.send(JSON.stringify({answer: answer_txt}));
		  request.onreadystatechange=function(){
			  if (request.readyState==4 && request.status==200){
				document.getElementById('status').innerHTML  = '';
				var response = JSON.parse(request.responseText);
				if(response.nextURL != "undefined"){
					alert(response.nextURL);
					Quiz.proccesQuestion(response.nextURL);
				}else{
					alert('hej');
				}
			  }else if(request.readyState==4 && request.status==400){
				document.getElementById('status').innerHTML  = '<div class="alert alert-danger" role="alert">Fel svar</div>';
			  }
		  }
	},
	proccesQuestion:function(url){	
		Quiz.getQuestion(url,function(question){
			document.getElementById('question').innerHTML = question;	
		});	 
	},
	messageRemoveAdd:function(id){
	
	},
	messageRemove:function(num){	
		
	},
	showDate:function(num){	
		
	}
};
Quiz.init();

