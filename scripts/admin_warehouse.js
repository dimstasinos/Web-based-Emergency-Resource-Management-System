//Global μεταβλητές
var onload_data;
var item_selected = 0;
var categories_selected = [];

//Event listener που εκτελείτε όταν φορτωθεί η HTML
document.addEventListener("DOMContentLoaded", function () {

  //Ανάκτηση πληροφοριών του Session
  fetch("/server/get_Session_info.php")
    .then((jsonResponse) => jsonResponse.json())
    .then(data => {
      if (data.status === "success") {
        document.getElementById("text").textContent = data.response.Name;
      } else {
        console.error(data.message);
      }
    })
    .catch((error) => console.error("Error:", error));

  //Επικοινωνια με τον server για εμφάνιση των ειδών που περιέχει
  //η βάση δεδομένων
  fetch("/server/admin/warehouse_admin/database_extract.php")
    .then((jsonResponse) => jsonResponse.json())
    .then((data) => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {

        //Έλεγχος εάν υπάρχει κάποιο είδος
        if (data.categories.length !== 0 && data.items.length !== 0) {


          data.categories.forEach(cat => {
            categories_selected.push(cat.id);
          })

          //Συμπλήρωση της λίστα με τις κατηγορίες
          categories_select(data);

          for (var i = 0; i < document.getElementsByClassName("categories").length; i++) {
            document.getElementsByClassName("categories")[i].checked = true;
          }

          //Εμφάνιση των ειδών της επιλεγμένης κατηγορίας
          items_select(data, categories_selected);

          //Συμπλήρωση της λίστα με τις κατηγορίες
          categories_select_product(data);

          //Συμπλήρωση της λίστα με τις κατηγορίες
          category_select_det(data);

          //Συμπλήρωση της λίστα με τις κατηγορίες
          categories_select_new(data);

          document.getElementById("cat_name").value =
            document.getElementById("category").options[
              document.getElementById("category").selectedIndex
            ].textContent;
          document.getElementById("id_cat").value =
            document.getElementById("category").value;

          onload_data = data;
        } else {

          //Εμφάνιση ειδοποιήσεωβ ότι η βάση είναι κενή
          const list_2 = document.getElementById("cat_selected");
          list_2.innerHTML = "";
          var select_add_2 = document.createElement("option");
          select_add_2.textContent = "Η Βάση δεδομένων είναι κενή";
          list_2.appendChild(select_add_2);

          const list_3 = document.getElementById("cat_new");
          list_3.innerHTML = "";
          var select_add_3 = document.createElement("option");
          select_add_3.textContent = "Η Βάση δεδομένων είναι κενή";
          list_3.appendChild(select_add_3);

          const list_4 = document.getElementById("category");
          list_4.innerHTML = "";
          var select_add_4 = document.createElement("option");
          select_add_4.textContent = "Η Βάση δεδομένων είναι κενή";
          list_4.appendChild(select_add_4);

          document.getElementById("add_new_cat").disabled = true;
          document.getElementById("add_product").disabled = true;
        }
      }
    })
    .catch((error) => console.error("Error:", error));
});

