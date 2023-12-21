var onload_data;


document.getElementById("registerButton").addEventListener('click', function () {

    f_name = document.getElementById("fname").value;
    l_name = document.getElementById("lname").value;
    phone_number = document.getElementById("phone").value;
    username = document.getElementById("user").value;
    password = document.getElementById("pass").value;

    const data = {
        f_name: f_name,
        l_name: l_name,
        phone_nummber: phone_number,
        username: username,
        password: password
    };

    console.log(data);
    fetch('/server/registerpage/register_page.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then((data) => {
            if (data.status === "error") {
                console.error("Server Error:", data.Error);
            } 
        })

}
);