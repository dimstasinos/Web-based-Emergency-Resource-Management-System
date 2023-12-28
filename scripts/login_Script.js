document.getElementById("loginButton").addEventListener("click", function () {

  if (document.getElementById("username").value !== "" && document.getElementById("password").value !== "") {

    var formData = new FormData();
    formData.append("username", document.getElementById("username").value);
    formData.append("password", document.getElementById("password").value);

    fetch("/server/login_page.php", {
      method: "POST",
      body: formData,
    }).then((jsonResponse) => jsonResponse.json())
      .then((data) => {
        if (data.status === "fail") {
          alert(data.message);
        }else if(data.status === "success"){
          window.location.replace(data.Location)
        }
      })
      .catch((error) => console.error("Error:", error));
  }else{
    alert("Input");
  }

});

document.getElementById("check").addEventListener("change", function () {

  if (document.getElementById("password").type === "password") {
    document.getElementById("password").type = "text";
  } else {
    document.getElementById("password").type = "password";
  }

});