//Event listner ο οποίος συμπληρώνει τα inputs με το είδος που
//επιλέχθηκε από τον πίνακα
document.getElementById("table_admin").addEventListener("click", function (event) {

  if (event.target.tagName === "TD") {

    //Εύρεση είδους που επιλέχθηκε
    item_selected = 1;
    document.getElementById("detail_name_text").value = "";
    document.getElementById("detail_value_text").value = "";
    document.getElementById("detail_select").innerHTML = "";

    const selected_row = event.target.closest("tr");
    const row_items = Array.from(selected_row.cells).map(
      (cell) => cell.textContent
    );
    const item_id = row_items[0];

    const product = onload_data.items.find((item) => item.id === item_id);
    const category = onload_data.categories.find(
      (cat_name) => cat_name.id === product.category
    );

    var flag = 0;

    for (var item of product.details) {
      if (item.detail_name === "" && item.detail_value === "") {
        flag = 1;
      } else {
        flag = 0;
        break;
      }
    }

    if (flag === 0) {

      //Συμπλήρωση των πληροφοριών με το είδος που επιλέχθηκε
      var i = 0;
      product.details.forEach((item) => {
        const radio_button = document.createElement("input");
        radio_button.className = "radiobutton";
        radio_button.type = "radio";
        radio_button.name = "select";
        radio_button.id = "radiobutton_" + i;
        radio_button.value = i;

        const radio_button_label = document.createElement("label");
        radio_button_label.setAttribute("for", "radiobutton_" + i);
        radio_button_label.textContent =
          item.detail_name + ": " + item.detail_value;
        i++;

        document.getElementById("detail_select").appendChild(radio_button);
        document
          .getElementById("detail_select")
          .appendChild(radio_button_label);
      });

      //Συμπλήρωση των πληροφοριών με το είδος που επιλέχθηκε
      document.getElementById("id_selected").value = product.id;
      document.getElementById("name_selected").value = product.name;
      document.getElementById("quantity_selected").value = product.quantity;


      for (
        var i = 0;
        i < document.getElementById("cat_selected").options.length;
        i++
      ) {
        if (
          document.getElementById("cat_selected").options[i].value ===
          category.id
        ) {
          document.getElementById("cat_selected").selectedIndex = i;
          break;
        }
      }

      var radio_button = document.getElementsByName("select");

      for (var i = 0; i < radio_button.length; i++) {
        radio_button[i].addEventListener("change", function () {
          if (this.checked) {
            document.getElementById("detail_name_text").value =
              product.details[this.value].detail_name;
            document.getElementById("detail_value_text").value =
              product.details[this.value].detail_value;
          }
        });
      }

    } else {
      //Συμπλήρωση των πληροφοριών με το είδος που επιλέχθηκε
      document.getElementById("id_selected").value = product.id;
      document.getElementById("name_selected").value = product.name;
      document.getElementById("quantity_selected").value = product.quantity;

      for (
        var i = 0;
        i < document.getElementById("cat_selected").options.length;
        i++
      ) {
        if (
          document.getElementById("cat_selected").options[i].value ===
          category.id
        ) {
          document.getElementById("cat_selected").selectedIndex = i;
          break;
        }
      }
    }
  }
});

//Event listener που καθαρίζει τα inputs του χρήστη
document.getElementById("clear").addEventListener("click", function () {
  document.getElementById("detail_name_text").value = "";
  document.getElementById("detail_value_text").value = "";

  if (document.getElementById("radiobutton_0")) {
    for (var i = 0; i < document.getElementsByName("select").length; i++) {
      document.getElementsByName("select")[i].checked = false;
    }
  }
});

