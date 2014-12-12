"use strict";

var mem = new memory(4,5);
mem.toHTML();
function memory(_cols,_rows)
{
   var cols;
   var rows;
   var rand_array;
   var last_click = -1;
   var guesses = 0; 
   var left;
   var disabled = Array();
   this.toHTML = function() {
		var i = 0;
		var html = '<div class="row">';
		var current_col = 0;
		var current_row = 0;
		var width = Math.floor(12/cols);
		rand_array.forEach(function (item){
		  html += '<div class="col-xs-' + width + '"><a id="card-'+ i +'" onclick="mem.click('+ i +');">' + getIconHTML(0) + '</a></div>';
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
   }
   this.click = function(i) {
	  if(disabled.indexOf(i) == -1){
	 	  if(last_click != -1){
		 	   document.getElementById("card-" +last_click).innerHTML = getIconHTML(0);
	 	  }
		  guesses++; 
		  console.log(guesses);
		  if(rand_array[last_click] == rand_array[i] && i != last_click){
			  	disabled.push(i);
			  	disabled.push(last_click);
		   		document.getElementById("card-" + last_click).innerHTML = getIconHTML(rand_array[i]);
		   		document.getElementById("card-" + i).innerHTML = getIconHTML(rand_array[i]);
		   		last_click= -1;
		   		i = -1;
		   		left += -2;
		   }else{
				document.getElementById("card-" + i).innerHTML = getIconHTML(rand_array[i]);
	
		   }
	  }	   
	   if(left== 0){
		  alert('Du lyckades efter ' + guesses + ' försök.');
	   }
	   last_click = i;
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
			console.log('#########################################################');
			console.log('# Spelet kommer köras på standard instälningarna pga fel#');
			console.log('#########################################################');
			rows = 4;
			cols = 4;
		}
		left = rows*cols;
		rand_array = RandomGenerator.getPictureArray(rows,cols);
		
   }()

}

function getIconHTML(id) {
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
   }
