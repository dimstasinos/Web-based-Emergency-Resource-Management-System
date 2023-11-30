document.getElementById('online_data').addEventListener('click', function () {

  fetch('/server/warehouse_admin/online_database.php',)
    .then(jsonResponse => jsonResponse.json())
    .then( data=> {
      categories_select(data);
    })
    .catch(error => console.error('Error:', error));
});


function categories_select(data) {



  const list = document.getElementById("cat");
  
  data.categories.forEach(category => {
    let select_add = document.createElement("option");
    select_add.textContent = category.category_name;
    list.appendChild(select_add);
  });
    
  
}