//Event listener που διαγράφει κάποια λεπτομέρια
document.getElementById("delete").addEventListener("click", function () {
  if (document.getElementById("radiobutton_0")) {
    const name = document.getElementById("detail_name_text").value;
    const value = document.getElementById("detail_value_text").value;

    var selected;
    var flag = 0;

    //Έλεγχος εάν έχει επιλεχθει κάποια λεπτομέρια
    for (var i = 0; i < document.getElementsByName("select").length; i++) {
      if (document.getElementsByName("select")[i].checked === true) {
        selected = document.getElementsByName('select')[i].value;
        flag = 1;
        break;
      }
    }


    if (flag === 1) {

      //Συλλογή δεδομένων
      const id_ = document.getElementById("id_selected").value;
      product = onload_data.items.find((item) => item.id === id_);

      const data = {
        id: id_,
        detail_name: name,
        detail_value: value,
      };

      //Επικοινωνία με τον server για την διαγραφή της λεπτομέριας
      fetch("/server/admin/warehouse_admin/delete_details.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            //Επικοινωνία με τον server για ανανέωση των ειδών του πίνακα
            fetch("/server/admin/warehouse_admin/database_extract.php")
              .then((jsonResponse) => jsonResponse.json())
              .then((data) => {
                if (data.status === "error") {
                  console.error("Server Error:", data.Error);
                } else {

                  //Ανανέωση πίνακα ειδών και των λεπτομεριών
                  onload_data = data;
                  items_select(data, categories_selected);
                  radiobutton_refresh();
                }
              })
              .catch((error) => console.error("Error:", error));
          } else {
            console.error(data.Error);
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Πρέπει να επιλέξετε κάποια λεπτομέρια του προιόντος");
    }
  } else if (item_selected === 0) {
    alert("Επίλεξε κάποιο προιόν");
  } else {
    alert("Το προιόν δεν έχει κάποια λεπτομέρεια για να σβήσετε");
  }
});

//Event listener που αλλάζει την λεπτομέρια ενός είδους
document.getElementById("change").addEventListener("click", function () {
  if (document.getElementById("radiobutton_0")) {

    const name = document.getElementById("detail_name_text").value;
    const value = document.getElementById("detail_value_text").value;

    //Ανάκτηση της επιλεγμένης λεπτομέριας
    var selected;
    var flag = 0;
    for (var i = 0; i < document.getElementsByName("select").length; i++) {
      if (document.getElementsByName("select")[i].checked === true) {
        selected = document.getElementsByName("select")[i].value;
        flag = 1;
        break;
      }
    }

    if (flag === 1) {

      //Συλλογή πληροφοριών
      const id_ = document.getElementById("id_selected").value;
      product = onload_data.items.find((item) => item.id === id_);

      var check = false;
      for (var i = 0; i < product.details.length; i++) {
        if (
          product.details[i].detail_name === name &&
          product.details[i].detail_value === value
        ) {
          check = true;
        }
      }

      if (check === false) {
        const data = {
          id: id_,
          new_name: name,
          new_value: value,
          prev_product_name: product.details[selected].detail_name,
          prev_product_value: product.details[selected].detail_value,
        };

        //Αποστολή των νέων πληροφοριών του είδους στον server
        fetch("/server/admin/warehouse_admin/update_details.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "error") {
              console.error("Server Error:", data.Error);
            } else {

              //Επικοινωνία με τον server για ανανέωση των ειδών του πίνακα
              fetch("/server/admin/warehouse_admin/database_extract.php")
                .then((jsonResponse) => jsonResponse.json())
                .then((data) => {
                  if (data.status === "error") {
                    console.error("Server Error:", data.Error);
                  } else {

                    //Συνάρτηση που ανανεώνει τα είδη του πίνακα
                    onload_data = data;
                    items_select(data, categories_selected);
                    radiobutton_refresh();
                  }
                })
                .catch((error) => console.error("Error:", error));
            }
          })
          .catch((error) => console.error("Error:", error));
      } else {
        alert("Αυτή η λεπτομέρια υπάρχει ήδη στο προιόν");
      }
    } else {
      alert("Πρέπει να επιλέξετε κάποια λεπτομέρια του προιόντος");
    }
  } else if (item_selected === 0) {
    alert("Επίλεξε κάποιο προιόν");
  } else {
    alert("Το προιόν δεν έχει κάποια λεπτομέρεια για να τροποποιήσετε");
  }
});

//Event listener που προσθετει μια λεπτομέρια στο είδος
document.getElementById("add").addEventListener("click", function () {

  const name = document.getElementById("detail_name_text").value;
  const value = document.getElementById("detail_value_text").value;
  const id_ = document.getElementById("id_selected").value;

  //Συλλογή πληροφοριών
  if (item_selected === 1) {
    var selected = false;
    for (var i = 0; i < document.getElementsByName("select").length; i++) {
      if (document.getElementsByName("select")[i].checked) {
        selected = true;
        break;
      }
    }

    if (selected === false) {
      if (name !== "" || value !== "") {
        var check = duplicate_check();

        if (check === 0) {

          const data = {
            id: id_,
            detail_name: name,
            detail_value: value,
          };

          //Αποστολή της νέας λεπτομέριας στον server
          fetch("/server/admin/warehouse_admin/add_details.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "error") {
                console.error("Server Error:", data.Error);
              } else {

                //Ανανέωση του πίνακα ειδών
                fetch("/server/admin/warehouse_admin/database_extract.php")
                  .then((jsonResponse) => jsonResponse.json())
                  .then((data) => {
                    if (data.status === "error") {
                      console.error("Server Error:", data.Error);
                    } else {
                      onload_data = data;
                      items_select(data, categories_selected);
                      radiobutton_refresh();
                    }
                  })
                  .catch((error) => console.error("Error:", error));
              }
            })
            .catch((error) => console.error("Error:", error));
        } else {
          alert("Οι τιμές που δώσατε υπάρχουν ήδη στο προιόν");
        }
      } else {
        alert("Δώσε κάποια τιμή στις λεπτομέρειες του προιόντος");
      }
    } else {
      alert(
        "Πρέπει να καθαρίσετε την προηγούμενη επιλογή πατώντας το κουμπί Καθαρισμός"
      );
    }
  } else {
    alert("Επίλεξε κάποιο προιόν");
  }
});

