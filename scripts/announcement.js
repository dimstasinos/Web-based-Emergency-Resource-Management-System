document.addEventListener('DOMContentLoaded', function () {

  fetch('/server/announcement/announcement.php')
    .then(response => response.json())
    .then(data => {


      const tableBody = document.getElementById('table');

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

    })
    .catch(error => console.error('Error fetching data:', error));
});

document.getElementById('upload-button').addEventListener('click', function () {
  var form = document.getElementById("announcement-form");

  text = document.getElementById('text').value;
  date = document.getElementById('date').value;
  quantity = document.getElementById('quantity').value;

  const data = {
    text: text,
    date: date,
    quantity: quantity
  };

  fetch("/server/announcement/announcement_upload.php", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      fetch('/server/announcement/announcement.php')
        .then(response => response.json())
        .then(data => {
           document.getElementById("table").innerHTML="";

          const tableBody = document.getElementById('table');

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

        })

        .catch(error => console.error('Error fetching data:', error));
    });
  });

  document.addEventListener("DOMContentLoaded",function(){
    fetch('/server/warehouse_admin/database_extract.php')
  });
