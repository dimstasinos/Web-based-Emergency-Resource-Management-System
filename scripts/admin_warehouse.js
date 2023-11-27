document.addEventListener('DOMContentLoaded', function () {
  var fetchButton = document.getElementById('fetchButton');
  var resultDiv = document.getElementById('result');

  fetchButton.addEventListener('click', function () {
      // Make an AJAX request to the PHP script
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
              // Parse the received JSON data
              var jsonData = JSON.parse(xhr.responseText);

              // Display the JSON data in the result div
              resultDiv.innerHTML = '<pre>' + JSON.stringify(jsonData, null, 2) + '</pre>';
          }
      };

      // Replace 'getData.php' with the actual path to your PHP script
      xhr.open('GET', '/server/warehouse.php', true);
      xhr.send();
  });
});
