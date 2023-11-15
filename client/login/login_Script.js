function submitForm() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // You can perform validation here before sending the data to the server

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/login', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
              window.location.href = '/dashboard'; // Redirect to the dashboard on successful login
          } else {
              document.getElementById('error-message').innerText = data.message;
          }
      }
  };
  const requestBody = JSON.stringify({ username, password });
  xhr.send(requestBody);
}
