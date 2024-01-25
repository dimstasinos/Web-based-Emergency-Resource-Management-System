<?php
session_start();

if (!isset($_SESSION["type"]) || $_SESSION["type"] != "admin") {
  header("Location: /html/login.php");
  exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Announcements</title>
  <link rel="stylesheet" href="/css/announcements.css">
  <link rel="stylesheet" href="/css/general.css">
  <link rel="icon" href="/images/favicon.png" type="image/x-icon">
</head>


<body>
  <div class="headerall">
    <div id="pic"><img src="/images/favicon.png" alt="Icon" class="title-icon">
    </div>
    <div class="topHeader">
      <div class="header">
        <h1 class="page-title">Διαχειριστής</h1>
      </div>
      <div class="topBar">
        <div><a href="/html/admin/HomePage">Αρχική</a></div>
        <div><a href="/server/logout">Αποσύνδεση</a></div>
      </div>
    </div>
  </div>

  <div id="main-container">

    <div id="title_table_announcements-container">
      <h1>Ανακοινώσεις</h1>
      <div id="tableAnnouncements-container">
        <table id="tableAnnouncements" class="table">
          <thead>
            <tr>
              <th>ID Ανακοίνωσης</th>
              <th>Όνομα Προϊόντος</th>
              <th>Ποσότητα</th>
              <th>Ακύρωση</th>
            </tr>
          </thead>
          <tbody id="announcements"></tbody>
        </table>
      </div>
    </div>

    <div class="autocomplete-category">
      <div class="label-select">
        <label for="categories">Κατηγορίες Προϊόντων</label>
        <select id="categories"></select>
      </div>
      <div class="autocomplete">
          <label for="search">Αναζήτηση Προϊόντων</label>
          <div id="input-list">
          <input type="text" id="search" placeholder="Αναζήτηση" autocomplete="off">
          <div id="list">
            <ul id="result_list"></ul>
          </div>
        </div>
      </div>
    </div>


    <div id="warehouse-selected_container">
      <div id="title_table_warehouse-container">
        <h1>Αποθήκη</h1>
        <div id="table_warehouse-container">
          <table id="table_warehouse" class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Όνομα</th>
                <th>Κατηγορια</th>
                <th>Λεπτομέρειες</th>
                <th>Ποσότητα</th>
              </tr>
            </thead>
            <tbody id="itemsTable"></tbody>
          </table>
        </div>
      </div>

      <div id="title_table_selected-container">
        <h1>Επιλεγμένα Προΐοντα</h1>
        <div id="table_selected-container">
          <table id="tableSelected" class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Όνομα</th>
                <th>Ποσότητα</th>
                <th>Διαγραφή</th>
              </tr>
            </thead>
            <tbody id="itemSelected"></tbody>
          </table>
        </div>
      </div>
    </div>
    <div id="button-container">
      <button id="submitAnnouncement">Καταχώρηση</button>
    </div>
  </div>
</body>
<script src="/scripts/announcement.js"></script>

</html>