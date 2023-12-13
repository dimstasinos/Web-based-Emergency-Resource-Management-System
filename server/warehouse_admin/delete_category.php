<?php
include("../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();

try {

  $delete_stmt = $db->prepare("DELETE FROM item_category WHERE
  category_id=?");



} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error: " . $error->getMessage()]);
}

?>