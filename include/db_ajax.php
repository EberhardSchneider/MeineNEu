<?php
	
include 'connect.php';



mysqli_query($db, 'SET NAMES utf-8');
$jahr = $_POST["year"];

$result = $db->query("SELECT * FROM termine ORDER BY datum DESC");


$index = 0;
$kalender = array();

while ( $dsatz = $result->fetch_assoc() ) {
	
	$kalender[$index] = $dsatz;
	$index++;
}

function encode_items(&$item, $key) // Umlaute behandeln
{
    $item = utf8_encode($item);
}
array_walk_recursive($kalender, 'encode_items');

print json_encode( $kalender );

mysqli_close( $db );?>