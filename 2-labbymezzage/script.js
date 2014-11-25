var MessageBoard = {
	messages:[],
	init:function(e){
	
	},
	render:function(){
		MessageBoard.messages.forEach(function(message){
			console.log(message.getHTMLText());
		});
	}
};

MessageBoard.render();
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

var message1 = new message('text');
var message2 = new message('text2');
alert(message1.getDate()); 