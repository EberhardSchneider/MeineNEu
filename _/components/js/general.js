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



var audioCtx;



// var isAudioPlayerActive = false;
// var TrackList = [];
// var currentTrack = 0;









$(function() {
	
	//* Caroussel App */
	c = new Caroussel( 'include/content.xml',
						0,
						$('.arrow-left'),
						$('.arrow-right')
						);
	
	c.setMenuItems( [ 'home', 'termine', 'media', 'kontakt' ] );

	//* Audio Context */
	if (window.AudioContext || window.webkitAudioContext) { 
		 	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	} else { audioCtx = '';	 }

	//* AudioPlayer App */
	a = new AudioPlayer();

	//* Calendar App */
	cal = new Calendar();
	
	//* Agenda noch kein Constructor, nur Objekt...  TODO */
	Agenda.init();



	//* wird gefeuert sobald HTML im Caroussel bereit ist */
	c.setReadyFunction(  function() { 
		a.refreshPlayer();
		a.wireButtons(); 
		if ( c.getNameOfActiveMenu() == 'termine' ) {
			cal.renderMonth();
			Agenda.activate();
		}
	}  );
	
	//* Audiotracks vorbereiten */
	a.addTrack( 'Sezuan Studie 1',
				[ 'audio/sezuan1.mp3' ],
				'images/eins.jpg' );
	a.addTrack( 'Sezuan Studie 2',
				[ 'audio/sezuan2.mp3' ],
				'images/zwei.jpg' );

	a.getAudio();

	//* Anzeige starten */
	changeMenuTo( 0 );


	

	/* Navigation verdrahten */
	wireNavigation();
	
	
});


function wireNavigation() {
	$('.navbar-home').click(function() {		// Navigations Menu
			$('.active').removeClass('active');
			$(this).parent().addClass("active");
			changeMenuTo( 0 );
	});
	$('.navbar-termine').click(function() {
			$('.active').removeClass('active');
			$(this).parent().addClass("active");
			changeMenuTo( 1 );
	});
	$('.navbar-media').click(function() {
			$('.active').removeClass('active');
			$(this).parent().addClass("active");
			changeMenuTo( 2 );
	});
	$('.navbar-kontakt').click(function() {
			$('.active').removeClass('active');
			$(this).parent().addClass("active");
			changeMenuTo( 3 );
	});

}



function changeMenuTo( newActiveMenu ) {
	
	$(".effect-overlay").stop().fadeIn( 0 ).delay( 100 ).fadeOut( 1000 );
	c.updateHTML( c.getMenuItems()[newActiveMenu] );
	
}
