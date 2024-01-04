<?php

session_start();

include("Mysql_connection.php");

$db = db_connect();
try {
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $user_check = false;
    $pass_check = false;


    $mysql = "SELECT * FROM users WHERE username = '$username'";
    $response_user = $db->query($mysql);


    if ($response_user->num_rows > 0) {

      $user_check = true;

      $mysql = "SELECT username FROM users WHERE username='$username' AND password = '$password'";
      $response_pass = $db->query($mysql);

      if ($response_pass->num_rows > 0) {

        $pass_check = true;
      }
    }

    if ($user_check == true && $pass_check == true) {

      $mysql = "SELECT user_id,user_type FROM users WHERE username='$username' AND password = '$password'";
      $response_type = $db->query($mysql);

      $type_row = $response_type->fetch_assoc();
      $_SESSION["username"] = $username;
      $_SESSION["user_id"] = $type_row["user_id"];

      if ($type_row["user_type"] == "rescuer") {
        $id = $type_row["user_id"];
        $mysql = "SELECT rescuer_vehicle_id,f_name,l_name FROM rescuer WHERE rescuer_id='$id'";
        $response_rescuer_info = $db->query($mysql);
        $name_row = $response_rescuer_info->fetch_assoc();
        $_SESSION["Name"] = $name_row["f_name"] . " " . $name_row["l_name"];
        $_SESSION["type"] = $type_row["user_type"];
        $_SESSION["truck_id"] = $name_row["rescuer_vehicle_id"];
        $response = ["status" => "success", "Location" => "/html/rescuer/rescuer_MapPage"];
        header("Content-Type: application/json");
        echo json_encode($response);
      } else if ($type_row["user_type"] == "admin") {

        header("Location: /html/admin/admin_mainPage.html");
      } else if ($type_row["user_type"] == "citizen") {

        $_SESSION["type"] = $type_row["user_type"];
        $response = ["status" => "success", "Location" => "/html/citizen/citizen_requests"];
        header("Content-Type: application/json");
        echo json_encode($response);
      }
    } else if ($user_check == false && $pass_check == false) {
      $response = ["status" => "fail", "message" => "User do not exist"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else if ($pass_check == false && $user_check == true) {
      $response = ["status" => "fail", "message" => "Password is wrong"];
      header("Content-Type: application/json");
      echo json_encode($response);
    }


    $db->close();
  }
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
