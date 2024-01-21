<?php

session_start();

include("../../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

try {

  $db = db_connect();

  $announcement = $db->prepare("SELECT * from announcement_items where
  announcement_id=?");
  $announcement->bind_param(
    "i",
    $data->id
  );
  $announcement->execute();
  $announcement_response = $announcement->get_result();

  if ($announcement_response->num_rows == 1) {

    $delete = $db->prepare("DELETE FROM announcements WHERE announcement_id=?");
    $delete->bind_param(
      "i",
      $data->id
    );
    $delete->execute();
  } else {
    $delete = $db->prepare("DELETE FROM announcement_items WHERE announcement_id=? and announcement_item_id=?");
    $delete->bind_param(
    "ii",
      $data->id,
      $data->item_id
    );
    $delete->execute();
  }

  $db->close();
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
