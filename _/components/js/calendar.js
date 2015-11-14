

function Termine( name, location, description, link, datum, id ) {
	this.name = name;
	this.location = location;
	this.description = description;
	this.link = link;
	this.datum = datum;
	this.id = id;
}


function getMonthAsDiv ( month, year, format ) {
	var isToday = false;

	if (  [ "monat", "woche" ].indexOf( format ) == -1 )	{
		return false;
	}

	var newMonth = document.createElement("div");
	newMonth.className = "calendar";
	if ( format == 'monat' ) {
		newMonth.className = "calLine";
	} else {
		newMonth.className = "calBox";
	}
 	var daysInMonth = 31;

 	if ( month == 4 || month == 6 || month == 9 || month == 11 ) {
 		daysInMonth--;
 	}
 	else if ( month == 2 ) {
 		daysInMonth = 28;
 		if ( year % 4 === 0) daysInMonth++;
 		if ( year % 100 === 0 ) daysInMonth--;
 		if ( year % 400 === 0 ) daysInMonth++; 
 	}

 	monthHeader = document.createElement('div');
 	monthHeader.className = 'month-header';



 	leftArrow = document.createElement('div');
	leftArrow.className = 'calendar-left-arrow';
	rightArrow = document.createElement('div');
	rightArrow.className = 'calendar-right-arrow';
	imgLeftArrow = document.createElement('img');
	imgRightArrow = document.createElement('img');
	imgLeftArrow.src = 'icons/left.svg';
	imgRightArrow.src = 'icons/right.svg';
	leftArrow.appendChild( imgLeftArrow );
	rightArrow.appendChild( imgRightArrow );var titel = document.createElement("div");
 	titel.className = "month-name";
 	titel.innerHTML = monthsNames[month-1] + " " + year;
 	
 	monthHeader.appendChild( leftArrow );
 	monthHeader.appendChild( titel );
 	monthHeader.appendChild( rightArrow );

 	newMonth.appendChild( monthHeader );

 	if ( format == "monat" ) {
 		for ( var i = 1; i <= daysInMonth; i++ ) {
	 		var newTag = document.createElement("div");
	 		newTag.className = "day";
	 		newTag.innerHTML = "" + i;
	 		

	 		var currentDate = new Date( year, month-1, i );
	 		var currentDay = currentDate.toString().slice(0,3);
	 		
	 		if ( currentDay == "Sat" || currentDay == "Sun" ) {
	 			newTag.className += " weekend";
	 		}
	 		

	 		for (var j = 0; j < calendar.length; j++ ) {
	 			if ( calendar[j].datum.getYear() == currentDate.getYear() &&  
	 				calendar[j].datum.getMonth() == currentDate.getMonth() &&
	 				 calendar[j].datum.getDate() == currentDate.getDate() ) { 
	 				newTag.id += "termin_" + calendar[j].id;
	 				newTag.className += " termin";
	 				console.log( "Termin gefunden" );
	 			}
	 		}

	 		newMonth.appendChild( newTag );
 		}
 	} // if format == monat
 	else // format == woche
 	{
 		var tag = 1;


 		while ( tag <= daysInMonth ) {
 			var todayDate = new Date();
 		
 			if ( (tag == todayDate.getDate()) && (month-1 == todayDate.getMonth()) && (year-1900 == todayDate.getYear() )) {
 				isToday = true;

 			}
 			else {
 				isToday = false;
 			}

 			var currentDate = new Date( year, month-1, tag );
	 		var currentDay = currentDate.toString().slice(0,3);

	 		if ( tag == 1 ) {
	 			var newWoche = document.createElement("ul");
 				newWoche.className = "week";
 				for ( var i = 1; i <= [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ].indexOf(currentDay); i++ ) {
 					var newTag = document.createElement("li");
 					newTag.innerHTML = " ";
 					newTag.className = "day";
 					if (isToday) {
 						newTag.className += " today";
 					}
 					newWoche.appendChild( newTag );
 				}
	 		} else if ( currentDay == "Mon" ) {
	 			
		 			var newWoche = document.createElement("ul");
	 				newWoche.className = "week";
	 		}
	 		

	 		var newTag = document.createElement("li");
	 		newTag.className = "day";
	 		newTag.innerHTML = "" + tag;
	 		if ( currentDay == "Sat" || currentDay == "Sun" ) {
	 			newTag.className += " weekend";
	 		}
	 		for (var j = 0; j < calendar.length; j++ ) {
	 			if ( calendar[j].datum.getYear() == currentDate.getYear() &&  
	 				calendar[j].datum.getMonth() == currentDate.getMonth() &&
	 				 calendar[j].datum.getDate() == currentDate.getDate() ) { 
	 				newTag.id += "termin_" + calendar[j].id;
	 				newTag.className += " termin";
	 			}
	 		}
	 		if (isToday) {
 						newTag.className += " today";
 			}
	 		newWoche.appendChild( newTag );

	 		if ( currentDay == "Sun" || tag == daysInMonth) {
	 			newMonth.appendChild( newWoche );
	 		}
 			tag++;
 		}
 	}

 	return newMonth;
 	
 }

 function zeigeTermin( termin ) {

 	$('.page-wrapper').css('overflow','hidden');
 	$('.termin-box').stop().css('bottom','-700px').animate( { bottom: "0" }, 500, function() {
 		$('.page-wrapper').css('overflow-y', 'auto').css('overflow-x', 'hidden');
 	} );
	
	id = termin.slice( 7, termin.length );

	for ( var i = 0; i < calendar.length; i++ ) {
		
		if ( calendar[i].id == id ) {
			var terminDetails = document.createElement('div');
			terminDetails.className = "termin-info";
			terminDetails.innerHTML = "<h1>" + calendar[i].datum.toLocaleDateString() + " ";
			var uhrzeit = calendar[i].datum.getHours() + "h" + calendar[i].datum.getMinutes();
			while (uhrzeit.length < 5) {
				uhrzeit += "0";
			}
			terminDetails.innerHTML = "<h1>" + calendar[i].datum.toLocaleDateString() + " " + uhrzeit ;
			

			terminDetails.innerHTML += "<br><h2>" + calendar[i].name + "</h2><br>";
			terminDetails.innerHTML += calendar[i].description + "<br>";
			terminDetails.innerHTML += calendar[i].location + "<br>";
			

			$('.termin-box').children().remove();
			$('.termin-box').append( terminDetails ).removeClass('hide');


			/*var closingIcon = document.createElement('div');
			closingIcon.className = "closing-icon hide";
			var closingImg = document.createElement('img');
			closingImg.src = "icons/close.svg";
			closingIcon.appendChild( closingImg );
			$('.termin-box').append( closingIcon );*/

		}

	}
}