//Συνάρτηση που αλλάζει την κατηγορία από ένα είδος
document.getElementById("cat_change_button").addEventListener("click", function () {
  if (document.getElementById("id_selected").value !== "") {

    //Συλλογή πληροφοριών
    const id = document.getElementById("id_selected").value;
    const new_category_id = document.getElementById("cat_selected").value;
    var old_category_id
    onload_data.items.forEach(item => {
      if (item.id === id) {
        old_category_id = item.category;
      }
    })

    if (new_category_id !== old_category_id) {
      const data = {
        id: id,
        new_cat: new_category_id,
      };

      //Αποστολή της νέας κατηγορίας για το είδος στον server
      fetch("/server/admin/warehouse_admin/category_change.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "error") {
            console.error("Server Error:", data.Error);
          } else {

            //Ανανέωση του πίνακα ειδών
            fetch("/server/admin/warehouse_admin/database_extract.php")
              .then((jsonResponse) => jsonResponse.json())
              .then((data) => {
                if (data.status === "error") {
                  console.error("Server Error:", data.Error);
                } else {
                  onload_data = data;
                  items_select(data, categories_selected);
                  radiobutton_refresh();
                }
              })
              .catch((error) => console.error("Error:", error));
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Επίλεξε μια διαφορετική κατηγορία.");
    }
  } else {
    alert("Επίλεξε κάποιο προιόν");
  }
});

//Event listener που συμπληρώνει input με τις πληροφορίες της επιλεγμένης
//κατηγορίας
document.getElementById("category").addEventListener("change", function () {
  document.getElementById("cat_name").value = "";
  document.getElementById("id_cat").value = "";
  document.getElementById("cat_name").value =
    document.getElementById("category").options[
      document.getElementById("category").selectedIndex
    ].textContent;
  document.getElementById("id_cat").value =
    document.getElementById("category").value;
});

//Event listner που προσθέτει νέα κατηγορία στην βάση δεδομένων
document.getElementById("add_new_cat").addEventListener("click", function () {
  if (document.getElementById("new_cat_name").value !== "") {

    //Συλλογή πληροφοριών
    const input = document.getElementById("new_cat_name").value.toLowerCase();

    const check = onload_data.categories.find(
      (cat) => cat.category_name.toLowerCase() === input
    );

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
        new_cat: document.getElementById("new_cat_name").value,
      };

      //Επικοινωνία με τον server για την προσθήκη νέας
      //κατηγορίας
      fetch("/server/admin/warehouse_admin/add_category.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "error") {
            console.error("Server Error:", data.Error);
          } else {
            temp_2 = document.getElementById("cat_selected").value;
            temp_3 = document.getElementById("cat_new").value;
            temp_4 = document.getElementById("category").value;

            //Αννανέβση βάσης δεδομένων 
            fetch("/server/admin/warehouse_admin/database_extract.php")
              .then((jsonResponse) => jsonResponse.json())
              .then((data) => {
                if (data.status === "error") {
                  console.error("Server Error:", data.Error);
                } else {


                  alert("Η κατηγορία προστέθηκε")

                  //Ανανέωση λιστών που περιέχουν τις 
                  //κατηγορίες
                  onload_data = data;
                  categories_select(data);
                  categories_select_product(data);
                  category_select_det(data);
                  categories_select_new(data);

                  document.getElementById("cat_selected").value = temp_2;
                  document.getElementById("cat_new").value = temp_3;
                  document.getElementById("category").value = temp_4;
                }
              })
              .catch((error) => console.error("Error:", error));
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Αυτή η κατηγορία υπάρχει ήδη");
    }
  } else {
    alert("Δώστε ένα όνομα");
  }
});

