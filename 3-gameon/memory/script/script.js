"use strict";

new memory(4,4);
function memory(_cols,_rows)
{
   var cols;
   var rows;
   var rand_Array;


/*   this.getText = function() {
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
   
   
*/
   var __construct = function() {
		rows =  _rows;
		cols = _cols;
		rand_Array = RandomGenerator.getPictureArray(rows,cols);
		console.log(rand_Array);
   }()

}
