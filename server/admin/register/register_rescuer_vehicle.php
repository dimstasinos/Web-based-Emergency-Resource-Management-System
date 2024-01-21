<?php

session_start();

include("../../Mysql_connection.php");

try {

  $db = db_connect();

  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first_name = $_POST['f_name'];
    $last_name = $_POST["l_name"];
    $username = $_POST["username"];
    $password = $_POST["password"];
    $truck_id = $_POST["truck_id"];

    $usernameCheck = false;

    $usernameCheckSql = $db->prepare("SELECT username from users where username=?");
    $usernameCheckSql->bind_param("s", $username);
    $usernameCheckSql->execute();
    $usernameCheckSql_response = $usernameCheckSql->get_result();

    if ($usernameCheckSql_response->num_rows > 0) {
      $usernameCheck = true;
    }

    if ($usernameCheck == true) {

      $response = ["status" => "fail", "message" => "Το username υπάρχει ήδη"];
      header("Content-Type: application/json");
      echo json_encode($response);

    } else if ($usernameCheck == false) {
      
      $insert_user = $db->prepare("INSERT INTO users VALUES
      (NULL,?,?,'rescuer')");
      $insert_user->bind_param("ss", $username, $password);
      $insert_user->execute();

      $user_id = "SELECT LAST_INSERT_ID() as user_id";
      $user_id_responce =  $db->query($user_id);
      $user_id_row = $user_id_responce->fetch_assoc();

      $insert_rescuer = $db->prepare("INSERT INTO rescuer VALUES
      (?,?,?,?)");
      $insert_rescuer->bind_param(
        "issi",
        $user_id_row["user_id"],
        $first_name,
        $last_name,
        $truck_id,
      );
      $insert_rescuer->execute();

      $db->close();
      $response = ["status" => "success","message" => "Έγινε εγγραφή του διασώστη επιτυχώς"];
      header('Content-Type: application/json');
      echo json_encode($response);
    }
  }
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo (['status' => 'fail', "message" => $error->getMessage()]);
}
