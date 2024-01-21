<?php
session_start();
include("../../Mysql_connection.php");
try {
  $json_data = file_get_contents("http://usidas.ceid.upatras.gr/web/2023/export.php");
  $json_data = json_decode($json_data);

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
    $items_stmt = $db->prepare("INSERT INTO items VALUES (?,?,?,0)");
    $items_stmt->bind_param("isi", $value->id, $value->name, $value->category);
    $items_stmt->execute();
    $items_stmt->close();
  }

  foreach ($json_data->items as $value) {
    foreach ($value->details as $value_details) {
      $details_stmt = $db->prepare("INSERT INTO item_details VALUES (?,?,?)");
      $details_stmt->bind_param("iss", $value->id, $value_details->detail_name, $value_details->detail_value);
      $details_stmt->execute();
    }
  }


  $db->close();
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
