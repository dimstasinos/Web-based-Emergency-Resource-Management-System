function showPassword() {
  var inputPass = document.getElementById("pass");

  if(inputPass.type === "password") {
    inputPass.type = "text";
  }else {
    inputPass.type = "password";
  }
}