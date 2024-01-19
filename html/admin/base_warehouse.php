<?php
session_start();

if (!isset($_SESSION["type"]) || $_SESSION["type"] != "admin") {
  header("Location: /html/login.php");
  exit();
}
?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width initial-scale=1">
  <link rel="stylesheet" href="/css/admin_database.css">
  <title>Storage</title>
</head>

<body>
  <h1>Storage</h1>
  <p>Administrator</p>

  <label for="online_data">Base update from the common repository</label>
  <button id="online_data">Update</button>

  <form id="json_upload" enctype="multipart/form-data">
    <label for="json_file">JSON file</label>
    <input type="file" id="json_file" name="json_file" accept=".json" />
    <button type="button" id="submit_button" onclick="upload_data()">Upload</button>
  </form>

  <div>
    <label for="cat_list">Categories of species</label>
    <select id="cat_list"></select>
  </div>

  <div>
    <table id="table_admin">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Details</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody id="items_table"></tbody>
    </table>
  </div>

  <div>
    <form id="products">
      <fieldset>
        <legend>Product:</legend>
        <div id="product_select">
          <p>The selected product::</p>
          <label for="id_selected">ID</label>
          <input type="text" id="id_selected" disabled>
          <label for="name_selected">Name</label>
          <input type="text" id="name_selected">
          <div>
            <label for="cat_selected">Category</label>
            <select id="cat_selected"></select>
            <button type="button" id="cat_change_button">Category change</button>
          </div>
          <div>
            <label for="quantity_selected">Quantity:</label>
            <input type="number" id="quantity_selected" value="0" min="0">
            <button type="button" id="quantity_button">Quantity change</button>
          </div>
        </div>

        <div>
          <p>Add product:</p>
          <label for="name_new">Name</label>
          <input type="text" id="name_new">
          <label for="cat_new">Category</label>
          <select id="cat_new"></select>
          <button type="button" id="add_product">Add</button>
        </div>


        <div>Product details:</div>
        <div id="detail_select"></div>
        <div id="details">
          <div>
            <label for="detail_name_text">Name</label>
            <input type="text" id="detail_name_text">
            <label for="detail_value_text">Value</label>
            <input type="text" id="detail_value_text">
          </div>
          <div>
            <button type="button" id="clear">Clear</button>
            <button type="button" id="change">Change</button>
            <button type="button" id="add">Add</button>
            <button type="button" id="delete">Delete</button>
          </div>
        </div>
      </fieldset>
    </form>
  </div>

  <div id="category_options">
    <fieldset>
      <legend>Category</legend>
      <div>
        <label for="category">Category</label>
        <select id="category"></select>
      </div>
      <div>
        <label for="id_cat">ID</label>
        <input type="text" id="id_cat" disabled>
        <label for="cat_name">Name</label>
        <input type="text" id="cat_name">
      </div>
      <div>
        <button type="button" id="cat_name_change">Τροποποίηση</button>
        <button type="button" id="cat_name_delete">Διαγραφή</button>
      </div>
      <div id="new_cat">
        <p>Insert new category:</p>
        <label for="new_cat_name">Name</label>
        <input type="text" id="new_cat_name">
      </div>
      <div>
        <button type="button" id="add_new_cat">Add</button>
      </div>
    </fieldset>
  </div>


  <script src="/scripts/admin_warehouse.js"></script>
</body>

</html>