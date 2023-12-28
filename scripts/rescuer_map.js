document.addEventListener('DOMContentLoaded', function () {


  fetch("/server/get_Session_info.php")
    .then((jsonResponse) => jsonResponse.json())
    .then(data => {

      document.getElementById("text").textContent = data.Name;


    })
    .catch((error) => console.error("Error:", error));

  var map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  document.getElementById("text").textContent = sessionStorage.getItem("Name");

});