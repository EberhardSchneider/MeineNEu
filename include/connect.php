<?php
	
	$host = "localhost";
	$user = "web512";
	$password = "castorp7";
	$link = "usr_web512_1";


	$db = mysqli_connect( $host, $user, $password, $link ) or die(mysqli_error());
	



	$db->select_db("termine");
?>