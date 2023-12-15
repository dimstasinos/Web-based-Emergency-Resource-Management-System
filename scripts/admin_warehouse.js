var onload_data;
var item_selected = 0;

document.addEventListener('DOMContentLoaded', function () {
  fetch('/server/warehouse_admin/database_extract.php')
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      if (data.status === "error") {
        console.error('Server Error:', data.Error);
      } else {
        if (data.categories.length !== 0 && data.items.length !== 0) {
          categories_select(data);
          selected_cat = document.getElementById("cat_list").value;
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

          const list_2 = document.getElementById("cat_selected");
          list_2.innerHTML = '';
          var select_add_2 = document.createElement("option");
          select_add_2.textContent = "Η Βάση δεδομένων είναι κενή";
          list_2.appendChild(select_add_2);

          const list_3 = document.getElementById("cat_new");
          list_3.innerHTML = '';
          var select_add_3 = document.createElement("option");
          select_add_3.textContent = "Η Βάση δεδομένων είναι κενή";
          list_3.appendChild(select_add_3);

          const list_4 = document.getElementById("category");
          list_4.innerHTML = '';
          var select_add_4 = document.createElement("option");
          select_add_4.textContent = "Η Βάση δεδομένων είναι κενή";
          list_4.appendChild(select_add_4);

          document.getElementById('add_new_cat').disabled = true;
          document.getElementById('add_product').disabled = true;
        }
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
      document.getElementById("quantity_selected").value = product.quantity;

      for (var i = 0; i < document.getElementById("cat_selected").options.length; i++) {
        if (document.getElementById("cat_selected").options[i].value === category.id) {
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
      document.getElementById("quantity_selected").value = product.quantity;

      for (var i = 0; i < document.getElementById("cat_selected").options.length; i++) {
        if (document.getElementById("cat_selected").options[i].value === category.id) {
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

document.getElementById('delete').addEventListener('click', function () {

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
        detail_name: name,
        detail_value: value
      };

      fetch('/server/warehouse_admin/delete_details.php', {
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
              if (data.status === "error") {
                console.error('Server Error:', data.Error);
              } else {
                onload_data = data;
                var selected_cat = document.getElementById("cat_list").value;
                items_select(data, selected_cat);
                radiobutton_refresh();
              }
            })
            .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
    } else {
      alert('Πρέπει να επιλέξετε κάποια λεπτομέρια του προιόντος');
    }
  } else if (item_selected === 0) {
    alert('Επίλεξε κάποιο προιόν');
  } else {
    alert('Το προιόν δεν έχει κάποια λεπτομέρεια για να σβήσετε')
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
          if (data.status === "error") {
            console.error('Server Error:', data.Error);
          } else {
            fetch('/server/warehouse_admin/database_extract.php',)
              .then(jsonResponse => jsonResponse.json())
              .then(data => {
                if (data.status === "error") {
                  console.error('Server Error:', data.Error);
                } else {
                  onload_data = data;
                  var selected_cat = document.getElementById("cat_list").value;
                  items_select(data, selected_cat);
                  radiobutton_refresh();
                }
              })
              .catch(error => console.error('Error:', error));
          }
        })
        .catch(error => console.error('Error:', error));
    } else {
      alert('Πρέπει να επιλέξετε κάποια λεπτομέρια του προιόντος');
    }
  } else if (item_selected === 0) {
    alert('Επίλεξε κάποιο προιόν');
  } else {
    alert('Το προιόν δεν έχει κάποια λεπτομέρεια για να τροποποιήσετε')
  }
});

document.getElementById('add').addEventListener('click', function () {

  const name = document.getElementById('detail_name_text').value;
  const value = document.getElementById('detail_value_text').value;
  const id_ = document.getElementById('id_selected').value;


  if (item_selected === 1) {

    if (name !== '' || value !== '') {

      var check = duplicate_check();

      if (check === 0) {

        const data = {
          id: id_,
          detail_name: name,
          detail_value: value
        };
        fetch('/server/warehouse_admin/add_details.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === "error") {
              console.error('Server Error:', data.Error);
            } else {
              fetch('/server/warehouse_admin/database_extract.php',)
                .then(jsonResponse => jsonResponse.json())
                .then(data => {
                  if (data.status === "error") {
                    console.error('Server Error:', data.Error);
                  } else {
                    onload_data = data;
                    var selected_cat = document.getElementById("cat_list").value;
                    items_select(data, selected_cat);
                    radiobutton_refresh();
                  }
                })
                .catch(error => console.error('Error:', error));
            }
          })
          .catch(error => console.error('Error:', error));

      } else {

        alert('Οι τιμές που δώσατε υπάρχουν ήδη στο προιόν');
      }
    } else {
      alert('Δώσε κάποια τιμή στις λεπτομέρειες του προιόντος');
    }
  } else {
    alert('Επίλεξε κάποιο προιόν');
  }

});

