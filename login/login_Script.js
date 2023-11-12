function showPassword() {
  var inputPass = document.getElementById("pass");
  
  if(inputPass.type === "password") {
    inputPass = "text";
  }else {
    inputPass = "password";
  }
}