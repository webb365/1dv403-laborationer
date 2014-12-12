"use strict";

var mem = new memory(8,4);
mem.toHTML();
function memory(_cols,_rows)
{
   var cols;
   var rows;
   var rand_array;



this.toHTML = function() {
		var i = 0;
		var html = '<div class="row">';
		var current_col = 0;
		var current_row = 0;
		var width = Math.floor(12/cols);
		rand_array.forEach(function (item){
		  html += '<div class="col-sm-' + width + '"><a onclick="mem.click(\'' + i + '\');"></a></div>';
		  current_col++;
		  i++;
		  if(current_col==cols){
			  current_col = 0;
			  current_row++;
			  if(current_row==rows){
				  html += '</div>';
			  }else{
			 	 html += '</div><div class="row">';
			  }
		  }
		});
		document.getElementById("memory").innerHTML = html;
        return html;
   };
  
  
  
  
   this.getIconHTML = function(id) {
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
       return icon;
   }

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
		if(cols>12||cols*rows > 20){
			console.log('#######################################################');
			console.log('# Spelet kommer ej köras pga felaktiga värden i koden #');
			console.log('#######################################################');
		}
		rand_array = RandomGenerator.getPictureArray(rows,cols);
		
   }()

}