document.getElementById('cat_change_button').addEventListener('click', function () {

  if (document.getElementById('id_selected').value !== "") {

    const id = document.getElementById('id_selected').value;
    const new_category_id = document.getElementById('cat_selected').value;
    const old_category_id = document.getElementById("cat_list").value;


    if (new_category_id !== old_category_id) {
      const data = {
        id: id,
        new_cat: new_category_id,
      };

      fetch('/server/warehouse_admin/category_change.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === "error") {
            console.error('Server Error:', data.Error);
          } else {
            fetch('/server/warehouse_admin/database_extract.php')
              .then(jsonResponse => jsonResponse.json())
              .then(data => {
                if (data.status === "error") {
                  console.error('Server Error:', data.Error);
                } else {
                  onload_data = data;
                  items_select(data, new_category_id);
                  radiobutton_refresh();
                  document.getElementById("cat_list").value = new_category_id;
                }
              })
              .catch(error => console.error('Error:', error));
          }
        })
        .catch(error => console.error('Error:', error));

    } else {
      alert("Επίλεξε μια διαφορετική κατηγορία.");
    }
  } else {
    alert('Επίλεξε κάποιο προιόν');
  }



});

document.getElementById('category').addEventListener('change', function () {

  document.getElementById('cat_name').value = '';
  document.getElementById('id_cat').value = '';
  document.getElementById('cat_name').value = document.getElementById('category').options[document.getElementById('category').selectedIndex].textContent;
  document.getElementById('id_cat').value = document.getElementById('category').value;

});

document.getElementById('add_new_cat').addEventListener('click', function () {


  if (document.getElementById('new_cat_name').value !== '') {

    const input = document.getElementById('new_cat_name').value.toLowerCase();

    const check = onload_data.categories.find(cat => cat.category_name.toLowerCase() === input);

    if (check === undefined) {


      var id_check = onload_data.categories[0].id;

      for (var i = 0; i < onload_data.categories.length; i++) {
        if (parseInt(onload_data.categories[i].id) > id_check) {
          id_check = onload_data.categories[i].id;
        }
      }
      id_check++;
      const data = {
        id: id_check,
        new_cat: document.getElementById('new_cat_name').value
      };


      fetch('/server/warehouse_admin/add_category.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === "error") {
            console.error('Server Error:', data.Error);
          } else {

            fetch('/server/warehouse_admin/database_extract.php')
              .then(jsonResponse => jsonResponse.json())
              .then(data => {
                if (data.status === "error") {
                  console.error('Server Error:', data.Error);
                } else {
                  onload_data = data;
                  categories_select(data);
                  categories_select_product(data);
                  category_select_det(data);
                  categories_select_new(data);
                  items_select(data, id_check);
                  document.getElementById('detail_select').innerHTML="";
                  document.getElementById('cat_list').value = id_check;
                }
              })
              .catch(error => console.error('Error:', error));
          }
        })
        .catch(error => console.error('Error:', error));
    } else {
      alert('Αυτή η κατηγορία υπάρχει ήδη')
    }
  } else {
    alert('Δώστε ένα όνομα');
  }


});

