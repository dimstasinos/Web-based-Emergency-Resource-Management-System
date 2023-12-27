document.getElementById('loginButton').addEventListener('click', function () {
  username = document.getElementById("username").value;
  password = document.getElementById("pass").value;

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

});
