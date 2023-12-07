var onload_data;

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
        categories_select_product(data);
        onload_data = data;
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

document.getElementById("table_admin").addEventListener("click", function (event) {


  if (event.target.tagName === "TD") {

    document.getElementById('detail_name_text').value = '';
    document.getElementById('detail_value_text').value = '';
    document.getElementById('detail_select').innerHTML = '';

    const selected_row = event.target.closest("tr");
    const row_items = Array.from(selected_row.cells).map(cell => cell.textContent);
    const item_id = row_items[0];

    const product = onload_data.items.find(item => item.id === item_id);
    const category = onload_data.categories.find(cat_name => cat_name.id === product.category);



    const det_num = product.details.length;

    var flag = 0;

    for (let item of product.details) {

      if (item.detail_name === "" && item.detail_value === "") {
        flag = 1;
      } else {
        flag = 0;
        break;
      }

    }

    if (flag === 0) {
      var i = 0;
      product.details.forEach(item => {

        const radio_button = document.createElement('input');
        radio_button.type = 'radio';
        radio_button.name = 'select';
        radio_button.id = 'radiobutton_' + i;
        radio_button.value = i;

        const radio_button_label = document.createElement('label');
        radio_button_label.setAttribute('for', 'radiobutton_' + i);
        radio_button_label.textContent = item.detail_name + ': ' + item.detail_value;
        i++;

        document.getElementById('detail_select').appendChild(radio_button);
        document.getElementById('detail_select').appendChild(radio_button_label);
      });

      document.getElementById("id_selected").value = product.id;
      document.getElementById("name_selected").value = product.name;

      for (var i = 0; i < document.getElementById("cat_selected").options.length; i++) {
        if (document.getElementById("cat_selected").options[i].value === category.category_name) {
          document.getElementById("cat_selected").selectedIndex = i;
          break;
        }
      }

      var radio_button = document.getElementsByName('select');

      for (var i = 0; i < radio_button.length; i++) {
        radio_button[i].addEventListener('change', function () {
          if (this.checked) {
            document.getElementById('detail_name_text').value = product.details[this.value].detail_name;
            document.getElementById('detail_value_text').value = product.details[this.value].detail_value;
          }
        });
      }
    } else {

      document.getElementById("id_selected").value = product.id;
      document.getElementById("name_selected").value = product.name;

      for (var i = 0; i < document.getElementById("cat_selected").options.length; i++) {
        if (document.getElementById("cat_selected").options[i].value === category.category_name) {
          document.getElementById("cat_selected").selectedIndex = i;
          break;
        }
      }
    }

  }
});


document.getElementById('clear').addEventListener('click', function () {

  document.getElementById('detail_name_text').value = '';
  document.getElementById('detail_value_text').value = '';

  if (document.getElementById('radiobutton_0')) {
    for (var i = 0; i < document.getElementsByName('select').length; i++) {
      document.getElementsByName('select')[i].checked = false;
    }
  }

});

document.getElementById('change').addEventListener('click', function () {

  if (document.getElementById('radiobutton_0')) {

    const name = document.getElementById('detail_name_text').value;
    const value = document.getElementById('detail_value_text').value;

    var selected;
    var flag = 0;
    for (var i = 0; i < document.getElementsByName('select').length; i++) {

      if (document.getElementsByName('select')[i].checked === true) {
        selected = document.getElementsByName('select')[i].value;
        flag = 1;
        break;
      }
    }

    if (flag === 1) {
      const id_ = document.getElementById('id_selected').value;

      product = onload_data.items.find(item => item.id === id_);

      const data = {
        id: id_,
        new_name: name,
        new_value: value,
        prev_product_name: product.details[selected].detail_name,
        prev_product_value: product.details[selected].detail_value
      };

      fetch('/server/warehouse_admin/update_details.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {

          fetch('/server/warehouse_admin/database_extract.php',)
            .then(jsonResponse => jsonResponse.json())
            .then(data => {
              onload_data = data;
              var selected_cat = category_id(data);
              items_select(data, selected_cat);
            })
            .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
    } else {
      alert('Πρέπει να επιλέξετε κάποια λεπτομέρια του προιόντος');
    }
  }
});

document.getElementById('add').addEventListener('click', function () {

  const name = document.getElementById('detail_name_text').value;
  const value = document.getElementById('detail_value_text').value;
  const id_ = document.getElementById('id_selected').value;

  fetch('/server/warehouse_admin/update_details.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {

      
    })


});


document.getElementById('cat_list').addEventListener('change', function () {

  fetch('/server/warehouse_admin/database_extract.php',)
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      onload_data = data;
      selected_cat = category_id(data);
      items_select(data, selected_cat);

      document.getElementById('id_selected').value = '';
      document.getElementById('name_selected').value = '';
      document.getElementById('detail_select').innerHTML = '';

    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('online_data').addEventListener('click', function () {

  fetch('/server/warehouse_admin/online_database.php',)
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      onload_data = data;
      categories_select(data);
      selected_cat = category_id(data);
      items_select(data, selected_cat);
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

function categories_select_product(data) {

  const list = document.getElementById("cat_selected");
  list.innerHTML = '';

  data.categories.forEach(category => {
    let select_add = document.createElement("option");
    select_add.textContent = category.category_name;
    list.appendChild(select_add);
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


      table.appendChild(row_table);
    }
  });

}


function upload_data() {

  const upload_file = document.getElementById('json_file');
  const json_file = upload_file.files[0];

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
      .then(data => {
        if (data.status === 'success') {
          alert('Το αρχείο ανέβηκε');

          categories_select(data.data);
          selected_cat = category_id(data.data);
          items_select(data.data, selected_cat);
          categories_select_product(data);
          onload_data = data;
        } else {
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