//Event listener που ενημερώνει την βάση με τα δεδομένα από την 
//online βαση δεδομένων
document.getElementById("online_data").addEventListener("click", function () {
  document.getElementById("online_data").disabled = true;

  //Επικοινωνία με τον server για την ενημέρωση της βάσης δεδομένων
  fetch("/server/admin/warehouse_admin/online_database.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {

        //Ανάκτηση των δεδομένων της βάσης
        fetch("/server/admin/warehouse_admin/database_extract.php")
          .then((jsonResponse) => jsonResponse.json())
          .then((data) => {
            if (data.status === "error") {
              console.error("Server Error:", data.Error);
            } else {

              //Ενημέρωση της σελίδας με τα δεδομένα
              onload_data = data;

              data.categories.forEach(cat => {
                categories_selected.push(cat.id);
              })

              categories_select(data);

              for (var i = 0; i < document.getElementsByClassName("categories").length; i++) {
                document.getElementsByClassName("categories")[i].checked = true;
              }


              items_select(data, categories_selected);
              categories_select_product(data);
              category_select_det(data);
              document.getElementById("detail_select").innerHTML = "";
              document.getElementById("add_new_cat").disabled = false;
              document.getElementById("online_data").disabled = false;
            }
          })
          .catch((error) => console.error("Error:", error));
      }
    })
    .catch((error) => console.error("Error:", error));
});

//Event listener που αλλάζει το όνομα μια κατηγορίας
document.getElementById("cat_name_change").addEventListener("click", function () {

  if (document.getElementById("id_cat").value !== "") {
    if (document.getElementById("cat_name").value !== "") {

      //Συλλογή πληροφοριών της κατηγορίας
      const input = document.getElementById("cat_name").value.toLowerCase();

      const check = onload_data.categories.find(
        (cat) => cat.category_name.toLowerCase() === input
      );

      if (check === undefined) {
        var id = document.getElementById("id_cat").value;
        var name = document.getElementById("cat_name").value;

        const data = {
          id: id,
          new_name: name,
        };

        var current_cat = document.getElementById("category").value;
        var current_cat_2 = document.getElementById("cat_new").value;
        var current_cat_3 = document.getElementById("cat_selected").value;

        //Επικοινωνία με τον server για αλλαγή του ονόματος της
        //κατηγορίας
        fetch("/server/admin/warehouse_admin/update_category.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "error") {
              console.error("Server Error:", data.Error);
            } else {

              //Ενημέρωση του πίνακα ειδών και λιστών
              fetch("/server/admin/warehouse_admin/database_extract.php")
                .then((jsonResponse) => jsonResponse.json())
                .then((data) => {
                  if (data.status === "error") {
                    console.error("Server Error:", data.Error);
                  } else {
                    onload_data = data;
                    categories_select(data);
                    categories_select_product(data);
                    category_select_det(data);
                    categories_select_new(data);
                    items_select(data, categories_selected);
                    document.getElementById("category").value = current_cat;
                    document.getElementById("cat_selected").value = current_cat_3;
                    document.getElementById("cat_new").value = current_cat_2;
                  }
                })
                .catch((error) => console.error("Error:", error));
            }
          })
          .catch((error) => console.error("Error:", error));
      } else {
        alert("Αυτή η κατηγορία υπάρχει ήδη");
      }
    } else {
      alert("Το όνομα δεν μπορεί να είναι κενό");
    }
  } else {
    alert("Επίλεξε μια κατηγορία");
  }
});

