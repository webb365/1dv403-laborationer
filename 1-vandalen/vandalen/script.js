"use strict";

var makePerson = function(persArr){
	var minAge = 150;
	var maxAge = 0;
	var avarageAge = 0;
	var age_arr = new Array();
	var names_arr = new Array();
	var names = '';
	var i = 0;
	persArr.forEach(function(value) {
    	console.log(value);
    	names_arr[i] = value.name;	    	
		age_arr[i] = value.age;
    	if(value.age < minAge){
	    	minAge = value.age;
    	}
     	if(value.age > maxAge){
	    	maxAge = value.age;
    	}  
    	i++; 	
	});
	names_arr.sort(String.localeCompare)
	names_arr.forEach(function(value) {
    	if(names.length>0){
	    	names += ', ' + value;
    	}else{
	    	names = value;
    	}
    	
	});
	age_arr.forEach(function(value) {
		avarageAge += value; 
	});	
	avarageAge = Math.round(avarageAge / age_arr.length);
	
	return {minAge: minAge, maxAge: maxAge, names: names, averageAge: avarageAge};

}

