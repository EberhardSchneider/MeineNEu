var Timeline = (function() {

	// Scrollbare Terminliste, geordnet nach Datum, Daten liegen in jsonFile, Ausgabe im div mit Id targetId
	function Timeline( $leftIcon, $rightIcon, jsonFile, target ) {
		
		this.$leftIcon = $leftIcon;
		this.$rightIcon = $rightIcon;
		this.jsonFile = jsonFile;
		this.target = target;

		// data ----------------------------------------------------------------------------------------------------------

		this.events = []; // array of events objects (from the json file)

		this.html = '';		// html markup of the events

		// Event in Focus
		this.currentEvent = null;
		this.currentEventIndex = -1;

		// scroll handling
		this.isScrolling = false;

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
		this.insertArrows();

	};

	// bind scroll events and insert HTML
	Timeline.prototype.activate = function() {

		var self = this;

		// insert HTML
		$( self.target ).html( self.html );

	
		
		self.activateNavigation();
		self.showArrows();


	};

	// unbind scroll events
	Timeline.prototype.deactivate = function() {
		var self = this;

		self.deactivateNavigation();
	};

	Timeline.prototype.scrollToIndex = function( index ) {
		
		var self = this;

		if ( self.currentEvent != null ) self.currentEvent.removeClass("highlight");

		var currentEvent = $(self.target).children().eq( index );
		var currentLeftPosition = currentEvent[0].offsetLeft;

		// so positionieren, dass das currentEvent in der Mitte ist
		var width = $(".page-wrapper").width();
		
		$(self.target).stop().animate({ left: -currentLeftPosition + (width/2) - 112  }, 200 );

		
		self.currentEvent = currentEvent;
		self.currentEventIndex = index;

		//* current Event gets marked
		currentEvent.addClass("highlight");
	};

	// -----------------------------------------------------------------------------------------------------------


	Timeline.prototype.insertArrows = function() {
		var htmlMarkUp = '<div class="timeline-arrow-left" style="display:none;"><img src="icons/left.svg"></div><div class="timeline-heute">Heute</div>
			<div class="timeline-arrow-right" style="display:none;"><img src="icons/right.svg"></div>';
		$('body').append( htmlMarkUp );
	};

	Timeline.prototype.showArrows = function() {
		$('.timeline-arrow-left,.timeline-heute').fadeIn(400);
		$('.timeline-arrow-right').fadeIn(400);
	

	};

	// parse json in array and to html
	Timeline.prototype.getEventsFromJson = function() {

		// helper functions

	
		var self = this;

		$.ajax({
		  dataType: "json",
		  url: this.jsonFile,
		  
		  success:  function( data ) { 

		  
		  var eventsArray = [];
		  var htmlMarkUp = "";
		  	
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

		function scrollToComingEvent() {

			var now = Date.now();
			var currentEventIndex = -1;
		
			self.events.forEach( function( elem, index ) {
				
				
				if ( (elem.dateInMilliseconds > now) && (currentEventIndex == -1 ) ) {
					currentEventIndex = index;
				}

				if (currentEventIndex == -1 ) {
					$(self.target).children().eq( index ).addClass("faded");
				}			
			});

			if ( currentEventIndex == -1 ) {
					console.log(' Keine kommenden Vorstellungen! ');
				}

			self.scrollToIndex( currentEventIndex );


		}

		function bindMouseEvents() {
			self.$leftIcon.on("click", function() { self.scrollBack() });
			self.$rightIcon.on("click", function() { self.scrollForward() });
			self.$heuteIcon.on("click", scrollToComingEvent );
		}

		function positionArrows() {
			
			self.$leftIcon = $('.timeline-arrow-left');
			self.$rightIcon = $('.timeline-arrow-right');
			self.$heuteIcon = $('.timeline-heute');

			var center = $('.wrapper').width() / 2;
			var widthIcon = self.$heuteIcon.width();

			self.$leftIcon.css( { left: "34%", top: ($('.timeline').offset().top -45 ) + "px" });
			self.$rightIcon.css( { right: "34%", top: ($('.timeline').offset().top -45 ) + "px" });
			self.$heuteIcon.css( { left: (center - widthIcon/2) + "px", top: ($('.timeline').offset().top -35 ) + "px" });


		}

		
		var self = this;

		scrollToComingEvent();
		positionArrows();
		bindMouseEvents();


	};

	Timeline.prototype.scrollBack = function() {
		var self = this;

		self.currentEventIndex = (self.currentEventIndex == 0) ? 0 : (self.currentEventIndex-1);
		self.scrollToIndex( self.currentEventIndex );
	};

	Timeline.prototype.scrollForward = function() {
		var self = this;


		self.currentEventIndex = (self.currentEventIndex != (self.events.length-1)) ? (self.currentEventIndex+1) : (self.events.length-1) ;
		self.scrollToIndex( self.currentEventIndex );
		self.scrollToIndex( self.currentEventIndex );
	
	};


	Timeline.prototype.deactivateNavigation = function() {
		
	};

	



	return Timeline;

})();