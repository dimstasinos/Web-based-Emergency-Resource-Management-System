<?php

//PHP script το οποίο λαμβάνει ένα αρχείο JSON
//με πληροφορίες για τα είδη και τις κατηγορίες
//από τον client και τοποθετεί τα δεδομένα του
//στην βάση δεδομένων

session_start();

header('Content-Type: application/json');

include("../../Mysql_connection.php");


try {

  //Παραλαβή του φακέλου
  if (isset($_FILES['jsonfile'])) {
    $json_file = $_FILES['jsonfile'];
    $file_name = $_FILES['jsonfile']['name'];
    $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);

    //Έλεγχος του αρχείου
    if ($file_extension === 'json') {
      $file_content = file_get_contents($_FILES['jsonfile']['tmp_name']);
      $json_data = json_decode($file_content);

      if ($json_data !== null) {

        //Σύνδεση με την βάση δεδομένων
        $db = db_connect();

        //Queries για την εισαγωγή των δεδομένω του αρχείου
        $delete_items = "DELETE FROM items;";
        $delete_categories = "DELETE FROM item_category";

        $db->query($delete_items);
        $db->query($delete_categories);

        foreach ($json_data->categories as $value) {
          $cat_name = trim($value->category_name);

          $categories_stmt = $db->prepare("INSERT INTO item_category VALUES (?,?)");
          $categories_stmt->bind_param("is", $value->id, $cat_name);
          $categories_stmt->execute();
        }

        foreach ($json_data->items as $value) {
          $categories_stmt = $db->prepare("INSERT INTO items VALUES (?,?,?,?)");
          $quantity = mt_rand(0, 15);
          $categories_stmt->bind_param("isii", $value->id, $value->name, $value->category,$quantity);
          $categories_stmt->execute();
        }

        foreach ($json_data->items as $value) {
          foreach ($value->details as $value_details) {
            $categories_stmt = $db->prepare("INSERT INTO item_details VALUES (?,?,?)");
            $categories_stmt->bind_param("iss", $value->id, $value_details->detail_name, $value_details->detail_value);
            $categories_stmt->execute();
          }
        }

        foreach ($json_data->items as $value) {
          $value->quantity = 0;
        }

        //Αποστολή των δεδομένων στον client
        $db->close();
        echo json_encode(['status' => 'success', 'data' => $json_data]);

        //Αποστολή μυνημάτων στον client ανάλογα με το αποτέλεσμα των ελέγχων
      } else {
        echo json_encode(['status' => 'error', 'message' => 'To αρχείο δεν έχει μορφή JSON']);
      }
    } else {
      echo json_encode(['status' => 'error', 'message' => ' Το αρχείο δεν έχει extention \'.json\'']);
    }
  }
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
