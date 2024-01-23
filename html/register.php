<?php
session_start();

if (isset($_SESSION['type'])) {
  if ($_SESSION['type'] == "rescuer") {
    header("Location: /html/rescuer/rescuer_MapPage");
    exit();
  } else if ($_SESSION['type'] == "citizen") {
    header("Location: /html/citizen/request");
    exit();
  } else if ($_SESSION['type'] == "admin") {
    header("Location: /html/citizen/admin_mainPage");
    exit();
  }

  exit();
}

?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width initial-scale=1">
  <link rel="stylesheet" href="/leaflet/leaflet.css">
  <link rel="stylesheet" href="/css/register.css">
  <link rel="icon" href="/images/favicon.png" type="image/x-icon">
  <title>Εγγραφή</title>
</head>

<body>

  <div id="registerbox">
  <img src="/images/loginuser.png" alt="image" id="userImage">
    <h1>Εγγραφή</h1>
    <form id="registerForm">
    
      <div id="userInputs">
        <label for="fname">Όνομα</label>
        <input type="text" id="fname" class="input" placeholder="Εισαγωγή Ονόματος" maxlength="12" required>

        <label for="lname">Επώνυμο</label>
        <input type="text" id="lname" class="input" placeholder="Εισαγωγή Επώνυμου" maxlength="20" required>

        <label for="phone">Αριθμός τηλεφώνου</label>
        <input type="tel" id="phone" class="input" placeholder="Εισαγωγή Κινητού Τηλεφώνου" maxlength="12" required>

        <label for="user">Username</label>
        <input type="text" id="user" class="input" placeholder="Δημιουργία Username" maxlength="12" required>

        <label for="pass">Κωδικός</label>
        <input type="password" id="pass" class="input" placeholder="Δημιουργία password" required>

        <label for="confpass">Επιβεβαίωση κωδικού</label>
        <input type="password" id="confpass" class="input" placeholder="Επαναλάβετε το password" required>

      </div>

      <div id="mapBox">
        <p>Επέλεξε τοποθεσία</p>
        <div id="map"></div>
      </div>

      <div id="login">
        <p>Έχεις ήδη λογαριασμό;
          <a href="/html/login.php"><br><strong>Σύνδεση</strong></a>
        </p>
      </div>
      <div>
        <button type="button" id="registerButton"><strong>ΕΓΓΡΑΦΗ</strong></button>
      </div>

    </form>
  </div>

  <script src="/leaflet/leaflet.js"></script>
</body>

<script src="/scripts/register.js"></script>

</html>