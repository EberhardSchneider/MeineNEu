/** Namespace */
var HLP = HLP || {};

HLP = {
	
	createHTML: function( tag, text, className ) {
			
			className = className || "";
			text = text || "";
			
			var html = document.createElement( tag );

			if (className !== "" ) { html.classList.add( className ); }
			if (text !== "") {
				textNode = document.createTextNode( text );
				html.appendChild( textNode );
			}
			return html;
		},
	

	createDIV: function( className, text ) {
			
			className = className || "";
			text = text || "";

			var html = document.createElement( 'div' );

			if (className !== "") { html.classList.add( className ); }
			if (text !== "") {
				textNode = document.createTextNode( text );
				html.appendChild( textNode );
			}
			return html;
	}
};