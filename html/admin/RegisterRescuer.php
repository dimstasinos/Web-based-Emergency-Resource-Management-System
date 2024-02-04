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
  <title>Εγγραφή Διασώστη</title>
  <link rel="stylesheet" href="/css/register_rescuer.css">
  <link rel="icon" href="/images/favicon.png" type="image/x-icon">
</head>

<body>

  <div id="registerbox">
    <img src="/images/loginuser.png" alt="image" id="userImage">
    <h1>Εγγραφή Διασώστη</h1>
    <form id="registerForm">

      <div id="userInputs">
        <label for="fname">Όνομα</label>
        <input type="text" id="fname" class="input" placeholder="Εισαγωγή Ονόματος" maxlength="20" required>

        <label for="lname">Επώνυμο</label>
        <input type="text" id="lname" class="input" placeholder="Εισαγωγή Επώνυμου" maxlength="20" required>


        <label for="username">Username</label>
        <input type="text" id="username" class="input" placeholder="Δημιουργία Username" maxlength="20" autocomplete="username" required>


        <label for="password">Κωδικός</label>
        <input type="password" id="password" class="input" placeholder="Δημιουργία password" required>


        <label for="confpassword">Επαλήθευση Κωδικού</label>
        <input type="password" id="confpassword" class="input" placeholder="Επαναλάβετε το password" required>

        <label for="vehicleSelect">Επέλεξε ένα όχημα</label>
        <select id="vehicleSelect"></select>

        <div class="checkbox-container">
          <label for="newVehicle">Πρόσθεσαι τον σε νέο όχημα:</label>
          <input type="checkbox" id="newVehicle">
        </div>

        <label for="vehicleUsername">Username</label>
        <input type="text" id="vehicleUsername" class="input" placeholder="Δημιουργία username οχήματος" disabled>
      </div>
      <div>
        <button type="button" id="registerButton"><strong>Εγγραφή</strong></button>
      </div>
      <div id="goback">
        <p>
          <a href="/html/admin/HomePage"><strong>Πήγαινε Πίσω</strong></a>
        </p>
      </div>
    </form>
  </div>
</body>
<script src="/scripts/admin_register_rescuer.js"></script>

</html>