//Event listener που διαγράφει μια κατηγορία από την βάση δεδομένων
document.getElementById("cat_name_delete").addEventListener("click", function () {
  if (document.getElementById("id_cat").value !== "") {
    if (document.getElementById("cat_name").value !== "") {

      //Συλλογή δεδομένων
      var id = document.getElementById("id_cat").value;
      var cate_name = onload_data.categories.find(cat => cat.id = id);
      const data = {
        id: id,
      };

      var current_cat = document.getElementById("category").value;
      var current_cat_2 = document.getElementById("cat_new").value;
      var current_cat_3 = document.getElementById("cat_selected").value;


      //Επικοινωνία με τον server για την διαγραφή της κατηγορίας
      fetch("/server/admin/warehouse_admin/delete_category.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "error") {
            console.error("Server Error:", data.Error);
          } else {

            //Eνημέρωση πίνακα ειδών
            fetch("/server/admin/warehouse_admin/database_extract.php")
              .then((jsonResponse) => jsonResponse.json())
              .then((data) => {
                if (data.status === "error") {
                  console.error("Server Error:", data.Error);
                } else {

                  alert("Η κατηγορία διαγράφηκε");

                  onload_data = data;
                  categories_select(data);

                  for (var i = 0; i < document.getElementsByClassName("categories").length; i++) {
                    document.getElementsByClassName("categories")[i].checked = true;
                  }

                  data.categories.forEach(cat => {
                    categories_selected.push(cat.id);
                  })

                  items_select(data, categories_selected);
                  categories_select_product(data);
                  category_select_det(data);
                  categories_select_new(data);


                  if (current_cat !== cate_name.id) {
                    document.getElementById("category").value = current_cat;
                  }
                  if (current_cat_2 !== cate_name.id) {
                    document.getElementById("cat_new").value = current_cat_2;
                  }
                  if (current_cat_3 !== cate_name.id) {
                    document.getElementById("cat_selected").value = current_cat_3;
                  }
                  document.getElementById("id_cat").value = document.getElementById("category").value;

                  const id = data.categories.find(cat_name => cat_name.id = document.getElementById("category").value);
                  document.getElementById("cat_name").value = id.id;

                  
                }
              })
              .catch((error) => console.error("Error:", error));
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Το όνομα δεν μπορεί να είναι κενό");
    }
  } else {
    alert("Επίλεξε μια κατηγορία");
  }
});

//Event listener που προσθέτει ένα νέο είδος στην βάση δεδομένων
document.getElementById("add_product").addEventListener("click", function () {
  if (document.getElementById("name_new").value !== "") {
    const input = document.getElementById("name_new").value.toLowerCase();

    //Συλλογή δεδομένων
    const check = onload_data.items.find(
      (item) => item.name.toLowerCase() === input
    );

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
        category: document.getElementById("cat_new").value,
        name: document.getElementById("name_new").value,
      };

      //Επικοινωνία με τον server για την προσθήκη του νέου είδους
      fetch("/server/admin/warehouse_admin/add_product.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "error") {
            console.error("Server Error:", data.Error);
          } else {

            //Ενημέρωση πίνακα
            fetch("/server/admin/warehouse_admin/database_extract.php")
              .then((jsonResponse) => jsonResponse.json())
              .then((data) => {
                if (data.status === "error") {
                  console.error("Server Error:", data.Error);
                } else {
                  onload_data = data;

                  alert("Το νέο είδος προστέθηκε")

                  document.getElementById("detail_name_text").value = "";
                  document.getElementById("detail_value_text").value = "";
                  document.getElementById("name_new").value = "";
                  document.getElementById("detail_select").innerHTML = "";

                  const product = onload_data.items.find(
                    (item) => parseInt(item.id) === id_check
                  );
                  const category = onload_data.categories.find(
                    (cat_name) => cat_name.id === product.category
                  );

                  document.getElementById("id_selected").value = product.id;
                  document.getElementById("name_selected").value = product.name;

                  for (
                    var i = 0;
                    i < document.getElementById("cat_selected").options.length;
                    i++
                  ) {
                    if (
                      document.getElementById("cat_selected").options[i]
                        .value === category.id
                    ) {
                      document.getElementById("cat_selected").selectedIndex = i;
                      break;
                    }
                  }

                  items_select(data, categories_selected);
                  document.getElementById("quantity_selected").value =
                    product.quantity;
                  item_selected = 1;
                }
              })
              .catch((error) => console.error("Error:", error));
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Αυτό το προιόν υπάρχει ήδη");
    }
  } else {
    alert("Δώστε ένα όνομα");
  }
});