document.getElementById('cat_list').addEventListener('change', function () {

  fetch('/server/warehouse_admin/database_extract.php',)
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      if (data.status === "error") {
        console.error('Server Error:', data.Error);
      } else {
        onload_data = data;
        const selected_cat = document.getElementById("cat_list").value;
        items_select(data, selected_cat);

        document.getElementById('id_selected').value = '';
        document.getElementById('name_selected').value = '';
        document.getElementById('detail_select').innerHTML = '';
      }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('online_data').addEventListener('click', function () {

  document.getElementById('online_data').disabled = true;
  fetch('/server/warehouse_admin/online_database.php',)
    .then(response => response.json())
    .then(data => {
      if (data.status === "error") {
        console.error('Server Error:', data.Error);
      } else {
        fetch('/server/warehouse_admin/database_extract.php',)
          .then(jsonResponse => jsonResponse.json())
          .then(data => {
            if (data.status === "error") {
              console.error('Server Error:', data.Error);
            } else {
              onload_data = data;
              categories_select(data);
              const selected_cat = document.getElementById("cat_list").value;
              items_select(data, selected_cat);
              categories_select_product(data);
              category_select_det(data);
              document.getElementById("detail_select").innerHTML = "";
              document.getElementById('add_new_cat').disabled = false;
              document.getElementById('online_data').disabled = false;
            }
          }
          )
          .catch(error => console.error('Error:', error));
      }
    })
    .catch(error => console.error('Error:', error));


});

document.getElementById('cat_name_change').addEventListener('click', function () {

  if (document.getElementById('id_cat').value !== '') {
    if (document.getElementById('cat_name').value !== '') {

      const input = document.getElementById('cat_name').value.toLowerCase();

      const check = onload_data.categories.find(cat => cat.category_name.toLowerCase() === input);

      if (check === undefined) {

        var id = document.getElementById('id_cat').value;
        var name = document.getElementById('cat_name').value;

        const data = {
          id: id,
          new_name: name
        };


        fetch('/server/warehouse_admin/update_category.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === "error") {
              console.error('Server Error:', data.Error);
            } else {

              fetch('/server/warehouse_admin/database_extract.php')
                .then(jsonResponse => jsonResponse.json())
                .then(data => {
                  if (data.status === "error") {
                    console.error('Server Error:', data.Error);
                  } else {
                    onload_data = data;
                    categories_select(data);
                    categories_select_product(data);
                    category_select_det(data);
                    categories_select_new(data);
                    


                  }
                })
                .catch(error => console.error('Error:', error));
            }
          })
          .catch(error => console.error('Error:', error));

      } else {
        alert('Αυτή η κατηγορία υπάρχει ήδη')
      }
    } else {
      alert('Το όνομα δεν μπορεί να είναι κενό')
    }
  } else {
    alert('Επίλεξε μια κατηγορία');
  }


});

document.getElementById('cat_name_delete').addEventListener('click', function () {

  if (document.getElementById('id_cat').value !== '') {
    if (document.getElementById('cat_name').value !== '') {

      var id = document.getElementById('id_cat').value;

      const data = {
        id: id
      };

      fetch('/server/warehouse_admin/delete_category.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === "error") {
            console.error('Server Error:', data.Error);
          } else {
            fetch('/server/warehouse_admin/database_extract.php')
              .then(jsonResponse => jsonResponse.json())
              .then(data => {
                if (data.status === "error") {
                  console.error('Server Error:', data.Error);
                } else {
                  onload_data = data;
                  categories_select(data);
                  categories_select_product(data);
                  category_select_det(data);
                  selected_cat = document.getElementById("cat_list").value;
                  items_select(data, selected_cat);
                  categories_select_new(data);
                }
              })
              .catch(error => console.error('Error:', error));
          }
        })
        .catch(error => console.error('Error:', error));

    } else {
      alert('Το όνομα δεν μπορεί να είναι κενό')
    }
  } else {
    alert('Επίλεξε μια κατηγορία');
  }

});

document.getElementById('add_product').addEventListener('click', function () {


  if (document.getElementById('name_new').value !== '') {

    const input = document.getElementById('name_new').value.toLowerCase();

    const check = onload_data.items.find(item => item.name.toLowerCase() === input);

    if (check === undefined) {

      var id_check = onload_data.items[0].id;

      for (var i = 0; i < onload_data.items.length; i++) {
        if (parseInt(onload_data.items[i].id) > id_check) {
          id_check = onload_data.items[i].id;
        }
      }

      id_check++;
      const data = {
        id: id_check,
        category: document.getElementById('cat_new').value,
        name: document.getElementById('name_new').value
      };

      fetch('/server/warehouse_admin/add_product.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === "error") {
            console.error('Server Error:', data.Error);
          } else {

            fetch('/server/warehouse_admin/database_extract.php')
              .then(jsonResponse => jsonResponse.json())
              .then(data => {
                if (data.status === "error") {
                  console.error('Server Error:', data.Error);
                } else {
                  onload_data = data;
                  

                  document.getElementById('detail_name_text').value = '';
                  document.getElementById('detail_value_text').value = '';
                  document.getElementById('name_new').value = '';


                  document.getElementById('detail_select').innerHTML = '';

                  const product = onload_data.items.find(item => parseInt(item.id) === id_check);
                  const category = onload_data.categories.find(cat_name => cat_name.id === product.category);

                  document.getElementById("id_selected").value = product.id;
                  document.getElementById("name_selected").value = product.name;

                  for (var i = 0; i < document.getElementById("cat_selected").options.length; i++) {
                    if (document.getElementById("cat_selected").options[i].value === category.id) {
                      document.getElementById("cat_selected").selectedIndex = i;
                      break;
                    }
                  }
                  
                  
                  items_select(data, document.getElementById('cat_new').value);
                  item_selected = 1;
                }
              })
              .catch(error => console.error('Error:', error));
          }
        })
        .catch(error => console.error('Error:', error));


    } else {
      alert('Αυτό το προιόν υπάρχει ήδη')
    }

  } else {
    alert('Δώστε ένα όνομα');
  }

});

