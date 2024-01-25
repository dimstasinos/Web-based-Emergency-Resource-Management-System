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
      <label for="online_data">Aνανέωση Βάσης απο την Αποθήκη</label>
      <button id="online_data">Ανανέση</button>

      <form id="json_upload" enctype="multipart/form-data">
        <label for="json_file">JSON file</label>
        <input type="file" id="json_file" name="json_file" accept=".json" />
        <button type="button" id="submit_button" onclick="upload_data()">Καταχώρηση</button>
      </form>

      <div>
        <label for="cat_list">Κατηγορίες Ειδών</label>
        <select id="cat_list"></select>
      </div>

      <div class=table_adm>
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

      <div id="container_2">
        <hr class="separator-line">
        <hr class="separator-line">
        <div class="main">

          <h2>Προϊον:</h2>
          <div id="product_select">
            <p>Επιλεγμένο Προϊόν:</p>
            <label for="id_selected">ID</label>
            <input type="text" id="id_selected" disabled>
            <label for="name_selected">Όνομα</label>
            <input type="text" id="name_selected">

            <label for="cat_selected">Κατηγορία</label>
            <select id="cat_selected"></select>
            <label for="quantity_selected">Ποσότητα:</label>
            <input type="number" id="quantity_selected" value="0" min="0">
          </div>
          <div>
            <button type="button" id="cat_change_button">Αλλαγή Κατηγορίας</button>
            <button type="button" id="quantity_button">Αλλαγή Ποσότητας</button>
          </div>
        </div>


        <div id="product_add">
          <p>Πρόσθεσε Προϊόν:</p>
          <label for="name_new">Όνομα</label>
          <input type="text" id="name_new">
          <label for="cat_new">Κατηγορία</label>
          <select id="cat_new"></select>
        </div>
        <div>
          <button type="button" id="add_product">Προσθήκη</button>
        </div>

        <div id="product_info">
          <p>Λεπτομέρειες Προϊόντος:</p>
          <div id="detail_select"></div>
          <div id="details">
            <div>
              <label for="detail_name_text">Όνομα</label>
              <input type="text" id="detail_name_text">
              <label for="detail_value_text">Τιμή</label>
              <input type="text" id="detail_value_text">
            </div>
            <div>
              <button type="button" id="clear">Καθαρισμός</button>
              <button type="button" id="change">Αλλαγή</button>
              <button type="button" id="add">Προσθήκη</button>
              <button type="button" id="delete">Διαγραφή</button>
            </div>
          </div>
        </div>
      </div>
      <div id="container_3">
        <hr class="separator-line">
        <hr class="separator-line">
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