document.addEventListener("DOMContentLoaded", function () {
  // Fetch JSON data
  fetch('/export.json')
    .then(response => response.json())
    .then(data => {
    
      

    })
    .catch(error => console.error('Error fetching data:', error));
});


function test() {

  

};
