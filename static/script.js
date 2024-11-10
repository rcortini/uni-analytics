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
    let inPageButtons=[...document.getElementsByClassName("loadData-js")];
    inPageButtons.forEach(e=>e.addEventListener("click",loadData));
  });
  
let loadData = async function(){
	const institutionId = document.getElementById("institution-id").value;
	const response = await fetch("https://api.openalex.org/works?filter=institutions.id:"+institutionId+"&group_by=publication_year&sort=key");
	const json = await response.json();
	const resultDiv = document.getElementById("result");
	let publicationsPerYear= json.group_by;
	publicationsPerYear=publicationsPerYear.filter(e=>e.key>="2000"&&e.key<"2024")
	const xValues=publicationsPerYear.map(e=>e.key);//.sort();
	const yValues=publicationsPerYear.map(e=>e.count);
	const chart = new Chart("result",{
		type:"line",
		data:{
			labels:xValues,
			datasets: [{
				backgroundColor:"rgba(255,255,255,0.0)",
				borderColor: "rgba(0,0,255,1.0)",
				data: yValues
			}]
		},
		options:{
			legend:{display:false}
		}
	});
}
