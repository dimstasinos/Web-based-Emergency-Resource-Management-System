//Event listener για την αποστολή των στοιχείων εισόδου του χρήστη
document.getElementById("loginButton").addEventListener("click", function () {

  //Έλεγχος για τα στοιχεία εισόδου
  if (document.getElementById("username").value !== "" && document.getElementById("password").value !== "") {

    //Συλλογή των στοιχείων
    var formData = new FormData();
    formData.append("username", document.getElementById("username").value);
    formData.append("password", document.getElementById("password").value);

    //Αποστολή δεδομένων στον server
    fetch("/server/login_server.php", {
      method: "POST",
      body: formData,
    }).then((jsonResponse) => jsonResponse.json())
      .then((data) => {

        //Επιτυχης/Ανεπιτυχης είσοδος
        if (data.status === "fail") {
          alert(data.message);
        } else if (data.status === "success") {
          window.location.replace(data.Location);
        }
      })
      .catch((error) => console.error("Error:", error));
  } else {

    //Εμφάνιση ειδοποιήσεων
    if (document.getElementById("username").value === "" && document.getElementById("password").value !== "") {
      alert("Δώσε ένα username");
    } else if (document.getElementById("password").value === "" && document.getElementById("username").value !== "") {
      alert("Δώσε ένα κωδικό");
    } else {
      alert("Δώσε ένα username και κωδικό");
    }
  }
});

//Event listener για την ενεργοποίηση/απενεργοποίηση των inputs
document.getElementById("check").addEventListener("change", function () {
  if (document.getElementById("password").type === "password") {
    document.getElementById("password").type = "text";
  } else {
    document.getElementById("password").type = "password";
  }
});