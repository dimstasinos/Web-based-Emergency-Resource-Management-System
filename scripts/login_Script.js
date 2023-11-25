document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Perform client-side validation if needed

  // Submit the form using AJAX
  const formData = new FormData(event.target);
  fetch(event.target.action, {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      // Handle the response from the server (e.g., show a message)
      console.log(data);
  })
  .catch(error => {
      console.error('Error:', error);
  });
});