document.getElementById('quantity_button').addEventListener('click', function () {

  if (document.getElementById('quantity_selected').value !== "") {
    if (document.getElementById('quantity_selected').value >= 0) {

      const id = document.getElementById('id_selected').value;
      const quantity = document.getElementById("quantity_selected").value;

      const data = {
        id: id,
        quantity: quantity,
      }

      fetch('/server/warehouse_admin/update_quantity.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === "error") {
            console.error('Server Error:', data.Error);
          } else {

            fetch('/server/warehouse_admin/database_extract.php')
              .then(jsonResponse => jsonResponse.json())
              .then(data => {
                if (data.status === "error") {
                  console.error('Server Error:', data.Error);
                } else {
                  onload_data = data;
                  var selected_cat = document.getElementById("cat_list").value;
                  items_select(data, selected_cat);
                  category_select_det(data);
                }
              })
              .catch(error => console.error('Error:', error));
          }
        })
        .catch(error => console.error('Error:', error));


    } else {
      alert("Δεν γίνεται να εισάγετε αρνητική τιμή.");
    }
  } else {
    alert("Εισάγετε μια τιμή στην ποσότητα.");

  }

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
      select_add.value = category.id;
      list.appendChild(select_add);
    }
  });

}

function categories_select_product(data) {

  const list = document.getElementById("cat_selected");
  list.innerHTML = '';

  data.categories.forEach(category => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      let select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      select_add.value = category.id;
      list.appendChild(select_add);
    }
  });

}

function category_select_det(data) {
  const list = document.getElementById("category");
  list.innerHTML = '';

  data.categories.forEach(category => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      let select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      select_add.value = category.id;
      list.appendChild(select_add);
    }
  });

  document.getElementById('cat_name').value = '';
  document.getElementById('id_cat').value = '';
  document.getElementById('cat_name').value = document.getElementById('category').options[document.getElementById('category').selectedIndex].textContent;
  document.getElementById('id_cat').value = document.getElementById('category').value;
}

function categories_select_new(data) {

  const list = document.getElementById("cat_new");

  list.innerHTML = '';

  data.categories.forEach(category => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      let select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      select_add.value = category.id;
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
      const item_quantity = document.createElement('td');

      id_table.textContent = item.id;
      name_table.textContent = item.name;
      item_quantity.textContent = item.quantity;
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

function radiobutton_refresh() {

  document.getElementById('detail_select').innerHTML = '';

  const item_id = document.getElementById('id_selected').value;

  const product = onload_data.items.find(item => item.id === item_id);
  const category = onload_data.categories.find(cat_name => cat_name.id === product.category);

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
      if (document.getElementById("cat_selected").options[i].value === category.id) {
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
    document.getElementById('detail_name_text').value = "";
    document.getElementById('detail_value_text').value = "";

  } else {

    document.getElementById("id_selected").value = product.id;
    document.getElementById("name_selected").value = product.name;

    for (var i = 0; i < document.getElementById("cat_selected").options.length; i++) {
      if (document.getElementById("cat_selected").options[i].value === category.id) {
        document.getElementById("cat_selected").selectedIndex = i;
        break;
      }
    }
  }

}

function duplicate_check() {

  var check = 0;

  if (document.getElementById('radiobutton_0')) {

    var id = document.getElementById('id_selected').value;
    var name = document.getElementById('detail_name_text').value;
    var value = document.getElementById('detail_value_text').value;

    const product = onload_data.items.find(item => item.id === id);

    product.details.forEach(detail => {

      if (name === detail.detail_name && value === detail.detail_value) {

        check = 1;
      }

    });

  }

  return check;
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
