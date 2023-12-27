function validateForm() {
var username = document.getElementById("username").value;
var password = document.getElementById("password").value;

if(username === "" || password === ""){
  alert("Both username and password required.");
}
else{
  document.getElementById("loginForm").submit();
}


}
