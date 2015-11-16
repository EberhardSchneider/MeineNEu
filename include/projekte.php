<?php
	
include 'connect.php';
mysql_query('SET NAMES utf-8');
$jahr = $_POST["year"];

$result = $db->query("SELECT * FROM vergangene_projekte");


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