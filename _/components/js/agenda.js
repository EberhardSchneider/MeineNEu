var Agenda = {
	container: {
		/*html: "",*/
		css: {
			"position": "absolute",
			"left": 	"0",
			"top": 	 	"80px",
			"width": 	"1000%",
			"height": 	"220px",
			"overflow": "hidden"
		}, // css
		timeLine: []



	}, // container

	markUp: 	"",   // hier das einzuhängende HTML

	deceleration: 	0.9,

	isMouseDown: 	false,
	draggedObject: 	{
		domElement: 	{},
		x: 	0,
		y: 	0

	},


	leftPos: 	0,
	oldLeftPos: 	0,
	scrollSpeed: 	0,
	lastT: 			0,
	deltaT: 		0,
	scrolling: 		false,
	scrollHandler: 	function() {},




	// functions ----------------------------------------------------------------------------------------

	


	init: 	function() {
		var self = Agenda;		

		// loadData and make HTML
		var agenda = document.createElement('div');
		agenda.className = "agenda invisible";

	

		$.ajax({
		  dataType: "json",
		  url: "include/events.json",
		  
		  success:  function( data ) { 

		  	var html = "";

			$.each( data, function( key, elem ) {
				// events.push( elem );

				var besetzung = "";

				$.each( elem.besetzung, function( rolle, darsteller ) { 
					besetzung += "<div class='zeile'><span class='rolle'>"+ rolle +":</span><span class='darsteller'>"+ darsteller +"</span></div>";
				});

				html += '<div class="event">
							<div class="komponist">' + elem.komponist + '</div>
							<div class="title">'+ elem.title +'</div>
							<div class="ort">'+ elem.ort +'</div>
							<div class="datum">'+ elem.datum +'</div>
							<div class="besetzung">'+ besetzung +'</div>
						</div>';
				});		// each

			self.html = html;

			} // success
		}); // ajax

	},	// init

	
	// Seite aktivieren
	activate: 	function () {
		var self = Agenda;

		

		$('.timeline').html( self.html );
		

		self.activateNavigation();

	},


	// navigation -------------------------------------------------------------------------------------------------

	activateNavigation: 	function() {
		var self = Agenda;

		var elements = document.getElementsByClassName('event');

		for ( var index = 0; index < elements.length; index++ ) {
			$(".agenda")[0].addEventListener("mousedown", Agenda.mouseDownHandler, false );
			document.body.addEventListener("mouseup", Agenda.mouseUpHandler, false );
			document.body.addEventListener("mousemove", Agenda.mouseMoveHandler, false );
		}

	
	},


	animateTimeline: 	function() {
		var self = Agenda;

		// if ( Math.abs( self.scrollSpeed ) < 0.02 ) return;s

		
		self.leftPos += self.scrollSpeed;

		$(".agenda").css("left", self.leftPos + "px" );


	},
	

	
	mouseDownHandler: function( event ) {
		var self = Agenda;

		if (!self.isMouseDown) {

			self.isMouseDown = true;
			self.lastT = $.now();

			// change Icon
			$(".agenda").css("cursor", "move");
			
			
			self.draggedObject.domElement = $(this);
			self.draggedObject.x = event.pageX;
			self.draggedObject.y = event.pageY;

			var oldLeftString = $('.agenda').css("left");
			oldLeftString = oldLeftString.substring( 0 , oldLeftString.length - 2);
			self.oldLeftPos = parseInt( oldLeftString );

			self.animateHandler = setInterval( self.animateTimeline, 20);

		}
		
	},
	
	mouseUpHandler: function(event) {
		var self = Agenda;
		self.scrollSpeed = 0;

		self.isMouseDown = false;
		clearInterval( self.animateHandler );

		// change Icon back
		$(".agenda").css("cursor", "auto");
		
		

		function decelerateScrolling() {
			Agenda.scrollSpeed *= Agenda.deceleration;
			
			var leftStr = $('.agenda').css("left");
			var left = parseInt( leftStr.substring(0, leftStr.length - 2) );
			left -= Agenda.scrollSpeed;
			$('.agenda').css( "left", "" + left + "px" );

			if ( Math.abs( Agenda.scrollSpeed ) < 3  ) {
				clearInterval( Agenda.scrollHandler );
				Agenda.scrolling = false;
			}


		}
	},
	
	mouseMoveHandler: function( event ) {
		if (Agenda.isMouseDown) {
			
			var deltaX = Agenda.draggedObject.x - event.pageX;
			Agenda.deltaT = $.now() - Agenda.lastT;
			Agenda.lastT = $.now();
			Agenda.scrollSpeed = - deltaX / 10;

		}

	}

}; // Agenda