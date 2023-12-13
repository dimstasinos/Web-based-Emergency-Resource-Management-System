<?php
include("../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();

$add_stmt = $db->prepare("INSERT INTO items VALUES (?,?,?)");

$add_stmt->bind_param(
  "isi",
  $data->id,
  $data->category,
  $data->name
);

$add_stmt->execute();
  $db->close();


?>