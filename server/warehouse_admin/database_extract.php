<?php

include("../Mysql_connection.php");
try {
$db = db_connect();

$mysql = "SELECT * from items";
$response = $db->query($mysql);

$items = array();

if ($response->num_rows > 0) {

  while ($row = $response->fetch_assoc()) {
    $item_array = array(
      "id" => $row["item_id"],
      "name" => $row["item_name"],
      "category" => $row["item_category"]
    );

    $quantity = array();
    $mysql = $db->prepare("SELECT item_qua from item_quantity where item_qua_id=?");
    $mysql->bind_param("i", $row["item_id"]);
    $mysql->execute();
    $quantity_response = $mysql->get_result();

    if ($quantity_response->num_rows > 0) {
      $quantity_row = $quantity_response->fetch_assoc();
      $quantity = (string)$quantity_row["item_qua"];

    } else {
      $quantity = "0";
    }

    $item_array["quantity"] = $quantity;

    $details = array();
    $mysql = $db->prepare("SELECT * FROM item_details where item_detail_id=?");
    $mysql->bind_param("i", $row["item_id"]);
    $mysql->execute();
    $details_response = $mysql->get_result();

    if ($details_response->num_rows > 0) {
      while ($det_row = $details_response->fetch_assoc()) {
        $detail_array = array(
          "detail_name" => $det_row["item_detail_name"],
          "detail_value" => $det_row["item_detail_value"]
        );
        $details[] = $detail_array;
      }
    }

    $item_array["details"] = $details;

    $items[] = $item_array;
  }
}


$mysql = "SELECT * from item_category";
$response = $db->query($mysql);

$categories = array();

if ($response->num_rows > 0) {
  while ($row = $response->fetch_assoc()) {
    $category = array(
      "id" => $row['category_id'],
      "category_name" => $row['category_name']
    );
    $categories[] = $category;
  }

  $data = array(
    "items" => $items,
    "categories" => $categories,
  );

}

$db->close();
$json_data = json_encode($data);
header('Content-Type: application/json');

echo $json_data;

} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error: " . $error->getMessage()]);
}