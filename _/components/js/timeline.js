var Timeline = (function() {

	// Scrollbare Terminliste, geordnet nach Datum, Daten liegen in jsonFile, Ausgabe im div mit Id targetId
	function Timeline( leftIcon, rightIcon, jsonFile, target ) {
		
		this.leftIcon = leftIcon;
		this.rightIcon = rightIcon;
		this.jsonFile = jsonFile;
		this.target = target;

		// data ----------------------------------------------------------------------------------------------------------

		this.events = []; // array of events objects (from the json file)

		this.html = '';		// html markup of the events

		// Event in Focus
		this.currentEventIndex = -1;

		// called when init ready
		this.initCallback = function() {

		};

	} // constructor

	
	
	
	// setters
	Timeline.prototype.setInitCallback = function( func ) {
		var self = this;
		if ( typeof func === 'function' ) {
			self.initCallback = func;
		} 
	};



	// main fuctions -------------------------------------------------------------------------------------------

	// Read data and save HTML
	Timeline.prototype.init = function() {
		
		this.getEventsFromJson();

	};

	// bind scroll events and insert HTML
	Timeline.prototype.activate = function() {

		var self = this;

		// insert HTML
		$( self.target ).html( self.html );

	
		self.activateNavigation();


	};

	// unbind scroll events
	Timeline.prototype.deactivate = function() {
		var self = this;

		self.deactivateNavigation();
	};

	// -----------------------------------------------------------------------------------------------------------



	// parse json in array and to html
	Timeline.prototype.getEventsFromJson = function() {

		// helper functions

	
		var self = this;

		$.ajax({
		  dataType: "json",
		  url: this.jsonFile,
		  
		  success:  function( data ) { 

		  var htmlMarkUp = "";
		  var eventsArray = [];
		  	
			//* Element ins Array und sortieren */
			$.each( data, function( key, elem ) {
				
				elem.dateInMilliseconds = Date.parse( elem.datum );
				eventsArray.push( elem );
			});

			eventsArray.sort(function(x,y) {
				return ( x.dateInMilliseconds - y.dateInMilliseconds );
			});



			eventsArray.forEach( function( elem, key ) { 
				 
				var besetzung = "";

				$.each( elem.besetzung, function( rolle, darsteller ) { 
					besetzung += "<div class='zeile'><span class='rolle'>"+ rolle +":</span><span class='darsteller'>"+ darsteller +"</span></div>";
				}); // each

				var date = new Date( elem.datum );
				var formatedDate = date.toLocaleDateString();
				var formatedTime = date.toLocaleTimeString( navigator.language, {hour: '2-digit', minute: '2-digit' });
				formatedTime = formatedTime.replace(':','h');
				
				htmlMarkUp += '<div class="event">
							<div class="komponist">' + elem.komponist + '</div>
							<div class="title">'+ elem.title +'</div>
							<div class="ort">'+ elem.ort +'</div>
							<div class="datum">' + formatedDate + ' ' + formatedTime + '</div>
							<div class="besetzung">'+ besetzung +'</div>
						</div>';
			});		// each

			

			self.html = htmlMarkUp;
			self.events = eventsArray;

			self.initCallback();


			} // success
		}); // ajax
	
	};  // getEventsFromJson -----------------

	Timeline.prototype.activateNavigation = function() {

		function scrollToNextEvent() {

			var now = Date.now();
			var currentEventIndex = -1;
		
			self.events.forEach( function( elem, index ) {
				
				
				if ( (elem.dateInMilliseconds > now) && (currentEventIndex == -1 ) ) {
					currentEventIndex = index;
				}

							
			});

			if ( currentEventIndex == -1 ) {
					console.log(' Keine kommenden Vorstellungen! ');
				}

			var currentEvent = $(self.target).children().eq(currentEventIndex);

			var currentLeftPosition = currentEvent[0].offsetLeft;
			
			$(self.target).css("left", -currentLeftPosition );

			//* current Event gets marked
			currentEvent.addClass("highlight");

			console.log( self.events );


		}

		function bindMouseEvents() {

		}

		
		var self = this;

		scrollToNextEvent();
		bindMouseEvents();


	};


	Timeline.prototype.deactivateNavigation = function() {
		
	};

	



	return Timeline;

})();