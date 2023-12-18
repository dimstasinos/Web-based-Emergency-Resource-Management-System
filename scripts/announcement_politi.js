var onload_data;

document.addEventListener('DOMContentLoaded', function () {

  fetch('/server/announcement/announcement_politis.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        const tableBody = document.getElementById('table_announcement');

        data.announcements.forEach(item => {

          const row = document.createElement('tr');


          const idCell = document.createElement('td');
          idCell.textContent = item.id;
          row.appendChild(idCell);

          const textCell = document.createElement('td');
          textCell.textContent = item.text;
          row.appendChild(textCell);

          const dateCell = document.createElement('td');
          dateCell.textContent = item.date;
          row.appendChild(dateCell);

          const quantityCell = document.createElement('td');
          quantityCell.textContent = item.quantity;
          row.appendChild(quantityCell);


          tableBody.appendChild(row);



        });
      }

    })
    .catch(error => console.error('Error fetching data:', error));

    function acceptRequest() {
      
      alert("Request Accepted");
  }

  function declineRequest() {
       
      alert("Request Declined");
  }

});
