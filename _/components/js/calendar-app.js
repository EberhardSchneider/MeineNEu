var Calendar = (function() {
	function Calendar() {
		
		this.currentYear = 2015;
		this.currentMonth = 8;

		/* events to show */
		this.events = [];

		/* class in which the calendar gets displayed */
		this.targetClass = '';

		/* */
		this.daysNames = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];
		this.monthsNames = [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ];

	}

	Calendar.prototype.nextMonth = function () {
		this.currentMonth = ( this.currentMonth == 12 ) ? 1 : ( this.currentMonth + 1 );
		if (this.currentMonth == 1) { this.currentYear++; }
		this.renderMonth();
	};

	Calendar.prototype.lastMonth = function () {
		this.currentMonth = ( this.currentMonth == 1 ) ? 12 : ( this.currentMonth - 1 );
		if (this.currentMonth == 12) { this.currentYear--; }
		this.renderMonth();
	};

	Calendar.prototype.setTargetClass = function( c ) { 
		this.targetClass = c;
	};



	/* Termine verdrahten */
	Calendar.prototype.wireEvents = function() {

		var self = this;

		$('.termin').click( function() {
			self.showEvent( $(this).attr('id') );
		});
	
	};

	/* Termin zeigen */
	Calendar.prototype.showEvent = function( id ) {
		
		
		var self = this;

		/* auf die Nummer reduzieren */
		id = id.slice( 7, id.length ); 

		/* und den entsprechenden Termin suchen */
		/* TODO Termine in MAP nach id speichern */

		for ( var i = 0; i < self.events.length; i++ ) {
		
			if ( self.events[i].id == id ) {
				/* Wrapper für die Termin-Infos */
				var terminDetails = document.createElement('div');
				terminDetails.className = "termin-info";
				

				/* Datum */
				terminDetails.innerHTML = "<h1>" + self.events[i].datum.toLocaleDateString() + " ";
				
				/* Uhrzeit */
				var uhrzeit = self.events[i].datum.getHours() + "h" + self.events[i].datum.getMinutes();
				
				/* mit Nullen auffüllen */
				while (uhrzeit.length < 5) {
					uhrzeit += "0";
				}
				/* und zusammensetzen */
				terminDetails.innerHTML = "<h1>" + self.events[i].datum.toLocaleDateString() + " " + uhrzeit ;
				

				/* Name, Beschreibung und Ort */
				terminDetails.innerHTML += "<br><h2>" + self.events[i].name + "</h2><br>";
				terminDetails.innerHTML += self.events[i].description + "<br>";
				terminDetails.innerHTML += self.events[i].location + "<br>";
				

				/* und alles anhängen */
				$('.termin-box').children().remove();
				$('.termin-box').append( terminDetails ).removeClass('hide');
			}


		}

		$('.termin-info').finish().animate( { backgroundColor: "rgba(255ert,255,255,1)" }, 700 );
	};

	/* Daten für Termine holen */
	Calendar.prototype.getData = function( fileName ) {
		
		var self = this;

		// kalender Array befüllen
		$.ajax({
			url: fileName,   /* include/db_ajax.php */
			type: 'POST',
			data: {year: self.currentYear},
			dataType: 'json',
			async: false,
			success: function (data) {
				self.events = data;
				for (var i = 0; i < self.events.length; i++) {
					self.events[i].datum = new Date( self.events[i].datum.replace(' ','T') ); // Datum von string in Date
				}
				 
			}
		})		
		.done(function() {
			console.log("success");
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		
		
		}); // of $.ajax
		

	};

	/* Monat rendern*/
	Calendar.prototype.renderMonth = function() {
		

		var self = this;

		/* hier schon speichern für später */
		var todayDate = new Date();

		/** Container für das entstehende HTML */
		var newMonth = HLP.createHTML( 'div', '', 'calendar');

		/* für die Bequemlichkeit */
		var month = self.currentMonth;
		var year = self.currentYear;

		/** Anzahl der Tage feststellen */
		/** TODO eigene Funktion */
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

	 	/* Monatsüberschrift und Navigation*/
	 	var monthHeader = HLP.createHTML( 'div', '', 'month-header');

	 	/** Links- Rechtsnavigation */
	 	/* DIVs erstellen */
	 	var leftArrow = HLP.createHTML( 'div', '', 'calendar-left-arrow');
	 	var rightArrow = HLP.createHTML( 'div', '', 'calendar-right-arrow');

	 	/* Und die ICONs einsetzen */
	 	imgLeftArrow = document.createElement('img');
		imgRightArrow = document.createElement('img');
		imgLeftArrow.src = 'icons/left.svg';
		imgRightArrow.src = 'icons/right.svg';
		leftArrow.appendChild( imgLeftArrow );
		rightArrow.appendChild( imgRightArrow );

		leftArrow.onclick = function() { self.lastMonth(); };
		rightArrow.onclick = function() { self.nextMonth(); };

		/* Monat und Jahr */
		var titel = HLP.createDIV( 'month-name', self.monthsNames[month-1] + " " +year );

		/* Den Header zusammensetzen */
		monthHeader.appendChild( leftArrow );
	 	monthHeader.appendChild( titel );
	 	monthHeader.appendChild( rightArrow );

	 	/* und anhängen */
	 	newMonth.appendChild( monthHeader );

	 	/* jetzt der eigentliche Kalender */

	 	/* Datum */
	 	var tag = 1;

	 	var listMonth = document.createElement('ul');


 		/* alle Tage im Monat */
 		while ( tag <= daysInMonth ) {
 			
 			var isToday;
 			var newTag, newWoche;

 			/* ersteinmal feststelelen, ob gerade heute ist */
 			if ( (tag == todayDate.getDate()) && (month-1 == todayDate.getMonth()) && (year-1900 == todayDate.getYear() )) {
 				isToday = true;
 			}
 			else {
 				isToday = false;
 			}

 			/* zu schreibendes Datum */
 			var currentDate = new Date( year, month-1, tag );
	 		

	 		/* welcher Wochentag */
	 		var currentDay = currentDate.toString().slice(0,3);

	 		
	 		/* Container für das Datum */
	 		newTag = document.createElement("li");
	 		newTag.className = "day";
	 		newTag.innerHTML = "" + tag;

	 		/* Wochenende ? */
	 		if ( currentDay == "Sat" || currentDay == "Sun" ) {
	 			newTag.className += " weekend";
	 		}

	 		/* Testen, ob ein Termin im Speicher liegt */
	 		for (var j = 0; j < self.events.length; j++ ) {
	 			if ( self.events[j].datum.getYear() == currentDate.getYear() &&  
	 				self.events[j].datum.getMonth() == currentDate.getMonth() &&
	 				 self.events[j].datum.getDate() == currentDate.getDate() ) { 
	 				newTag.id += "termin_" + self.events[j].id;
	 				newTag.className += " termin";
	 				newTag.onclick = function() { self.showEvent( this.id ); };
	 			}
	 		}

	 		/* markieren, falls HEUTE ist */
	 		if (isToday) {
 						newTag.className += " today";
 			}
	 		

	 		/* und an die Woche anhängen */
	 		listMonth.appendChild( newTag );

 			

 			/* und die Schleife geht weiter */
 			tag++;
 		}

 		listMonth.className = "monatListe";
 		newMonth.appendChild( listMonth );
 		$( ".calendar-applet" ).empty().append( newMonth );

	};


	/* nächster Monat */

	return Calendar;
})();