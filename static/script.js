document.addEventListener("DOMContentLoaded", function() {
    const input = document.getElementById("university-name");
    const suggestionsBox = document.getElementById("autocomplete-suggestions");
  
    input.addEventListener("input", async function() {
      const query = input.value;
  
      if (query.length < 3) {
        suggestionsBox.style.display = "none";
        return;
      }
  
      // Fetch autocomplete suggestions from OpenAlex API
      const response = await fetch(`https://api.openalex.org/autocomplete/institutions?q=${query}`);
      const data = await response.json();
  
      // Clear previous suggestions
      suggestionsBox.innerHTML = '';
  
      if (data.results.length > 0) {
        suggestionsBox.style.display = "block";
  
        // Populate suggestions
        data.results.forEach(item => {
          const suggestionItem = document.createElement("div");
          suggestionItem.classList.add("suggestion-item");
          suggestionItem.textContent = item.display_name;
          suggestionItem.dataset.institutionId = item.id;  // Store institution ID
  
          // When a suggestion is clicked, fill in the input and hide suggestions
          suggestionItem.addEventListener("click", function() {
            input.value = item.display_name;                   // Fill input with selected name
            input.dataset.selectedInstitutionId = item.id;     // Store selected ID in input data attribute
            document.getElementById("institution-id").value = item.id;  // Set hidden field value to institution ID
            suggestionsBox.style.display = "none";             // Hide suggestions box
          });
  
          suggestionsBox.appendChild(suggestionItem);
        });
      } else {
        suggestionsBox.style.display = "none";
      }
    });
  
    // Hide suggestions when clicking outside the input box
    document.addEventListener("click", function(event) {
      if (event.target !== input) {
        suggestionsBox.style.display = "none";
      }
    });
  });
  