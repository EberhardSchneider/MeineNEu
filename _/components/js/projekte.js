function projekteAusgeben() {
	$.ajax({
		url: 'include/projekte.php',   /* include/db_ajax.php */
			type: 'GET',
			
			dataType: 'json',
			async: false,
			success: function (data) {
				data.forEach( function() {
					console.log( data.name );
					console.log( 'h' );
					console.log();
				});
				 
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
	}

	);
}