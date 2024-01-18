document.addEventListener('DOMContentLoaded', function () {

  

}

document.getElementById("newVehicle").addEventListener("change", function() {

  if(document.getElementById("vehicleUsername").disabled===true){
    document.getElementById("vehicleUsername").disabled=false;
  }else{
    document.getElementById("vehicleUsername").disabled=true;
  }

});

document.getElementById("registerButton").addEventListener("click", function(){

  var f_name = document.getElementById("fname").value;
  var l_name = document.getElementById("lname").value;
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var conf_password = document.getElementById("confpassword").value;
  var vehicle_id = document.getElementById("vehicleSelect").value;



});