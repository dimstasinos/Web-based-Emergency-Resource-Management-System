document.addEventListener('DOMContentLoaded', function () {
  fetch('/server/warehouse_admin/database_extract.php',)
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
      }
      else {
        const list = document.getElementById("cat_list");
        list.innerHTML = '';
        let select_add = document.createElement("option");
        select_add.textContent = "Η Βάση δεδομένων είναι κενή";
        list.appendChild(select_add);
      }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('cat_list').addEventListener('change', function () {

  fetch('/server/warehouse_admin/database_extract.php',)
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      selected_cat = category_id(data);
      items_select(data, selected_cat);
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('online_data').addEventListener('click', function () {

  fetch('/server/warehouse_admin/online_database.php',)
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      categories_select(data);
      items_select(data);
    })
    .catch(error => console.error('Error:', error));
});

function category_id(data) {

  var list_select = document.getElementById("cat_list");
  var category_select = list_select.options[list_select.selectedIndex].text;
  var category = data.categories.find(category => category.category_name === category_select);
  return category.id;
}


function categories_select(data) {

  const list = document.getElementById("cat_list");

  list.innerHTML = '';

  data.categories.forEach(category => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      let select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      list.appendChild(select_add);
    }
  });


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

      id_table.textContent = item.id;
      name_table.textContent = item.name;

      const category = data.categories.find(category => category.id === item.category);
      category_table.textContent = category.category_name;

      const detail_get = item.details.map(detail => {
        if (detail.detail_name && detail.detail_value) {
          return `${detail.detail_name}: ${detail.detail_value}`;
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

      table.appendChild(row_table);
    }
  });

}

function upload_data() {

  const updoad_file = document.getElementById('json_file');
  const json_file = updoad_file.files[0];

  if (json_file) {

     const json_data = new FormData();
     json_data.append('jsonfile', json_file);
   
     fetch('/server/warehouse_admin/file_upload.php', {
       method: 'POST',
       body: json_data,
     }) 
     .then(response => {
    
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); 
  })
     .then(data =>{
      if(data.status === 'success'){
       alert('Το αρχείο ανέβηκε');
      } else{
        console.error('Error uploading file:', data.message);
        alert('Σφάλμα στο ανέβασμα του αρχείου: ' + data.message)
      }

     })
     .catch(error => {
       console.error(error);
       alert('Σφάλμα στο ανέβασμα του αρχείου')
     })

  } else {
    alert("Επιλέξτε ένα αρχείο")
  }

}