//Event listener που ανανεώνει την ποσότητα ενός είδους
document.getElementById("quantity_button").addEventListener("click", function () {
  if (document.getElementById("quantity_selected").value !== "") {
    if (document.getElementById("quantity_selected").value >= 0) {

      //Συλλογή δεδομένων
      const id = document.getElementById("id_selected").value;
      const quantity = document.getElementById("quantity_selected").value;

      const data = {
        id: id,
        quantity: quantity,
      };

      //Επικοινωνία με τον server για αλλαγή της ποσότητας του είδους
      fetch("/server/admin/warehouse_admin/update_quantity.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "error") {
            console.error("Server Error:", data.Error);
          } else {

            //Ενημέρωση του πίνακα ειδών
            fetch("/server/admin/warehouse_admin/database_extract.php")
              .then((jsonResponse) => jsonResponse.json())
              .then((data) => {
                if (data.status === "error") {
                  console.error("Server Error:", data.Error);
                } else {
                  onload_data = data;
                  items_select(data, categories_selected);
                }
              })
              .catch((error) => console.error("Error:", error));
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Δεν γίνεται να εισάγετε αρνητική τιμή.");
    }
  } else {
    alert("Εισάγετε μια τιμή στην ποσότητα.");
  }
});

//Συνάρτηση εύρεσης του id μιας κατηγορίας
function category_id(data) {
  var list_select = document.getElementById("cat_list");
  var category_select = list_select.options[list_select.selectedIndex].text;
  var category = data.categories.find(
    (category) => category.category_name === category_select
  );
  return category.id;
}

//Συνάρτηση που τοποθετεί τις κατηγορίες ειδών
//σε λίστα
function categories_select(data) {
  const list = document.getElementById("cat_list");

  list.innerHTML = "";

  data.categories.forEach((category) => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      var select_add = document.createElement("input");
      select_add.type = 'checkbox';
      select_add.id = category.id;
      select_add.value = category.id;
      select_add.className = "categories";

      const label = document.createElement('label');
      label.textContent = category.category_name;

      list.appendChild(select_add);
      list.appendChild(label);
    }
  });
}

document.getElementById('change_content').addEventListener('click', function () {
  // Επιλογή όλων των checkboxes
  const checkboxes = document.querySelectorAll('.categories');

  categories_selected = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      categories_selected.push(checkbox.value);
    }
  });

  items_select(onload_data, categories_selected);

});


//Συνάρτηση που τοποθετεί τις κατηγορίες ειδών
//σε λίστα
function categories_select_product(data) {
  const list = document.getElementById("cat_selected");
  list.innerHTML = "";

  data.categories.forEach((category) => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      var select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      select_add.value = category.id;
      list.appendChild(select_add);
    }
  });
}

//Συνάρτηση που τοποθετεί τις κατηγορίες ειδών
//σε λίστα
function category_select_det(data) {
  const list = document.getElementById("category");
  list.innerHTML = "";

  data.categories.forEach((category) => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      var select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      select_add.value = category.id;
      list.appendChild(select_add);
    }
  });
}

//Συνάρτηση που τοποθετεί τις κατηγορίες ειδών
//σε λίστα
function categories_select_new(data) {
  const list = document.getElementById("cat_new");

  list.innerHTML = "";

  data.categories.forEach((category) => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      var select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      select_add.value = category.id;
      list.appendChild(select_add);
    }
  });
}

//Συνάρτηση που τοποθετεί τα είδη στον πίνακα
function items_select(data, selected_cat) {
  const table = document.getElementById("items_table");

  table.innerHTML = "";

  data.items.forEach((item) => {
    selected_cat.forEach(category => {
      if (item.name != "" && item.category === category) {
        const row_table = document.createElement("tr");
        const id_table = document.createElement("td");
        const name_table = document.createElement("td");
        const category_table = document.createElement("td");
        const detail_table = document.createElement("td");
        const item_quantity = document.createElement("td");

        id_table.textContent = item.id;
        name_table.textContent = item.name;
        item_quantity.textContent = item.quantity;
        const category = data.categories.find((category) =>
          category.id === item.category
        );
        category_table.textContent = category.category_name;

        const detail_get = item.details.map((detail) => {
          if (detail.detail_name && detail.detail_value) {
            return `-${detail.detail_name}: ${detail.detail_value}-`;
          } else if (detail.detail_name && detail.detail_value === "") {
            return `${detail.detail_name}:`;
          } else if (detail.detail_name === "" && detail.detail_value) {
            return `---: ${detail.detail_value}`;
          } else {
            return " ";
          }
        });
        detail_table.innerHTML = detail_get.join("<br>");

        row_table.appendChild(id_table);
        row_table.appendChild(name_table);
        row_table.appendChild(category_table);
        row_table.appendChild(detail_table);
        row_table.appendChild(item_quantity);

        table.appendChild(row_table);
      }
    })
  });
}

