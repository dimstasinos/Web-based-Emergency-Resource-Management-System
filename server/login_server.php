<?php

//PHP script που διαχειρίζεται την σύνδεση
//του χρήστη 

session_start();

include("Mysql_connection.php");


try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Έλεγχος τρόπου απόστολής στοιχείων χρήστη
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    //Queries για τον έλεγχο των στοιχείων και σύνδεση
    $user_check = false;
    $pass_check = false;


    //Έλεγχοι στοιχείων
    $usernameCheck = $db->prepare("SELECT * FROM users WHERE username = ?");
    $usernameCheck->bind_param('s', $username);
    $usernameCheck->execute();
    $usernameCheck_response = $usernameCheck->get_result();

    if ($usernameCheck_response->num_rows > 0) {

      $user_check = true;

      $passwordCheck = $db->prepare("SELECT username FROM users WHERE username= ? AND password = ?");
      $passwordCheck->bind_param("ss", $username, $password);
      $passwordCheck->execute();
      $passwordCheck_response = $passwordCheck->get_result();

      if ($passwordCheck_response->num_rows > 0) {

        $pass_check = true;
      }
    }

    //Σύνδεση χρήστη ανάλογα με την ιδιότητά του και τοποθέτηση
    //πληροφοριών του session
    if ($user_check == true && $pass_check == true) {

      $userSearch = $db->prepare("SELECT user_id,user_type FROM users WHERE username=? AND password =?");
      $userSearch->bind_param("ss", $username, $password);
      $userSearch->execute();
      $userSearch_response = $userSearch->get_result();
      $type_row = $userSearch_response->fetch_assoc();
      $_SESSION["username"] = $username;
      $_SESSION["user_id"] = $type_row["user_id"];

      if ($type_row["user_type"] == "rescuer") {
        $id = $type_row["user_id"];
        $resquerSql = $db->prepare("SELECT rescuer_vehicle_id,f_name,l_name FROM rescuer WHERE rescuer_id=?");
        $resquerSql->bind_param("i", $id);
        $resquerSql->execute();
        $response_rescuer_info = $resquerSql->get_result();
        $name_row = $response_rescuer_info->fetch_assoc();
        $_SESSION["Name"] = $name_row["f_name"] . " " . $name_row["l_name"];
        $_SESSION["type"] = $type_row["user_type"];
        $_SESSION["truck_id"] = $name_row["rescuer_vehicle_id"];
        $response = ["status" => "success", "Location" => "/html/rescuer/HomePage"];
        header("Content-Type: application/json");
        echo json_encode($response);
      } else if ($type_row["user_type"] == "admin") {
        $id = $type_row["user_id"];
        $_SESSION["type"] = $type_row["user_type"];
        $response = ["status" => "success", "Location" => "/html/admin/HomePage"];
        header("Content-Type: application/json");
        echo json_encode($response);
      } else if ($type_row["user_type"] == "citizen") {
        $id = $type_row["user_id"];
        $citizenSql = $db->prepare("SELECT f_name,l_name FROM citizen WHERE citizen_id=?");
        $citizenSql->bind_param("i", $id);
        $citizenSql->execute();
        $response_citizen_info = $citizenSql->get_result();
        $name_row = $response_citizen_info->fetch_assoc();
        $_SESSION["Name"] = $name_row["f_name"] . " " . $name_row["l_name"];

        $_SESSION["type"] = $type_row["user_type"];
        $response = ["status" => "success", "Location" => "/html/citizen/Requests"];
        header("Content-Type: application/json");
        echo json_encode($response);
      }

      //Αποστολή μηνυμάτων εάν αποτύχουν οι έλεγχει
    } else if ($user_check == false && $pass_check == false) {
      $response = ["status" => "fail", "message" => "Ο χρήστης δεν υπάρχει"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else if ($pass_check == false && $user_check == true) {
      $response = ["status" => "fail", "message" => "Ο κωδικός είναι λάθος"];
      header("Content-Type: application/json");
      echo json_encode($response);
    }

    $db->close();
  }
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
