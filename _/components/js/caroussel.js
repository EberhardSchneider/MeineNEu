var Caroussel = (function() {
	function Caroussel( ContentFile, MenuItemTagName, $leftItem, $rightItem ) {
		var self = this;

		/* kompletter Content im Array */
		this.content = [];

		//* Array zum Speichern der Pages */
		this.HTMLPages = [];

		//* angezeigte Seite */
		this.activeContentId = 0;

		//* Anzahl der Seiten in der Rotation */
		this.numberOfContentBoxes = 0;

		//* Parameter für das Rotieren */
		this.rotationDelay = 400;
		this.rotationDuration = 500;

		//* wird gerade rotiert? */
		this.isRotating = false;

		//* click/rotation events unbound ? */
		this.rotationUnbound = false;

		//* Name des XML Files */
		this.XMLFileName = ContentFile;

		//* Items für Links/Rechtsrotation */
		this.leftItem = $leftItem.get();
		this.rightItem = $rightItem.get();

		this.menuItems = '';

		this.activeMenuName = '';


		//* Links- und Rechts-Click verdrahten bzw. Pfeile verstecken */
		//* und sie verdrahten */
		this.wireRotation( $(this.leftItem), $(this.rightItem) );

		//* wird aufgerufen sobald HTML upgedatet */
		this.HTMLReady = function() {
		};

		//* wird aufgerufen, sobald XML geparst ist
		this.initCallback = function() {

		};
	}

	//* Getter & Setter ------------------------------------------------------------------------------------------


	/* Setter für initCallback */
	Caroussel.prototype.setInitCallback = function( func ) {
		var self = this;
		if ( typeof func === "function" ) {
			self.initCallback = func;
		}
		// body...
	};
	//* Setter für HTMLReady function / wird gefeuert sobald HTML komplett aufgebaut ist */
	Caroussel.prototype.setReadyFunction = function( func ) {
		this.HTMLReady = func;
	};

	//* Setter für die Menupunkte */
	Caroussel.prototype.setMenuItems = function( items ) {
		this.menuItems = items;
	};

	//* Getter für MenuItems */
	Caroussel.prototype.getMenuItems = function() {
		return this.menuItems;
	};

	//* Getter für den aktiven Menüpunkt-Namen **/
	Caroussel.prototype.getNameOfActiveMenu = function() {
		return this.activeMenuName;
	};


	Caroussel.prototype.init = function() {

		var self = this;

			/* Array Content befüllen */
			$.ajax({
				url: 'include/content.xml',
				type: 'GET',
				datatype: 'xml',

				success: function (data) {
					
				
					self.parseXML( $(data) );
					self.HTMLPages = self.content[0];


					self.initCallback();
				} // success

				
			}); // ajax

	}; // init

	


	
	/** HTML aus XML erzeugen und anzeigen */
	Caroussel.prototype.updateHTML = function( newActiveMenu ) {
		var self = this;


		self.HTMLPages = self.content[ newActiveMenu ];
		
		self.numberOfContentBoxes = self.HTMLPages.length;

		/* tricksen, falls es nur zwei Seiten gibt */
		if ( self.numberOfContentBoxes == 2 ) {
			self.HTMLPages[2] = this.HTMLPages[0];
		}

		
		/** und anzeigen */
		self.loadPages();
		self.HTMLReady();
	

	};

	//* unbind leftItem, rightItem, if used otherwise */
	Caroussel.prototype.unbindRotation = function() {
		var self = this;

		$(self.leftItem).off();
		$(self.rightItem).off();
	};

	
	//* Inhalt aus XML Datei parsen für Menupunkt menuItemTagName */
	Caroussel.prototype.getContentXML = function ( fileName, menuItemTagName ) {

			var self = this;

			self.HTMLPages = [];

			/* Array Content befüllen */
			$.ajax({
				url: 'include/content.xml',
				type: 'GET',
				datatype: 'xml',

				success: function (data) {
					
					// // XML Struktur durchlaufen... Menupunkte -> Seiten -> Content
					// $(data).find("content").children().each( function(menuIndex) {
					// 	HTMLPages.push( Caroussel.parseContent( $(data), $(this).prop('tagName') ) );
					// });

					/** Rotationstrommel laden */
					self.HTMLPages = self.parseXML( $(data), menuItemTagName );

					self.numberOfContentBoxes = self.HTMLPages.length;

					/* tricksen, falls es nur zwei Seiten gibt */
					if ( self.numberOfContentBoxes == 2 ) {
						self.HTMLPages[2] = this.HTMLPages[0];
					}

					
					/** und anzeigen */
					self.loadPages();
					self.HTMLReady();
			
				}
			});

	};

	
	/** Pfeil-Icons verdrahten */
	Caroussel.prototype.wireRotation = function(  ) {
		
		var self = this;


		//* evtl. Pfeile verstecken */
		if ( (self.numberOfContentBoxes == 1) && (self.getNameOfActiveMenu() != "termine") ) {
			$('.arrow-right').addClass('hide');
			$('.arrow-left').addClass('hide');
		}
		else {
			
			/* Pfeile zeigen, falls sie versteckt waren */
			$('.arrow-right').removeClass('hide');
			$('.arrow-left').removeClass('hide');

			/* linke/rechte Rotation verdrahten */
			
			$(self.leftItem).on( "click", function() { self.leftRotation(); } );
			$(self.rightItem).on( "click", function() { self.rightRotation(); } );
		
		}

	};



	
	/** Linksdrehung intern */
	Caroussel.prototype.adjustLeftRotation = function() {
		var self = this;

		self.activeContentId--;
		if (self.activeContentId < 0) {
	 		self.activeContentId = self.numberOfContentBoxes - 1;
	 	}
	 	$('.content-middle').empty().append(self.HTMLPages[ self.activeContentId ]);
	 	$('.content-rotate').css( "left", "-100%" );
		
	 	var idRightBox = (self.activeContentId == self.numberOfContentBoxes - 1) ? 0 : ( self.activeContentId + 1 );
	 	var idLeftBox = (self.activeContentId === 0) ? (self.numberOfContentBoxes - 1) : ( self.activeContentId - 1 );

	 	$('.content-left').empty().append( self.HTMLPages[idLeftBox]);
	 	$('.content-right').empty().append(self.HTMLPages[idRightBox]);
	};

	
	/** Rechtsdrehung intern */
	Caroussel.prototype.adjustRightRotation = function() {

		var self = this;

		self.activeContentId++;
		if (self.activeContentId > (self.numberOfContentBoxes - 1) ) {
	 		self.activeContentId = 0;
	 	}
	 	
	 	$('.content-middle').empty().append(self.HTMLPages[ self.activeContentId ]);
	 	$('.content-rotate').css( "left", "-100%" );
		
	 	var idRightBox = (self.activeContentId == self.numberOfContentBoxes - 1) ? 0 : ( self.activeContentId + 1 );
	 	var idLeftBox = (self.activeContentId === 0) ? (self.numberOfContentBoxes - 1) : ( self.activeContentId - 1 );

	 	$('.content-left').empty().append( self.HTMLPages[idLeftBox]);
	 	$('.content-right').empty().append(self.HTMLPages[idRightBox]);
	};

	
	/** Linksdrehung animieren */
	Caroussel.prototype.leftRotation = function() {

			var self = this;
				
			if (! self.isRotating ) {  /* nur wenn nicht gerade schon rotiert wird */
				
				$(self.leftItem).fadeOut(0).fadeIn(250); /* Effekt */
				self.isRotating = true;
				
				/* und die JQuery Anmimation */
				$('.content-rotate').delay( self.rotationDelay ).animate({
						left:'0'
					}, 
					self.rotationDuration, 
					"swing",
					function() {
						self.isRotating = false;
						self.adjustLeftRotation();
					}
				); // animate
			} // if

	};

	
	/** Rechtsdrehung animieren */
	Caroussel.prototype.rightRotation = function() {

			var self = this;
			
			if (! self.isRotating ) {  /* nur wenn nicht gerade schon rotiert wird */
				
				$(self.rightItem).fadeOut(0).fadeIn(250); /* Effekt */
				self.isRotating = true;
				
				/* und die JQuery Anmimation */
				$('.content-rotate').delay( self.rotationDelay ).animate({
						left:'-200%'
					}, 
					self.rotationDuration, 
					"swing",
					function() {
						self.isRotating = false;
						self.adjustRightRotation();
					}
				); // animate
			} // if
	};


	

	/** HTML aus Array auf Website anzeigen */
	Caroussel.prototype.loadPages = function () {
		
		var self = this;

		

		/* nur eine Seite */
		if (self.HTMLPages.length == 1) { 
			
			/* anhängen*/
			$('.content-middle').empty().append(self.HTMLPages[ 0 ]);

			/* und Pfeile verstecken */
			self.wireRotation( $(this.leftItem), $(this.rightItem) );
			
			return;
		 }

		$('.content-middle').empty().append(self.HTMLPages[ self.activeContentId ]);
		
	 	var idRightBox = (self.activeContentId == self.numberOfContentBoxes - 1) ? 0 : ( self.activeContentId + 1 );
	 	var idLeftBox = (self.activeContentId === 0) ? (self.numberOfContentBoxes - 1) : ( self.activeContentId - 1 );

	 	$('.content-left').empty().append( self.HTMLPages[idLeftBox]);
	 	$('.content-right').empty().append(self.HTMLPages[idRightBox]);

	 	self.wireRotation( $(this.leftItem), $(this.rightItem) );
	};


	
	/* XML Daten in HTML umwandeln */
	/** TODO alles auslagern in eigene Library */
	
	Caroussel.prototype.parseXML = function ( $xmlData ) {

	  var self = this;

		/* zum Speichern für die Rückgabe */
		
		var completeContent = [];

		/* Alle Menüpunkte im XML File durchlaufen */
		
		$xmlData.find( "content" ).children().each( function( menuIndex, elem ) {

			pages = [];

			/* Erst die einzelnen Seiten */
			$(elem).children().each( function (pageIndex) {

						var currentHTMLObject;

						
						HTMLPage = HLP.createHTML('div', '', 'page-wrapper'); /* Page_Wrapper */

						/* dann die Unterpunkte auf den Seiten  */
						$(this).children().each( function( subIndex ) {

						
							$obj = $(this);
							tag = $obj.prop('tagName');
							text = $obj.text();

							switch (tag) {
								case 'div': 		currentHTMLObject = HLP.createHTML('div', text);
													break;
								case 'p': 			currentHTMLObject = HLP.createHTML('p', text);
													break;
								case 'title': 		currentHTMLObject = HLP.createHTML('h1', text);
													break;
								case 'image': 		currentHTMLObject = document.createElement('img');
													currentHTMLObject.src =  $obj.attr('src');
													break;
								case 'calendar': 	currentHTMLObject = document.createElement('div');
													currentHTMLObject.className = "calendar-applet";
												
													break;
								case 'timeline': 		currentHTMLObject = HLP.createHTML( 'div', '', 'timeline' );
													break;
													
								case 'audioplayer': currentHTMLObject = a.getPlayerHTML();
													break;
								case 'HTML': 		currentHTMLObject = HLP.createDIV( 'html', '' );
													currentHTMLObject.innerHTML = text;


													break;						
							}     //* switch */

						
							
							HTMLPage.appendChild( currentHTMLObject );
						}); /* each */	
						pages.push( HTMLPage );
					}); /* each Pages*/

					completeContent.push(pages);
				});  /* MenuItems */
				self.content = completeContent;
				console.log("content fertig");

	};

	
	return Caroussel;
})();
