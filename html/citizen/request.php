<?php
session_start();

if (!isset($_SESSION["type"]) || $_SESSION["type"] != "citizen") {
  header("Location: /html/login.php");
  exit();
}
?>


<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Requests</title>
  <style>
    #tables {
      display: flex;
      border-collapse: collapse;
      width: 100%;
    }

    #tables table {
      margin-right: 20px;
      /* Adjust the margin as needed */
    }

    #autocomlete {
      position: relative;
      display: inline-block;
    }

    #search {
      padding: 8px;
      width: 200px;
    }

    #results {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      max-height: 150px;
      overflow-y: auto;
      border: 1px solid #ccc;
      border-top: none;
      list-style: none;
      padding: 0;
      margin: 0;
      background-color: white;
    }

    .results_item {
      padding: 8px;
      cursor: pointer;
    }

    .results_item:hover {
      background-color: #f0f0f0;
    }
  </style>
</head>

<body>
  <h1>Requests</h1>
  
  <div class="sidebar">
    <a href="#">Map</a>
    <a href="#">DataBase</a>
    <a href="/server/logout.php">Logout</a>
  </div>


  <div>
    <label for="categories">Κατηγορίες ειδών</label>
    <select id="categories"></select>
  </div>

  <div id="tables">
    <div>
      <div id="autocomlete">
        <input type="text" id="search" placeholder="Items search..." autocomplete="off">
        <ul id="results"></ul>
      </div>

      <table id="table_admin_request">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Details</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody id="itemsTable"></tbody>
      </table>
    </div>
    <div>
      Item Selected
      <table id="tableSelected">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Persons</th>
          </tr>
        </thead>
        <tbody id="itemSelected"></tbody>
      </table>
      <button id="submitRequest">Submit</button>
    </div>
  </div>


  <div>
    <table id="table">
      <thead>
        <tr>
          <th>Number</th>
          <th>We Need</th>
          <th>Date</th>
          <th>Persons</th>
        </tr>
      </thead>
      <tbody id="table_request"></tbody>
    </table>
  </div>



  <script src="/scripts/citizen_requests.js"></script>
</body>

</html>