document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('autocomplete-input');
  var suggestionsContainer = document.getElementById('autocomplete-suggestions');

  input.addEventListener('input', function() {
      var inputValue = this.value;
      suggestionsContainer.innerHTML = '';
      if (!inputValue) {
          suggestionsContainer.style.display = 'none';
          return;
      }

      // Example data - replace with actual data source
      var suggestions = ['Apple', 'Banana', 'Cherry', 'Date', 'Grape', 'Lemon', 'Mango'];
      suggestions.filter(function(item) {
          return item.toLowerCase().startsWith(inputValue.toLowerCase());
      }).forEach(function(suggestedItem) {
          var div = document.createElement('div');
          div.innerHTML = suggestedItem;
          div.addEventListener('click', function() {
              input.value = suggestedItem;
              suggestionsContainer.style.display = 'none';
          });
          suggestionsContainer.appendChild(div);
      });

      suggestionsContainer.style.display = suggestionsContainer.children.length ? 'block' : 'none';
    });

  document.addEventListener('click', function(e) {
      if (e.target !== input) {
          suggestionsContainer.style.display = 'none';
      }
  });
});
