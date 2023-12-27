/*document.getElementById('loginButton').addEventListener('click', function () {
  username = document.getElementById("username").value;
  password = document.getElementById("password").value;

  const data = {
    username: username,
    password: password
  };
  console.log(data);
  fetch('/server/loginpage/login_page.php', {
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
    })

});*/


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
