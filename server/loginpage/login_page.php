<?php

include("../Mysql_connection.php");

$db = db_connect();
try {
  $username = $_POST['username'];
  $password = $_POST['password'];

  $user_check = false;
  $pass_check = false;


  $mysql = "SELECT * FROM users WHERE username = '$username'";
  $response1 = $db->query($mysql);

 

  if ($response1->num_rows > 0) {

    $user_check = true;
  }

  $mysql = "SELECT username FROM users WHERE password = '$password'";
  $response2 = $db->query($mysql);
  
  if ($response2->num_rows > 0) {

    $pass_check = true;
  }

  if ($user_check = true && $pass_check = true) {
    header("Location: /html/admin/admin_mainPage.html");
  } else if ($user_check = false) {
    echo "Username is wrong.";
  } else if ($pass_check = false) {
    echo "Password is wrong.";
  }



  $db->close();
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
