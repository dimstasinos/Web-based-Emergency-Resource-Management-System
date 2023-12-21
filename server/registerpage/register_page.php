<?php
include("../Mysql_connection.php");

try {

  $receive = file_get_contents('php://input');
  $data = json_decode($receive);

  $db = db_connect();

  $user_stmt = $db->prepare("INSERT INTO users(username,password,user_type) VALUES (?,?,'citizen')");
  $user_stmt->bind_param(
    "ss",
    $data->username,
    $data->password
  );
  $user_stmt->execute();




  $citizen_stmt = $db->prepare("INSERT INTO citizen(f_name,l_name,phone_number,lat,longi) VALUES (?,?,?,?,?)");
  $citizen_stmt->bind_param(
    "sssss",
    $data->f_name,
    $data->l_name,
    $data->phone_number,
    $data->latitude,
    $data->longitude
  );


  $citizen_stmt->execute();

  $db->close();
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success', $data]);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
