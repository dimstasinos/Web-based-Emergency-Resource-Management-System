<?php
include("../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();

$add_stmt = $db->prepare("INSERT INTO announcements(text,date,quantity) VALUES (?,?,?)");
  

    $add_stmt->bind_param(
      "ssi",
      $data->text,
      $data->date,
      $data->quantity
    );
  
    $add_stmt->execute();
    $db->close();
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success',$data]);
?>