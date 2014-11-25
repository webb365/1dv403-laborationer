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
        return float2rat(numerator/denominator);
   };
   var __construct = function() {
		date =  Date();
		text = _text;
   }()

}

var message1 = new message();

alert(message1.getDate()); 