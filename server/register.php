<?php

//PHP script που διαχειρίζεται την εγγραφή
//του πολίτη 

session_start();

include("Mysql_connection.php");

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Έλεγχος τρόπου απόστολής στοιχείων χρήστη
  if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $first_name = $_POST['f_name'];
    $last_name = $_POST["l_name"];
    $phone_number = $_POST["phone_number"];
    $username = $_POST["username"];
    $password = $_POST["password"];
    $latitude = $_POST["latitude"];
    $longitude = $_POST["longitude"];

    //Queries για τον έλεγχο των στοιχείων και εγγραφή
    $phoneCheck = false;
    $usernameCheck = false;

    //Έλεγχοι στοιχείων
    $usernameCheckSql = $db->prepare("SELECT username from users where username=?");
    $usernameCheckSql->bind_param("s", $username);
    $usernameCheckSql->execute();
    $usernameCheckSql_response = $usernameCheckSql->get_result();

    if ($usernameCheckSql_response->num_rows > 0) {
      $usernameCheck = true;
    }

    $phoneCheckSql = $db->prepare("SELECT phone_number from citizen where phone_number=?");
    $phoneCheckSql->bind_param("s", $phone_number);
    $phoneCheckSql->execute();
    $phoneCheckSql_response = $phoneCheckSql->get_result();

    if ($phoneCheckSql_response->num_rows > 0) {
      $phoneCheck = true;
    }

    //Αποστολή μηνυμάτων εάν αποτύχουν οι έλεγχει
    if ($usernameCheck == true && $phoneCheck == false) {
      $response = ["status" => "fail", "message" => "Το username υπάρχει ήδη"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else if ($usernameCheck == false && $phoneCheck == true) {
      $response = ["status" => "fail", "message" => "Ο αριθμός τηλεφώνου υπάρχει ήδη"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else if ($usernameCheck == true && $phoneCheck == true) {
      $response = ["status" => "fail", "message" => "Ο αριθμός τηλεφώνου και το username υπάρχουν ήδη"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else if ($usernameCheck == false && $phoneCheck == false) {

      //Εγγραφή του πολίτη
      $insert_user = $db->prepare("INSERT INTO users VALUES
      (NULL,?,?,'citizen')");
      $insert_user->bind_param("ss", $username, $password);
      $insert_user->execute();

      $user_id = "SELECT LAST_INSERT_ID() as user_id";
      $user_id_responce =  $db->query($user_id);
      $user_id_row = $user_id_responce->fetch_assoc();

      $insert_citizen = $db->prepare("INSERT INTO citizen VALUES
      (?,?,?,?,?,?)");
      $insert_citizen->bind_param(
        "isssdd",
        $user_id_row["user_id"],
        $first_name,
        $last_name,
        $phone_number,
        $latitude,
        $longitude,
      );
      $insert_citizen->execute();

      $_SESSION["type"] = "citizen";
      $_SESSION["username"] = $username;
      $_SESSION["user_id"] = $user_id_row["user_id"];
      $_SESSION["Name"] = $first_name . " " . $last_name;
      $response = ["status" => "success", "Location" => "/html/citizen/citizen_requests"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else {
      $response = ["status" => "fail", "message" => "Error"];
      header("Content-Type: application/json");
      echo json_encode($response);
    }
  }
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo (['status' => 'fail', "message" => $error->getMessage()]);
}
