<?php

//PHP script που εισάγει μια ανακοίνωση
//στην βάση δεδομένων

session_start();

include("../../Mysql_connection.php");

try {
  
  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την εισαγωγή της ανακοίνωσης
  $announcement = "INSERT INTO announcements 
  values (NULL)";
  $db->query($announcement);

  $announcement_id = "SELECT LAST_INSERT_ID() as announcement_id";
  $announcement_id_responce =  $db->query($announcement_id);
  $announcement_id_row = $announcement_id_responce->fetch_assoc();

  $data["id"] = $announcement_id_row["announcement_id"];

  //Κλέισιμο σύνδεσης με την βάση δεδομένων
  $db->close();

  //Αποστολή στον client του id της ανακοίνωσης
  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
