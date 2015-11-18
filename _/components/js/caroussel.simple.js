var Caroussel = (function() {
	function Caroussel( ContentFile, $leftItem, $rightItem ) {
		var self = this;

		

		//* Array zum Speichern der Pages */
		this.HTMLPages = [];

		//* angezeigte Seite */
		this.activeContentId = 0;

		//* Anzahl der Seiten in der Rotation */
		this.numberOfContentBoxes = 0;

		//* Parameter für das Rotieren */
		this.rotationDelay = 200;
		this.rotationDuration = 400;

		//* wird gerade rotiert? */
		this.isRotating = false;
		//* Ziel für das Scrolling */
		this.scrollTarget = -1;

		//* click/rotation events unbound ? */
		this.rotationUnbound = true;

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
		
		// array of functions fired then right page is presented
		this.scrollCallback = [];


	}

	//* Getter & Setter ------------------------------------------------------------------------------------------

	// Setter for scrollCallback
	Caroussel.prototype.setScrollCallback = function( contentNumber, func ) {
		var self = this;
		if ( typeof func == 'function') {
			self.scrollCallback[contentNumber] = func;
		}
	};

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

	Caroussel.prototype.clearReadyFunction = function() {
		this.HTMLReady = function() {};   
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
					//* set all scrollCallbacks to empty function
					for (var i = 0; i < self.HTMLPages.length; i++) {
						if ( self.scrollCallback[i] == null ) { 
							self.scrollCallback[i] = function() {}
						}
					}
					
					self.loadPages();


					self.initCallback();
				} // success

				
			}); // ajax

	}; // init

	Caroussel.prototype.showUnbindArrows = function() {
		var self = this;

		$(self.leftItem).removeClass("hide");
		$(self.rightItem).removeClass("hide");

		$(self.leftItem).off();
		$(self.rightItem).off();

		self.rotationUnbound = true;

	};

	Caroussel.prototype.hideBindArrows = function() {
		
	};

	// ---------------------------------------------------------------------------------------------------


	
	/** HTML aus XML erzeugen und anzeigen */
	Caroussel.prototype.updateHTML = function( newActiveMenu ) {
		var self = this;


		
		/** und anzeigen */
		self.loadPages();

		self.HTMLReady();
	

	};

	//* unbind leftItem, rightItem, if used otherwise */
	/*Caroussel.prototype.unbindRotation = function() {
		var self = this;

		$(self.leftItem).off();
		$(self.rightItem).off();
	};*/

	
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
	Caroussel.prototype.wireRotation = function() {
		
		var self = this;


		//* evtl. Pfeile verstecken */
		if ( self.numberOfContentBoxes == 1 ) {
			$(self.rightItem).addClass('hide');
			$(self.leftItem).addClass('hide');
		}
		else {

			
			
			/* Pfeile zeigen, falls sie versteckt waren */
			$(self.rightItem).removeClass('hide');
			$(self.leftItem).removeClass('hide');



			/* linke/rechte Rotation verdrahten */
			
			if (self.rotationUnbound) {
				$(self.leftItem).off("click");
				$(self.rightItem).off("click");

				$(self.leftItem).click( function() { 
					var target = self.activeContentId == 0 ? self.HTMLPages.length-1 : self.activeContentId-1;
					self.scrollTo( target );
				 } );
				$(self.rightItem).on( "click", function() { 
					var target = self.activeContentId == self.HTMLPages.length-1 ? 0 : self.activeContentId+1;
					self.scrollTo( target );
				});
				self.rotationUnbound = false;
			}
		
		}

	};



	
	/** Linksdrehung intern */
	Caroussel.prototype.adjustLeftRotation = function() {
		var self = this;

		$(".navigation-bar ul").children().eq(self.activeContentId).removeClass("active");


		self.activeContentId--;
		if (self.activeContentId < 0) {
	 		self.activeContentId = self.numberOfContentBoxes - 1;
	 	}

		$(".navigation-bar ul").children().eq(self.activeContentId).addClass("active");

	 	$('.content-middle').empty().append(self.HTMLPages[ self.activeContentId ]);
	 	$('.content-rotate').css( "left", "-100%" );
		
	 	var idRightBox = (self.activeContentId == self.numberOfContentBoxes - 1) ? 0 : ( self.activeContentId + 1 );
	 	var idLeftBox = (self.activeContentId === 0) ? (self.numberOfContentBoxes - 1) : ( self.activeContentId - 1 );

	 	$('.content-left').empty().append( self.HTMLPages[idLeftBox]);
	 	$('.content-right').empty().append(self.HTMLPages[idRightBox]);

	 	if (self.scrollTarget != self.activeContentId ) {
	 		self.leftRotation();
	 	} else {
	 		console.log("Rufe auf Nr." + self.activeContentId);
	 		 self.scrollCallback[self.activeContentId]();
	 	}


	};

	
	/** Rechtsdrehung intern */
	Caroussel.prototype.adjustRightRotation = function() {

		var self = this;

		$(".navigation-bar ul").children().eq(self.activeContentId).removeClass("active");

		self.activeContentId++;
		if (self.activeContentId > (self.numberOfContentBoxes - 1) ) {
	 		self.activeContentId = 0;
	 	}

	 	$(".navigation-bar ul").children().eq(self.activeContentId).addClass("active");

		

	 	
	 	$('.content-middle').empty().append(self.HTMLPages[ self.activeContentId ]);
	 	$('.content-rotate').css( "left", "-100%" );
		
	 	var idRightBox = (self.activeContentId == self.numberOfContentBoxes - 1) ? 0 : ( self.activeContentId + 1 );
	 	var idLeftBox = (self.activeContentId === 0) ? (self.numberOfContentBoxes - 1) : ( self.activeContentId - 1 );

	 	$('.content-left').empty().append( self.HTMLPages[idLeftBox]);
	 	$('.content-right').empty().append(self.HTMLPages[idRightBox]);

	 	if (self.scrollTarget != self.activeContentId ) {
	 		self.rightRotation();
	 	} else {
	 		console.log("Rufe auf Nr." + self.activeContentId);
	 		 self.scrollCallback[self.activeContentId]();
	 	}
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
	Caroussel.prototype.rightRotation = function(  ) {

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

	Caroussel.prototype.scrollTo = function( newActivePage ) {
		var self = this;

		self.scrollTarget = newActivePage;


		if ( self.scrollTarget > self.activeContentId ) {
			if ( (self.scrollTarget - self.activeContentId) < 3 ) { self.rightRotation(); }
				else { self.leftRotation(); }

		} else 	if ( self.scrollTarget < self.activeContentId ) {
			if ( (self.activeContentId - self.scrollTarget ) < 3 ) { self.leftRotation(); }
				else { self.rightRotation(); }
		}

	};


	

	/** HTML aus Array auf Website anzeigen */
	Caroussel.prototype.loadPages = function () {
		
		var self = this;

		

		/* nur eine Seite */
		if (self.HTMLPages.length == 1) { 
			
			/* anhängen*/
			$('.content-middle').empty().append(self.HTMLPages[ 0 ]);

			/* und Pfeile verstecken */
			self.wireRotation( $(self.leftItem), $(self.rightItem) );
			
			return;
		 }

		$('.content-middle').empty().append(self.HTMLPages[ self.activeContentId ]);
		
	 	var idRightBox = (self.activeContentId == self.numberOfContentBoxes - 1) ? 0 : ( self.activeContentId + 1 );
	 	var idLeftBox = (self.activeContentId === 0) ? (self.numberOfContentBoxes - 1) : ( self.activeContentId - 1 );

	 	$('.content-left').empty().append( self.HTMLPages[idLeftBox]);
	 	$('.content-right').empty().append(self.HTMLPages[idRightBox]);

	 	
	};


	
	/* XML Daten in HTML umwandeln */
	/** TODO alles auslagern in eigene Library */
	
	Caroussel.prototype.parseXML = function ( $xmlData ) {

	  var self = this;

	

		/* Alle Menüpunkte im XML File durchlaufen */
		
		$xmlData.find( "content" ).children().each( function( menuIndex, elem ) {

			
			// save menu item name
			self.menuItems.push( elem.nodeName );

			/* jeweils nur eine Seite */


						var currentHTMLObject;

						
						HTMLPage = HLP.createHTML('div', '', 'page-wrapper'); /* Page_Wrapper */

						var $page = $(elem);

						$page.children().each( function(index, elem ) {
							$obj = $(elem);
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
								case 'HTML': 		currentHTMLObject = HLP.createDIV( '', '' );
													currentHTMLObject.innerHTML = text;


													break;						
							}     //* switch */
					
							HTMLPage.appendChild( currentHTMLObject );
					});
							
							
						
					self.HTMLPages.push( HTMLPage );
				
				});  /* MenuItems */
				self.numberOfContentBoxes = self.HTMLPages.length;

	};

	
	return Caroussel;
})();
