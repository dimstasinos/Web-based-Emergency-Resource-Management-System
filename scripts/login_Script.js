document.getElementById('check').addEventListener("click", function() {


  if (document.getElementById("check").checked) {
      document.getElementById("pass").type = "text";
  } else {
    document.getElementById("pass").type = "password";
  }
});
