"use strict";

var mem = new memory(4,4);
mem.toHTML();
function memory(_cols,_rows)
{
   var cols;
   var rows;
   var rand_array;



this.toHTML = function() {
		var html = '';
		var current_col = 0;
		rand_array.forEach(function (item){
		  html += item;
		  current_col++;
		  if(current_col==cols){
			  current_col = 0;
			  html += '#';
		  }
		});
		console.log(html);
        return html;
   };

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
		rand_array = RandomGenerator.getPictureArray(rows,cols);
		
   }()

}
