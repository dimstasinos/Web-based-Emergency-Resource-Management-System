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

  var f_name = document.getElementById("fname");
  var l_name = document.getElementById("lname");
  var phone_number = document.getElementById("phone");
  var username = document.getElementById("user");
  var password = document.getElementById("pass");
  var conf_password = document.getElementById("confpass");

  var check = 0;

  check = nameCheck(f_name.value);
  check = lastNameCheck(l_name.value);
  check = phoneNumberCheck(phone_number.value);

  if (username.value === "") {
    alert("Δώσε ένα username");
    check = 1;
  }

  if (password.value === "") {
    alert("Δώσε ένα κωδικό");
    check = 1;
  }

  if (conf_password.value !== password.value) {
    alert("Οι δύο κωδικοί δεν είναι ίδιοι");
    check = 1;
  }

  if (check === 0) {

    const data = {
      f_name: f_name.value,
      l_name: l_name.value,
      phone_nummber: phone_number.value,
      username: username.value,
      password: password.value,
      location: citizenCoordination
    };

    console.log(data);

/*
    fetch('/server/registerpage/register_page.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then((data) => {
        if (data.status === "error") {
          console.error("Server Error:", data.Error);
        }
      })*/
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
    alert("Το όνομα δεν γίνεται να περιέχει γράμματα");
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