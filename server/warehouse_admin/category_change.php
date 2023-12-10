<?php

include("../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();

try{

  $add_cat_stmt = $db->prepare("UPDATE items SET item_category=?
  where item_id=?");

  $add_cat_stmt->bind_param(
    "ii",
    $data->new_cat,
    $data->id
  );

  $add_cat_stmt->execute();
  $db->close();

  header('Content-Type: application/json');
  echo json_encode(['status' => 'success',$data]);

}catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error: " . $error->getMessage()]);
}

?>