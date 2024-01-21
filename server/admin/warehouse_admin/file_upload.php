<?php
header('Content-Type: application/json');

include("../../Mysql_connection.php");

if (isset($_FILES['jsonfile'])) {
  $json_file = $_FILES['jsonfile'];
  $file_name = $_FILES['jsonfile']['name'];
  $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);

  if ($file_extension === 'json') {
    $file_content = file_get_contents($_FILES['jsonfile']['tmp_name']);
    $json_data = json_decode($file_content);

    if ($json_data !== null) {

      $db = db_connect();

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
        $categories_stmt = $db->prepare("INSERT INTO items VALUES (?,?,?)");
        $categories_stmt->bind_param("isi", $value->id, $value->name, $value->category);
        $categories_stmt->execute();
      }

      foreach ($json_data->items as $value) {
        foreach ($value->details as $value_details) {
          $categories_stmt = $db->prepare("INSERT INTO item_details VALUES (?,?,?)");
          $categories_stmt->bind_param("iss", $value->id, $value_details->detail_name, $value_details->detail_value);
          $categories_stmt->execute();
        }
      }


      $db->close();

      echo json_encode(['status' => 'success', 'data' => $json_data]);
    } else {

      echo json_encode(['status' => 'error', 'message' => 'To αρχείο δεν έχει μορφή JSON']);
    }
  } else {

    echo json_encode(['status' => 'error', 'message' => ' Το αρχείο δεν έχει extention \'.json\'']);
  }
}
