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
  <link rel="stylesheet" href="/css/announcement_table.css">
   
</head>

<body>
<div class="sidebar">
      <a href="/html/admin/admin_mainPage.php">Aρχική</a>
      <a href="/server/logout.php">Αποσύνδεση</a>
    </div>
  <h1>ΑΝΑΚΟΙΝΩΣΕΙΣ</h1>


  <div>
    <h2>Ανακοινώσεις</h2>
    <table id="tableAnnouncements">
      <thead>
        <tr>
          <th>ID</th>
          <th>Όνομα Προϊόντος</th>
          <th>Ποσότητα</th>
        </tr>
      </thead>
      <tbody id="announcements"></tbody>
    </table>
  </div>


  <div id="autocomlete">
    <input type="text" id="search" placeholder="Αναζήτηση προϊόντων..." autocomplete="off">
    <ul id="results"></ul>
  </div>
  <div>
    <h5>Κατηγορίες Προϊόντων</h5>
    <label for="categories"></label>
    <select id="categories"></select>
  </div>
  <div id="tables">
    <div>
      <h3>Aποθήκη</h3>
      <table id="table_warehouse">
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
    <div>
     <h4>Επιλεγμένα Προΐοντα</h4>
      <table id="tableSelected">
        <thead>
          <tr>
            <th>ID</th>
            <th>Όνομα</th>
            <th>Ποσότητα</th>
          </tr>
        </thead>
        <tbody id="itemSelected"></tbody>
      </table>
      <button id="submitAnnouncement">Καταχώρηση</button>
    </div>
  </div>

  <script src="/scripts/announcement.js"></script>
</body>

</html>