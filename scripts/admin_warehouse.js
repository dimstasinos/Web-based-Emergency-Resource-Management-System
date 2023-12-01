document.addEventListener('DOMContentLoaded', function(){
  fetch('/server/warehouse_admin/database_extract.php',)
    .then(jsonResponse => {

        const isEmpty = jsonResponse.headers.get('Content-Length');
        if(isEmpty === '0'){
          return null;
        }
      
      return jsonResponse.json();
    })
    .then( data=> {
      if(data!=null){
        console.log(data);
        categories_select(data);
      }
      else{
        const list = document.getElementById("cat");
        list.innerHTML='';
        let select_add = document.createElement("option");
        select_add.textContent = "Η Βάση δεδομένων είναι κενή";
        list.appendChild(select_add);
      }
    })
    .catch(error => console.error('Error:', error));
}); 

document.getElementById('online_data').addEventListener('click', function () {

  fetch('/server/warehouse_admin/online_database.php',)
    .then(jsonResponse => jsonResponse.json())
    .then( data=> {
      console.log(data);
      categories_select(data);
    })
    .catch(error => console.error('Error:', error));
});


function categories_select(data) {

  const list = document.getElementById("cat");
  
  list.innerHTML='';

  data.categories.forEach(category => {
    let select_add = document.createElement("option");
    select_add.textContent = category.category_name;
    list.appendChild(select_add);
  });
    
  
}