//Συνάρτηση που ανανεώνει τα radiobutton
function radiobutton_refresh() {
  document.getElementById("detail_select").innerHTML = "";

  const item_id = document.getElementById("id_selected").value;

  const product = onload_data.items.find((item) => item.id === item_id);
  const category = onload_data.categories.find(
    (cat_name) => cat_name.id === product.category
  );

  var flag = 0;

  for (var item of product.details) {
    if (item.detail_name === "" && item.detail_value === "") {
      flag = 1;
    } else {
      flag = 0;
      break;
    }
  }

  if (flag === 0) {

    //Εμφάνιση λεπτομεριών προιόντος
    var i = 0;
    product.details.forEach((item) => {
      const radio_button = document.createElement("input");
      radio_button.type = "radio";
      radio_button.name = "select";
      radio_button.id = "radiobutton_" + i;
      radio_button.value = i;

      const radio_button_label = document.createElement("label");
      radio_button_label.setAttribute("for", "radiobutton_" + i);
      radio_button_label.textContent =
        item.detail_name + ": " + item.detail_value;
      i++;

      document.getElementById("detail_select").appendChild(radio_button);
      document.getElementById("detail_select").appendChild(radio_button_label);
    });

    document.getElementById("id_selected").value = product.id;
    document.getElementById("name_selected").value = product.name;

    for (
      var i = 0;
      i < document.getElementById("cat_selected").options.length;
      i++
    ) {
      if (
        document.getElementById("cat_selected").options[i].value === category.id
      ) {
        document.getElementById("cat_selected").selectedIndex = i;
        break;
      }
    }

    var radio_button = document.getElementsByName("select");

    for (var i = 0; i < radio_button.length; i++) {
      radio_button[i].addEventListener("change", function () {
        if (this.checked) {
          document.getElementById("detail_name_text").value =
            product.details[this.value].detail_name;
          document.getElementById("detail_value_text").value =
            product.details[this.value].detail_value;
        }
      });
    }
    document.getElementById("detail_name_text").value = "";
    document.getElementById("detail_value_text").value = "";
  } else {
    document.getElementById("id_selected").value = product.id;
    document.getElementById("name_selected").value = product.name;

    for (
      var i = 0;
      i < document.getElementById("cat_selected").options.length;
      i++
    ) {
      if (
        document.getElementById("cat_selected").options[i].value === category.id
      ) {
        document.getElementById("cat_selected").selectedIndex = i;
        break;
      }
    }
  }
}

//Έλεγχος για λεπτομέρια που υπάρχει δύο φορές
function duplicate_check() {
  var check = 0;

  if (document.getElementById("radiobutton_0")) {
    var id = document.getElementById("id_selected").value;
    var name = document.getElementById("detail_name_text").value;
    var value = document.getElementById("detail_value_text").value;

    const product = onload_data.items.find((item) => item.id === id);

    product.details.forEach((detail) => {
      if (name === detail.detail_name && value === detail.detail_value) {
        check = 1;
      }
    });
  }

  return check;
}

//Ανέβασμα αρχείου JSON μορφής
function upload_data() {
  const upload_file = document.getElementById("json_file");
  const json_file = upload_file.files[0];

  if (json_file) {
    const json_data = new FormData();
    json_data.append("jsonfile", json_file);

    //Ανέβασμα αρχείου
    fetch("/server/admin/warehouse_admin/file_upload.php", {
      method: "POST",
      body: json_data,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {

          alert("Το αρχείο ανέβηκε");

          fetch("/server/admin/warehouse_admin/database_extract.php")
            .then((jsonResponse) => jsonResponse.json())
            .then((data) => {
              if (data.status === "error") {
                console.error("Server Error:", data.Error);
              } else {
                //Ανανέωση του πίνακα
                categories_select(data);

                data.categories.forEach(cat => {
                  categories_selected.push(cat.id);
                })

                for (var i = 0; i < document.getElementsByClassName("categories").length; i++) {
                  document.getElementsByClassName("categories")[i].checked = true;
                }

                items_select(data, categories_selected);
                categories_select_product(data);
                category_select_det(data);
                categories_select_new(data);
                onload_data = data;
              }
            })
            .catch((error) => {
              console.error(error);
            });

        } else {
          console.error("Error uploading file:", data.message);
          alert("Σφάλμα στο ανέβασμα του αρχείου: " + data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Σφάλμα στο ανέβασμα του αρχείου");
      });
  } else {
    alert("Επιλέξτε ένα αρχείο");
  }
}
