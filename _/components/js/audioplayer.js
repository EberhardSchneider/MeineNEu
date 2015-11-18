var AudioPlayer = (function() {
	function AudioPlayer() {
		

		//* Track Objekt */
		track = {
			name: '',
			src: [],
			image: ''
		};

		//* Track Liste */
		this.trackList = [];

		//* Audio Data for the tracks */
		this.audioData = [];

		//* current Track */
		this.currentTrack = 0;

		//* playing position */
		this.playingPosition = 0;

		//* playing or not */
		this.isPlaying = false;

		//* Audio geladen? */
		this.isAudioReady = false;

		//* Soundnode für Web Audio API */
		this.soundNode = null;

		// Internet Explorer ? */
		if (audioCtx === '') {
			this.isIE = true;
		} else {
			this.isIE = false;
		}
		
	}

	AudioPlayer.prototype.play = function() {
		
		if (this.isPlaying) return;

		this.soundNode = audioCtx.createBufferSource();
		this.soundNode.buffer = this.audioData[ this.currentTrack ];
		this.soundNode.connect(audioCtx.destination);
		this.soundNode.start();
		this.isPlaying = true;


	};

	AudioPlayer.prototype.stop = function() {
		
		if (!this.isPlaying) return;

		this.soundNode.stop();
		this.isPlaying = false;


	};

	AudioPlayer.prototype.getAudio = function() {
		
		var self = this;

		var numberOfTracksLoaded = 0;

		this.trackList.forEach( function( elem, index ) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', elem.src, true);
			xhr.responseType = 'arraybuffer';
			xhr.addEventListener('load', loadHandler, false);
			xhr.send();
		
			function loadHandler(event) {
			audioCtx.decodeAudioData(
				xhr.response,
				function(buffer) {
					self.audioData.push( buffer );
					numberOfTracksLoaded++;
					if (numberOfTracksLoaded == self.trackList.length ) {
						self.isAudioReady = true;
					}
					
				},
				function(e) {
					console.log( e );
				}
			);
		}
		});

	};	


	AudioPlayer.prototype.addTrack = function( name, sourceFiles, imageFile ) {
		
		//* Element schon vorhanden? */
		var isDouble = false;

		//* Namen abchecken */
		this.trackList.forEach( function( elem ) {
			if (elem.name == name) { isDouble = true; }
		});

		//* und falls doppelt false zurückgeben */
		if (isDouble) { return false; }

		var newTrack = {};

		newTrack.name = name;
		newTrack.src = sourceFiles;
		newTrack.image = imageFile;

		this.trackList.push( newTrack );

	};

	AudioPlayer.prototype.removeTrack = function( name ) {
		
		var indexToRemove = -1;

		//* Namen suchen */
		this.trackList.forEach( function( elem, index  ) {
			if (elem.name == name ) {
				indexToRemove = index;
			}
		});

		//* falls gefunden, entsprechendes Element aus dem Array entfernen */
		if (indexToRemove > -1) {
			this.trackList.splice( indexToRemove, 1 );
		}
		return;
	};

	AudioPlayer.prototype.refreshPlayer = function( audioPlayerInstance ) {

		if ( (this.trackList.length === 0) || (!this.isAudioReady) ) { return; }

		var track = this.trackList[ this.currentTrack ];
	
		var image = document.createElement('img');
		image.src = track.image;
				
		$('.audio-track-image').empty().append( image );
		$('.audio-track-name').empty().append( track.name );	

	};

	AudioPlayer.prototype.wireButtons = function() {

		var self = this;

		$('.audio-back-button').click(function() {
			self.stop();

			self.currentTrack--;
			if (self.currentTrack < 0) {
				self.currentTrack = self.trackList.length - 1;
			}
			self.refreshPlayer();
		});
		$('.audio-forward-button').click(function() {
			self.stop();

			self.currentTrack++;
			if (self.currentTrack == self.trackList.length) {
				self.currentTrack = 0;
			}
			self.refreshPlayer();

		});
		$('.audio-play-button').click(function() {
			self.play();
		});
		$('.audio-stop-button').click(function() {
			self.stop();
		});
	};

	AudioPlayer.prototype.getPlayerHTML = function () {

		if (audioCtx === '') { 
			return  HLP.createHTML('p', 'InternetExplorer support not implemented yet', 'audio-wrapper');
		 }

		var HTML = HLP.createHTML('div', '', 'audio-wrapper');


		var audioTitle = HLP.createHTML('div', '', 'audio-title');

		var audioTrackImage = HLP.createHTML('div', '', 'audio-track-image');

		var audioTrackName = HLP.createHTML('div', '', 'audio-track-name');

		var audioProgress = HLP.createHTML('div', '', 'audio-progress');

		var audioControls = HLP.createHTML('div', '', 'audio-controls');


		var audioPlayButton = document.createElement('a');
		var audioStopButton = document.createElement('a');
		var audioBackButton = document.createElement('a');
		var audioForwardButton = document.createElement('a');
		
		audioPlayButton.className = "audio-play-button fa-stack";
		audioPlayButton.innerHTML = "<span class='fa fa-circle fa-stack-2x icon-background'></span><span class='fa fa-play fa-inverse small'></span>";
		audioStopButton.className = "audio-stop-button fa-stack";
		audioStopButton.innerHTML = "<span class='fa fa-circle fa-stack-2x icon-background'></span><span class='fa fa-stop fa-inverse small'></span>";
		audioBackButton.className = "audio-back-button fa-stack";
		audioBackButton.innerHTML = "<span class='fa fa-circle fa-stack-2x icon-background'></span><span class='fa fa-step-backward fa-inverse small'></span>";
		audioForwardButton.className = "audio-forward-button fa-stack";
		audioForwardButton.innerHTML = "<span class='fa fa-circle fa-stack-2x icon-background'></span><span class='fa fa-step-forward fa-inverse small'></span>";


		audioControls.appendChild( audioBackButton );
		audioControls.appendChild( audioPlayButton );
		audioControls.appendChild( audioStopButton );
		audioControls.appendChild( audioForwardButton );

		audioTitle.appendChild( audioTrackImage );
		audioTitle.appendChild( audioTrackName );
		
		HTML.appendChild( audioTitle );
		HTML.appendChild( audioProgress );
		HTML.appendChild( audioControls );

		return HTML;
	};

	return AudioPlayer;
})();