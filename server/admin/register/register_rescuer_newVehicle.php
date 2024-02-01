<?php

//PHP script που εγγράφει έναν νέο διασώστη στην
//βάση δεδομένων σε ένα νέο όχημα

session_start();

include("../../Mysql_connection.php");

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Παραλαβεί στοιχείων του διασώστη για εγγραφή με μέθοδο POST
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first_name = $_POST['f_name'];
    $last_name = $_POST["l_name"];
    $username = $_POST["username"];
    $password = $_POST["password"];
    $truck_username = $_POST["truckUsername"];

    //Queries για έλεγχο στοιχείων και εγγραφή του διασώστη
    $userUsernameCheck = false;
    $truckUsernameCheck = false;

    $usernameCheckSql = $db->prepare("SELECT username from users where username=?");
    $usernameCheckSql->bind_param("s", $username);
    $usernameCheckSql->execute();
    $usernameCheckSql_response = $usernameCheckSql->get_result();

    if ($usernameCheckSql_response->num_rows > 0) {
      $usernameCheck = true;
    }

    $truckUsernameCheckSql = $db->prepare("SELECT vehicle_username from vehicle
    where vehicle_username=?");
    $truckUsernameCheckSql->bind_param("s", $truck_username);
    $truckUsernameCheckSql->execute();
    $truckUsernameCheck_response = $truckUsernameCheckSql->get_result();

    if ($truckUsernameCheck_response->num_rows > 0) {
      $truckUsernameCheck = true;
    }

    //Αποστολή μηνυμάτων στον client ανάλογα με το αποτέλεσμα του ελέγχου
    if ($truckUsernameCheck == false && $userUsernameCheck == true) {
      $response = ["status" => "fail", "message" => "Το username του διασώστη υπάρχει ήδη"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else if ($truckUsernameCheck == false && $userUsernameCheck == true) {
      $response = ["status" => "fail", "message" => "Το username του οχήματος υπάρχει ήδη"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else if ($truckUsernameCheck == true && $userUsernameCheck == true) {
      $response = ["status" => "fail", "message" => "Το username του οχήματος και του διασώστη υπάρχει ήδη"];
      header("Content-Type: application/json");
      echo json_encode($response);
    } else {


      //Queries για την εγγραφή του διασώστη
      $truck_insert = $db->prepare("INSERT INTO vehicle VALUES
      (NULL,?,37.9838,23.7278)");
      $truck_insert->bind_param(
        "s",
        $truck_username,
      );
      $truck_insert->execute();

      $truck_id = "SELECT LAST_INSERT_ID() as truck_id";
      $truck_id_responce =  $db->query($truck_id);
      $truck_id_row = $truck_id_responce->fetch_assoc();

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
        $truck_id_row["truck_id"],
      );
      $insert_rescuer->execute();

      $db->close();

      //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
      $response = ["status" => "success","message" => "Έγινε εγγραφή του διασώστη και του νέου οχήματος επιτυχώς"];
      header('Content-Type: application/json');
      echo json_encode($response);
    }
  }
} catch (Exception $error) {
  
  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo (['status' => 'fail', "message" => $error->getMessage()]);
}
