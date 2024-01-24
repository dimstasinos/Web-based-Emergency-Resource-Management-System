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
  <link rel="stylesheet" href="/css/announcementsV2.css">
  <link rel="stylesheet" href="/css/general.css">
</head>


<body>
  <div class="headerall">
    <div id="pic"><img src="/images/favicon.png" alt="Icon" class="title-icon">
    </div>
    <div class="side_header">
      <div class="header">
        <h1 class="page-title">Διαχειριστής</h1>
      </div>
      <div class="sidebar">
        <div><a href="/html/admin/admin_mainPage.php">Αρχική</a></div>
        <div><a href="/server/logout.php">Αποσύνδεση</a></div>
      </div>
    </div>
  </div>

  <div id="main-container">
    
  <h1>Ανακοινώσεις</h1>
    <div id="tableAnnouncements-container">
      <table id="tableAnnouncements" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Όνομα Προϊόντος</th>
            <th>Ποσότητα</th>
            <th>Ακύρωση</th>
          </tr>
        </thead>
        <tbody id="announcements"></tbody>
      </table>
    </div>

    <div class="autocomlete-category">
      <div class="label-input">
        <label for="search">Αναζήτηση Προϊόντων</label>
        <input type="text" id="search" placeholder="Αναζήτηση προϊόντων..." autocomplete="off">
        <ul id="results"></ul>
      </div>
      <div class="label-select">
        <label for="categories">Κατηγορίες Προϊόντων</label>
        <select id="categories"></select>
      </div>
    </div>

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

    <h1>Επιλεγμένα Προΐοντα</h1>
    <div class="table-container">
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

    <button id="submitAnnouncement">Καταχώρηση</button>
  </div>
</body>
<script src="/scripts/announcement.js"></script>

</html>