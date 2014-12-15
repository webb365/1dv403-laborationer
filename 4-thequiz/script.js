"use strict";

var Quiz = {
	try_count:0,
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
		Quiz.try_count++;	
		var answer_txt = document.getElementById('answer_con').value;
		var request = new XMLHttpRequest();
		  request.open("POST",Quiz.nextUrl,true);
		  request.setRequestHeader('Content-Type', 'application/json');
		  request.send(JSON.stringify({answer: answer_txt}));
		  request.onreadystatechange=function(){
			  if (request.readyState==4 && request.status==200){
				document.getElementById('status').innerHTML  = '';
				var response = JSON.parse(request.responseText);
				if(response.nextURL != null){
					Quiz.proccesQuestion(response.nextURL);
				}else{
					document.getElementById('status').innerHTML  = '<div class="alert alert-success" role="alert">Du klarade quizen på ' + Quiz.try_count + ' försök!</div>';
					document.getElementById('question').innerHTML  = '';
					document.getElementById('answer').innerHTML  = '';
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
	}
};
Quiz.init();

