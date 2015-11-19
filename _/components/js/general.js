// Kalendergeschichten

var daysNames = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];
var monthsNames = [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ];



// Terminanzeige

var showingTermin = false;



//  Rotation App /
var c;

// AudioPlayer App /
var a;

// Calendar App
var cal;

// Timeline
var timeline;


var audioCtx;



// var isAudioPlayerActive = false;
// var TrackList = [];
// var currentTrack = 0;









$(function() {

	var loadCount = 0;

	function loader() {
		
		timeline = new Timeline( $('.arrow-left'), $('.arrow-right'), 'include/events.json', ".timeline" );
		timeline.setInitCallback( loadHandler );
		timeline.init();
		
		
			//* Caroussel App */
		c = new Caroussel( 'include/content.xml',
						
						$('.arrow-left'),
						$('.arrow-right')
						);
		c.init();
		c.setInitCallback( loadHandler );

		c.setMenuItems( [ 'home', 'vita', 'termine', 'media', 'kontakt' ] );


	}

	function loadHandler() {


		loadCount++;

		if (loadCount == 2 ) {
			//* geladen!
			//* Anzeige starten */
			changeMenuTo( 0 );

			/* Navigation verdrahten */
			wireNavigation();

			$(".effect-overlay").stop().fadeOut( 1000 );
		}
	};

	

	// Ladebildschirm
	$(".effect-overlay").stop().fadeIn( 0 );

	loader();

	
	
	
	
	

	//* Audio Context */
	if (window.AudioContext || window.webkitAudioContext) { 
		 	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	} else { audioCtx = '';	 }

	//* AudioPlayer App */
	a = new AudioPlayer();

	//* Calendar App */
	cal = new Calendar();
	
	
  //* Callback für Termine setzen
  c.setScrollCallback( 2, function() {  timeline.activate(); });
  c.setScrollCallback( 3, function() { a.refreshPlayer(); a.wireButtons(); })
  c.setBeforeScrollCallback( 0, function() { $('.timeline-arrow-left,.timeline-arrow-right,.timeline-heute').fadeOut(400); });
  c.setBeforeScrollCallback( 1, function() { $('.timeline-arrow-left,.timeline-arrow-right,.timeline-heute').fadeOut(400); });
  c.setBeforeScrollCallback( 3, function() { $('.timeline-arrow-left,.timeline-arrow-right,.timeline-heute').fadeOut(400); });
  c.setBeforeScrollCallback( 4, function() { $('.timeline-arrow-left,.timeline-arrow-right,.timeline-heute').fadeOut(400); });




	
	//* Audiotracks vorbereiten */
	a.addTrack( 'Sezuan Studie 1',
				[ 'audio/sezuan1.mp3' ],
				'images/eins.jpg' );
	a.addTrack( 'Sezuan Studie 2',
				[ 'audio/sezuan2.mp3' ],
				'images/zwei.jpg' );

	a.getAudio();

	
	
	
});


function wireNavigation() {
	$('.navbar-home').click(function() {		// Navigations Menu
		/*	$('.active').removeClass('active');
			$(this).parent().addClass("active");
*/
			
			
			changeMenuTo( 0 );
	});

	$('.navbar-vita').click(function() {
			
			changeMenuTo( 1 );

	});
	$('.navbar-termine').click(function() {
		/*	$('.active').removeClass('active');
			$(this).parent().addClass("active");*/

	
		changeMenuTo( 2 );
		
			
	});
	$('.navbar-media').click(function() {
			
		/*	$('.active').removeClass('active');
			$(this).parent().addClass("active");*/
			
			
			changeMenuTo( 3 );
	});
	$('.navbar-kontakt').click(function() {
		/*	$('.active').removeClass('active');
			$(this).parent().addClass("active");
*/
			changeMenuTo( 4 );
	});

}



function changeMenuTo( newActiveMenu ) {
	
/*	$(".effect-overlay").stop().fadeIn( 0 ).delay( 100 ).fadeOut( 1000 );*/
	c.scrollTo( newActiveMenu );
	
}
