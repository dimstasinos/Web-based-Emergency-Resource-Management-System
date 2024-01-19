document.addEventListener('DOMContentLoaded', function () {

  fetch("/server/admin/register/vehicle_username.php")
    .then(response => response.json())
    .then(data => {

      var vehicle = document.getElementById("vehicleSelect");
      vehicle.innerHTML = "";

      if (data !== "") {
        data.trucks.forEach(info => {
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

    })
    .catch(error => console.error)


});

document.getElementById("newVehicle").addEventListener("change", function () {

  if (document.getElementById("vehicleUsername").disabled === true) {
    document.getElementById("vehicleUsername").disabled = false;
    document.getElementById("vehicleSelect").disabled = true;
  } else {
    document.getElementById("vehicleUsername").disabled = true;
    document.getElementById("vehicleSelect").disabled = false;
  }

});

document.getElementById("registerButton").addEventListener("click", function () {

  var check = 0;

  var f_name = document.getElementById("fname").value;
  var l_name = document.getElementById("lname").value;
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var conf_password = document.getElementById("confpassword").value;


  check = nameCheck(f_name);
  check = lastNameCheck(l_name);

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
          if (data.status === "fail") {
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
            if (data.status === "fail") {
              alert(data.message);
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

