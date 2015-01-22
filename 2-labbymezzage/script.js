"use strict";

var MessageBoard = {
	messages:[],
	
	init:function(){
		document.getElementById("skriv").onclick=function(){MessageBoard.messageAdd()};
		document.onkeypress = function (e) {
			 if (e.keyCode == 13&& !event.shiftKey){
				MessageBoard.messageAdd();
			} 
		};
	},
	render:function(){
		document.getElementById("messages").innerHTML = '';
		var i = 0;
		MessageBoard.messages.forEach(function(message){
			document.getElementById("messages").innerHTML += MessageBoard.messageGenarate(i);
			i++;
		});
		var date_btns = document.querySelectorAll(".date-btn");
		
		for (var i = 0; i < date_btns.length; i++) {
		    var date_btn = date_btns[i];
		    date_btn.onclick = function () {
			    var id =this.id;
			    id= parseInt(id.substring(6));
			    MessageBoard.showDate(id);
				console.log(id);
		    };
		}
		var remove_btns = document.querySelectorAll(".remove-btn");
		
		for (var i = 0; i < remove_btns.length; i++) {
		    var remove_btn = remove_btns[i];
		    remove_btn.onclick = function () {
			    var id =this.id;
			    id= parseInt(id.substring(7));
			    MessageBoard.messageRemove(id);
				
		    };
		}
		document.getElementById("count").innerHTML = 'Antal meddelanden: ' + i;
	},
	messageAdd:function(){	
		MessageBoard.messages.push( new message(document.getElementById("kommentar").value));
		document.getElementById("kommentar").value = '';
		MessageBoard.render();
		
	},messageGenarate:function(id){	
		//onclick="MessageBoard.messageRemove(' + id + ')"
		var message = '<div class="panel panel-default"><div class="panel-heading">' + MessageBoard.messages[id].toStringMini() + '<div class="button-right"><button type="button" id="datum-' + id + '" class="btn btn-default date-btn" aria-label="Left Align"><span class="glyphicon glyphicon-info-sign glyphicon-align-left" aria-hidden="true"></span> Visa tiden</button><button type="button" id="remove-' + id + '"  class="btn btn-default remove-btn" aria-label="Left Align"><span class="glyphicon glyphicon-remove-circle glyphicon-align-left" aria-hidden="true"></span> Radera</button></div></div><div class="panel-body">' + MessageBoard.messages[id].getHTMLText() + '</div></div>';
		return message;
		 
	},messageRemoveAdd:function(id){
		var i = 0;
		MessageBoard.messages.forEach(function(message){
			var string = "radera-"+i;
			document.getElementById(string).onclick=function(){MessageBoard.messageRemove(this.id);};
			i++;
		});
	},messageRemove:function(num){	
		MessageBoard.messages.splice(num, 1);
		MessageBoard.render();
	},showDate:function(num){	
		alert(MessageBoard.messages[num].toString());
	}
};
MessageBoard.init();
function message(_text)
{
   var text;
   var date;

   this.getText = function() {
       return text;
   }
   this.setText = function(_text) {
       text = _text;
   }
  
   this.getDate = function() {
       return date;
   }
   this.setDate = function(_date) {
      date = _date;
   }  
   
   this.toString = function() {
	  return date.toString();

   };
   this.toStringMini = function() {
	  return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

   };
   this.getHTMLText = function() {
        return text.replace("\n", "<br />");
   };
   var __construct = function() {
		date =  new Date();
		text = _text;
   }()

}
