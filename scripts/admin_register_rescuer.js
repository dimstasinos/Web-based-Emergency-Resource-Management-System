//Event listener που εκτελείτε όταν φορτωθεί η HTML
document.addEventListener('DOMContentLoaded', function () {

  //Επικοινωνία με τον Server για την ανάκτηση των username των
  //οχημάτων
  fetch("/server/admin/register/vehicle_username.php")
    .then(response => response.json())
    .then(data => {

      if (data.status === "success") {
        var vehicle = document.getElementById("vehicleSelect");
        vehicle.innerHTML = "";

        //Εμφάνιση username οχημάτων
        if (data.vehicle !== "") {
          data.vehicle.trucks.forEach(info => {
            var vehicle_add = document.createElement("option");
            vehicle_add.textContent = info.username;
            vehicle_add.value = info.id;
            vehicle.appendChild(vehicle_add);
          });
        } else {
          var noVehicle = document.createElement("option");
          noVehicle.textContent = "Δεν υπάρχει κάποιο όχημα";
          vehicle.appendChild(noVehicle);
        }
      } else {
        console.error("Server Error:", data.Error);
      }

    })
    .catch(error => console.error)

});


//Event Listener που ενεργοποιεί/απενεργοποιεί input text
document.getElementById("newVehicle").addEventListener("change", function () {

  if (document.getElementById("vehicleUsername").disabled === true) {
    document.getElementById("vehicleUsername").disabled = false;
    document.getElementById("vehicleSelect").disabled = true;
  } else {
    document.getElementById("vehicleUsername").disabled = true;
    document.getElementById("vehicleSelect").disabled = false;
  }

});


//Event listener που εκτελεί την εγγκραφή του διασώστη
document.getElementById("registerButton").addEventListener("click", function () {

  var check = 0;

  //Ανάκτηση δεδομένων από τα inputs
  var f_name = document.getElementById("fname").value;
  var l_name = document.getElementById("lname").value;
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var conf_password = document.getElementById("confpassword").value;


  check = nameCheck(f_name);
  check = lastNameCheck(l_name);

  //Έλεγχος στοιχείων
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

    //Αποστολή δεδομένων στον server για εγγραφή του χρήστη
    if (document.getElementById("vehicleUsername").disabled === true) {

      var formData = new FormData();
      formData.append("f_name", f_name);
      formData.append("l_name", l_name);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("truck_id", document.getElementById("vehicleSelect").value);

      fetch('/server/admin/register/register_rescuer_vehicle.php', {
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then((data) => {
          if (data.status === "error") {
            alert(data.message);
          } else if (data.status === "success") {
            document.getElementById("fname").value = "";
            document.getElementById("lname").value = "";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            document.getElementById("confpassword").value = "";
            document.getElementById("vehicleSelect").selectedIndex = 0;
            alert(data.message);
          }
        })
        .catch((error) => console.error("Error:", error));

    } else if (document.getElementById("vehicleUsername").disabled === false) {

      //Αποστολή δεδομένων στον server για εγγραφή του χρήστη σε νέο όχημα
      if (document.getElementById("vehicleUsername").value !== "") {
        var formData = new FormData();
        formData.append("f_name", f_name);
        formData.append("l_name", l_name);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("truckUsername", document.getElementById("vehicleUsername").value);

        fetch('/server/admin/register/register_rescuer_newVehicle.php', {
          method: "POST",
          body: formData
        })
          .then(response => response.json())
          .then((data) => {
            if (data.status === "error") {
              alert(data.Error);
            } else if (data.status === "success") {
              document.getElementById("fname").value = "";
              document.getElementById("lname").value = "";
              document.getElementById("username").value = "";
              document.getElementById("password").value = "";
              document.getElementById("confpassword").value = "";
              document.getElementById("vehicleUsername").value = "";
              alert(data.message);
            }
          })
          .catch((error) => console.error("Error:", error));

      } else {
        alert("Δώσε username για το νέο όχημα");
      }
    }
  }
});


//Συνάρτηση για τον έλεγχο
//συμβολοσειράς
function stringCheck(input) {
  return /\d/.test(input);
}

//Συνάρτηση για τον έλεγχο
//ενός τηλεφώνου
function phoneCheck(input) {
  return /^[A-Za-z]+$/.test(input);
}

//Συνάρτηση που ελέγχει το
//όνομα που εισάγει ο χρήστης
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

//Συνάρτηση που ελέγχει το
//επωνυμο που εισάγει ο χρήστης
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

