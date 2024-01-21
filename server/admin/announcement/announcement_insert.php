<?php

session_start();
include("../../Mysql_connection.php");

try {
  
  $db = db_connect();
  $announcement = "INSERT INTO announcements 
  values (NULL)";
  $db->query($announcement);

  $announcement_id = "SELECT LAST_INSERT_ID() as announcement_id";
  $announcement_id_responce =  $db->query($announcement_id);
  $announcement_id_row = $announcement_id_responce->fetch_assoc();

  $data["id"] = $announcement_id_row["announcement_id"];

  $db->close();

  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
