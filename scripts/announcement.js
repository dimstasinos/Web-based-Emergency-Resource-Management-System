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


  document.addEventListener('DOMContentLoaded', function () {
    fetch('/server/warehouse_admin/database_extract.php')
      .then(jsonResponse => {
  
        const isEmpty = jsonResponse.headers.get('Content-Length');
        if (isEmpty === '0') {
          return null;
        }
        
        return jsonResponse.json();
      })
      .then(data => {
        
        if (data != null) {
          categories_select(data);
          selected_cat = category_id(data);
          items_select(data, selected_cat);
          categories_select_product(data);
          category_select_det(data);
          onload_data = data;
        }
        else {
          const list = document.getElementById("cat_list");
          list.innerHTML = '';
          let select_add = document.createElement("option");
          select_add.textContent = "Η Βάση δεδομένων είναι κενή";
          list.appendChild(select_add);
          document.getElementById('add_new_cat').disabled = true;
  
        }
      })
      .catch(error => console.error('Error:', error));
  });
  

  /*document.addEventListener("DOMContentLoaded",function(){
    fetch('/server/warehouse_admin/database_extract.php')
  });*/
