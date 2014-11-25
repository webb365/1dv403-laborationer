var MessageBoard = {
	messages:[],
	
	init:function(e){
		document.getElementById("skriv").onclick=function(){MessageBoard.messageAdd()};
	},
	render:function(){
		MessageBoard.messages.forEach(function(message){
			console.log(message.getHTMLText());
		});
	},
	messageAdd:function(){	
		MessageBoard.messages.push( new message(document.getElementById("kommentar").value));
		document.getElementById("kommentar").value = '';
		MessageBoard.render();
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
        if(date instanceof Date){
	      return date.toString();
        }
        return false;
   };
   this.getHTMLText = function() {
        return text;
   };
   var __construct = function() {
		date =  Date();
		text = _text;
   }()

}
