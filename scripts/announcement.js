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
         
          items_select(data, selected_cat);
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
  

  document.addEventListener("DOMContentLoaded",function(){
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
        categories_select_new(data);
        onload_data = data;
      }
      else {
        const list = document.getElementById("cat_list");
        list.innerHTML = '';
        var select_add = document.createElement("option");
        select_add.textContent = "Η Βάση δεδομένων είναι κενή";
        list.appendChild(select_add);
      }
    })
    .catch(error => console.error('Error:', error));
  });


  document.getElementById("table_admin").addEventListener("click", function (event) {


    if (event.target.tagName === "TD") {
      item_selected = 1;
      document.getElementById('detail_name_text').value = '';
      document.getElementById('detail_value_text').value = '';
      document.getElementById('detail_select').innerHTML = '';
  
      const selected_row = event.target.closest("tr");
      const row_items = Array.from(selected_row.cells).map(cell => cell.textContent);
      const item_id = row_items[0];
  
      const product = onload_data.items.find(item => item.id === item_id);
      const category = onload_data.categories.find(cat_name => cat_name.id === product.category);


      document.getElementById("id_selected").value = product.id;
      document.getElementById("name_selected").value = product.name;
    }});

    document.getElementById('cat_list').addEventListener('change', function () {

      fetch('/server/warehouse_admin/database_extract.php',)
        .then(jsonResponse => jsonResponse.json())
        .then(data => {
          onload_data = data;
          const selected_cat = category_id(data);
          items_select(data, selected_cat);
    
          document.getElementById('id_selected').value = '';
          document.getElementById('name_selected').value = '';
          document.getElementById('detail_select').innerHTML = '';
    
        })
        .catch(error => console.error('Error:', error));
    });

    function category_id(data) {

      var list_select = document.getElementById("cat_list");
      var category_select = list_select.options[list_select.selectedIndex].text;
      var category = data.categories.find(category => category.category_name === category_select);
      return category.id;
    }

    function items_select(data, selected_cat) {
      const table = document.getElementById('items_table');
    
      table.innerHTML = '';
    
    
      data.items.forEach(item => {
        if (item.name != "" && item.category === selected_cat) {
          const row_table = document.createElement('tr');
          const id_table = document.createElement('td');
          const name_table = document.createElement('td');
          const category_table = document.createElement('td');
          const detail_table = document.createElement('td');
          const item_quantity = document.createElement('td');
    
          id_table.textContent = item.id;
          name_table.textContent = item.name;
    
          const category = data.categories.find(category => category.id === item.category);
          category_table.textContent = category.category_name;
    
    
    
          const detail_get = item.details.map(detail => {
            if (detail.detail_name && detail.detail_value) {
              return `${detail.detail_name}: ${detail.detail_value}`;
            } else if (detail.detail_name && detail.detail_value === '') {
              return `${detail.detail_name}:`;
            } else if (detail.detail_name === '' && detail.detail_value) {
              return `---: ${detail.detail_value}`;
            }
            else {
              return ' ';
            }
          });
          detail_table.innerHTML = detail_get.join('<br>');
    
          row_table.appendChild(id_table);
          row_table.appendChild(name_table);
          row_table.appendChild(category_table);
          row_table.appendChild(detail_table);
          row_table.appendChild(item_quantity);
    
          table.appendChild(row_table);
        }
      });
    
    }
