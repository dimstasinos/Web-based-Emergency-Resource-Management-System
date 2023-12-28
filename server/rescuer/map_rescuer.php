<?php

include("../Mysql_connection.php");

$db = db_connect();
$features = array();

$mysql = "SELECT DISTINCT req_citizen_id FROM citizen_requests;";
$response = $db->query($mysql);

if($response->num_rows > 0) {
  while ($requests_row = $response->fetch_assoc()) {


    
  }

}