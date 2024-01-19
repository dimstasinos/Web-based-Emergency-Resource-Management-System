var citizenCoordination;

document.addEventListener('DOMContentLoaded', function () {

  var map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  var citizenMarker = L.marker([37.9838, 23.7275],
    { draggable: 'true' }).addTo(map);


  citizenCoordination = {
    latitude: citizenMarker.lat,
    longitude: citizenMarker.lng

  };

  citizenMarker.on('dragend', function (event) {
    var coords = event.target.getLatLng();
    citizenCoordination.latitude = coords.lat;
    citizenCoordination.longitude = coords.lng;
  });

});

document.getElementById("registerButton").addEventListener("click", function () {

  var check = 0;

  var f_name = document.getElementById("fname").value;
  var l_name = document.getElementById("lname").value;
  var phone_number = document.getElementById("phone").value;
  var username = document.getElementById("user").value;
  var password = document.getElementById("pass").value;
  var conf_password = document.getElementById("confpass").value;

  check = nameCheck(f_name);
  check = lastNameCheck(l_name);
  check = phoneNumberCheck(phone_number);

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


    var formData = new FormData();
    formData.append("f_name", f_name);
    formData.append("l_name", l_name);
    formData.append("phone_number", phone_number);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("latitude", citizenCoordination.latitude);
    formData.append("longitude", citizenCoordination.longitude);


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

function stringCheck(input) {
  return /\d/.test(input);
}

function phoneCheck(input) {
  return /^[A-Za-z]+$/.test(input);
}

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

function phoneNumber(str) {
  let letterCount = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i].toLowerCase() != str[i].toUpperCase()) {
      letterCount++;
    }
  }
  return letterCount;
}