

// Fetch the array of names from the server
fetch('http://localhost:3000/names')
  .then(response => response.json())
  .then(names => {
    // Get the ul element by its id
    const nameList = document.getElementById('nameList');

    // Loop through the array of names and create list items
    names.forEach(name => {
      const listItem = document.createElement('li');
      listItem.textContent = name;
      nameList.appendChild(listItem); // Append list item to the ul element
    });
  })
  .catch(error => console.error('Error fetching names:', error));
  