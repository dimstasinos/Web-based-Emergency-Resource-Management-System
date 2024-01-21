//Globall μεταβλητές
var citizenCoordination;

//Event listener που εκτελείτε όταν φορτωθεί η HTML
document.addEventListener('DOMContentLoaded', function () {


  //Αρχικοποιηση του χάρτη
  var map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  //Τοποθέτηση default marker
  var citizenMarker = L.marker([37.9838, 23.7275],
    { draggable: 'true' }).addTo(map);

  //Ανάκτηση αρχικής θέσης του marker
  citizenCoordination = {
    latitude: citizenMarker.lat,
    longitude: citizenMarker.lng

  };

  //Event listener που παίρνει την θέση του marker 
  //όταν αυτός σταματήσει να σύρεται
  citizenMarker.on('dragend', function (event) {
    var coords = event.target.getLatLng();
    citizenCoordination.latitude = coords.lat;
    citizenCoordination.longitude = coords.lng;
  });

});

//Event listener για την εγγραφή του χρήστη στην βάση δεδομένων
document.getElementById("registerButton").addEventListener("click", function () {

  var check = 0;

  //Ανάκτηση στοιχείων χρήστη
  var f_name = document.getElementById("fname").value;
  var l_name = document.getElementById("lname").value;
  var phone_number = document.getElementById("phone").value;
  var username = document.getElementById("user").value;
  var password = document.getElementById("pass").value;
  var conf_password = document.getElementById("confpass").value;

  //Έλεγχος στοιχείων
  check = nameCheck(f_name);
  check = lastNameCheck(l_name);
  check = phoneNumberCheck(phone_number);

  //Ειδοποιήσεις ανάλογα με τα λαθνθασμένα στοιχεία
  //που έδωσε ο χρήστης
  if (username === "") {
    alert("Δώσε ένα username");
    check = 1;
  }

  if (password === "") {
    alert("Δώσε ένα κωδικό");
    check = 1;
  }

  if (conf_password !== password) {
    alert("Οι δύο κωδικοί δεν είναι ίδιοι");
    check = 1;
  }

  if (check === 0) {

    //Συλλογή των στοιχείων
    var formData = new FormData();
    formData.append("f_name", f_name);
    formData.append("l_name", l_name);
    formData.append("phone_number", phone_number);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("latitude", citizenCoordination.latitude);
    formData.append("longitude", citizenCoordination.longitude);

    //Αποστολή δεδομένων στον server
    fetch('/server/register.php', {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then((data) => {
        if (data.status === "fail") {
          alert(data.message);
        } else if (data.status === "success") {
          window.location.replace(data.Location);
        }
      })
      .catch((error) => console.error("Error:", error));
  }

});

//Συνάρτηση ελέγχου συμβολοσειράς
function stringCheck(input) {
  return /\d/.test(input);
}

//Συνάρτηση ελέγχου αριθμού
//τηλεφώνου
function phoneCheck(input) {
  return /^[A-Za-z]+$/.test(input);
}

//Συνάρτηση ελεγχου του ονόματος
//χρήστη
function nameCheck(input) {
  if (input === "") {
    alert("Δώστε ένα όνομα");
    return 1;
  } else if (stringCheck(input)) {
    alert("Το όνομα δεν γίνεται να περιέχει αριθμούς");
    return 1;
  }
  return 0;
}

//Συνάρτηση ελεγχου του επώνυμου
//χρήστη
function lastNameCheck(input) {
  if (input === "") {
    alert("Δώσε ένα Επώνυμο");
    return 1;
  } else if (stringCheck(input)) {
    alert("Το επώνυμο δεν γινεται να περιέχει αριθμούς");
    return 1;
  }
  return 0;
}

//Συνάρτηση ελέγχου αριθμού τηλεφώνου
function phoneNumberCheck(input) {
  if (input === "") {
    alert("Δώσε έναν αριθμό τηλεφώνου");
    return 1;
  } else if (phoneCheck(input)) {
    alert("Ο αριθμός τηλεφώνου δεν γίνεται να περιέχει γράμματα");
    return 1;
  } else {
    var numberCount = 0;
    for (var i = 0; i < input.length; i++) {
      numberCount++;
    }
    if (numberCount !== 10) {
      alert("Ο αριθμός τηλεφώνου πρέπει να περιέχει 10 αριθμούς");
      return 1;
    }
  }
  return 0;
}

//Συνάρτηση ελέγχου μεγέθους αριθμού
//τηλεφώνου
function phoneNumber(str) {
  let letterCount = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i].toLowerCase() != str[i].toUpperCase()) {
      letterCount++;
    }
  }
  return letterCount;
}