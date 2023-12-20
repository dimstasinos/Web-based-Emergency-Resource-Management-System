<?php

include("../Mysql_connection.php");

$db = db_connect();

$mysql = "SELECT citizen_requert_id,submission_date FROM citizen_requests";
$response = $db->query($mysql);



$requests = array();

if ($response->num_rows > 0) {
  while ($row = $response->fetch_assoc()) {




  }
}
