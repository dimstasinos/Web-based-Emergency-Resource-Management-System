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
  <link rel="stylesheet" href="/css/general.css">
  <title>Storage</title>
</head>

<body>
  <div class="headerall">
    <div id="pic"><img src="/images/favicon.png" alt="Icon" class="title-icon">
    </div>
    <div class="topHeader">
      <div class="header">
        <h1 class="page-title">Αποθήκη</h1>
      </div>
      <div class="topBar">
        <div class="topButton"><a href="/html/admin/HomePage.php">Aρχική</a></div>
        <div class="topButton"><a href="/server/logout.php">Αποσύνδεση</a></div>
      </div>
    </div>
  </div>


  <div id="main-container">

    <div id="data_insert-container">
      <div id="online_data-container">
        <label for="online_data">Aνανέωση Βάσης απο την Αποθήκη</label>
        <button id="online_data">Ανανέση</button>
      </div>
      <div id="json_upload-container">
        <form id="json_upload" enctype="multipart/form-data">
          <label for="json_file">JSON file</label>
          <input type="file" id="json_file" name="json_file" accept=".json" />
          <button type="button" id="submit_button" onclick="upload_data()">Mεταφόρτωση</button>
        </form>
      </div>
    </div>


    <div id="title_select_warehouse-container">
      <h1>Αποθήκη</h1>
      <div id="category_select-container">
        <label for="cat_list">Επιλογή κατηγορίας</label>
        <select id="cat_list"></select>
      </div>
      <div id=table_warehouse>
        <table id="table_admin">
          <thead>
            <tr>
              <th>ID</th>
              <th>Όνομα</th>
              <th>Κατηγορία</th>
              <th>Λεπτομέρειες</th>
              <th>Ποσότητα</th>
            </tr>
          </thead>
          <tbody id="items_table"></tbody>
        </table>
      </div>
    </div>


    <hr class="separator-line">
    <hr class="separator-line">


    <div id="product_selected-container">
      <h2>Επιλεγμένο Είδος</h2>


      <h4>Πληροφορίες είδους</h4>
      <div id="product_select-container">
        <div>
          <label for="id_selected">ID</label>
          <input type="text" id="id_selected" disabled>
        </div>
        <div>
          <label for="name_selected">Όνομα</label>
          <input type="text" id="name_selected">
        </div>
        <div>
          <label for="cat_selected">Κατηγορία</label>
          <select id="cat_selected"></select>
        </div>
        <div>
          <label for="quantity_selected">Ποσότητα:</label>
          <input type="number" id="quantity_selected" value="0" min="0">
        </div>
      </div>

      <div id="category_quantity_button-container">
        <button type="button" id="cat_change_button">Αλλαγή Κατηγορίας</button>
        <button type="button" id="quantity_button">Αλλαγή Ποσότητας</button>
      </div>

      <h4>Προσθήκη είδους</h4>
      <div id="add_product-container">
        <div>
          <label for="name_new">Όνομα</label>
          <input type="text" id="name_new">
        </div>
        <div id="new_category_button-container">
          <label for="cat_new">Κατηγορία</label>
          <select id="cat_new"></select>
        </div>
        <div id="add_product_button-container">
          <button type="button" id="add_product">Προσθήκη</button>
        </div>
      </div>


      <h4>Λεπτομέρειες Είδους</h4>
      <div id="product_info-container">

        <div id="detail_select"></div>

        <div id="detail_select-container">

          <div id="product_input">
            <div>
              <label for="detail_name_text">Όνομα</label>
              <input type="text" id="detail_name_text">
            </div>
            <div>
              <label for="detail_value_text">Τιμή</label>
              <input type="text" id="detail_value_text">
            </div>
          </div>
          
          <div id="details_buttons-container">
            <button type="button" id="clear">Καθαρισμός</button>
            <button type="button" id="change">Αλλαγή</button>
            <button type="button" id="add">Προσθήκη</button>
            <button type="button" id="delete">Διαγραφή</button>
          </div>
        </div>

      </div>

    </div>

    <hr class="separator-line">
    <hr class="separator-line">

    <div id="container_3">

      <div class="main">
        <p>Κατηγορία:</p>
        <div>
          <label for="category">Κατηγορία</label>
          <select id="category"></select>
          <label for="id_cat">ID</label>
          <input type="text" id="id_cat" disabled>
          <label for="cat_name">Όνομα</label>
          <input type="text" id="cat_name">
        </div>
        <div>
          <button type="button" id="cat_name_change">Τροποποίηση</button>
          <button type="button" id="cat_name_delete">Διαγραφή</button>
        </div>
        <div id="new_cat">
          <p>Προσθήκη Νέας Κατηγορίας:</p>
          <label for="new_cat_name">Όνομα</label>
          <input type="text" id="new_cat_name">
        </div>
        <div id="add_new">
          <button type="button" id="add_new_cat">Προσθήκη</button>
        </div>
      </div>
    </div>
  </div>




  <script src="/scripts/admin_warehouse.js"></script>
</body>

</html>