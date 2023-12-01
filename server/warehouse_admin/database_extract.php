<?php

include("../Mysql_connection.php");

$db = db_connect();

$mysql = "SELECT * from item_category";
$response = $db->query($mysql);

if ($response->num_rows > 0) {

  $data = array("categories" => array());
  
  while ($row = $response->fetch_assoc()) {
    $category = array(
      "id" => $row['category_id'],
      "category_name" => $row['category_name']
    );
    $data["categories"][] = $category;
  }

  $db->close();

  $json_data = json_encode($data);
 
  header('Content-Type: application/json');

  echo $json_data;
}
