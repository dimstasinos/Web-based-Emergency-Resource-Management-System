<?php

//PHP script που προσθέτει μια νέα 
//λεπτομέρια σε ένα είδος

session_start();

include("../../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την εισαγωγή της νέας λεπτομέριας
  $check = $db->prepare('SELECT * FROM item_details where item_detail_id=?');
  $check->bind_param("i", $data->id);
  $check->execute();
  $details_response = $check->get_result();

  //Διαγραφή λεπτομέριας εάν είναι άδεια
  if ($details_response->num_rows > 0) {
    while ($det_row = $details_response->fetch_assoc()) {
      if ($det_row["item_detail_name"] == "" && $det_row["item_detail_value"] == "") {
        $delete_stmt = $db->prepare("DELETE FROM item_details WHERE
          item_detail_id=? AND item_detail_name='' AND item_detail_value='' ");

        $delete_stmt->bind_param(
          "i",
          $data->id
        );
        $delete_stmt->execute();
        $delete_stmt->close();
        break;
      }
    }
  }

  //Εισαγωγή λεπτομέριας
  $add_stmt = $db->prepare("INSERT INTO item_details VALUES (?,?,?)");

  $add_stmt->bind_param(
    "iss",
    $data->id,
    $data->detail_name,
    $data->detail_value
  );
  $add_stmt->execute();

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
