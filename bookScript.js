fetch('http://localhost:3000/names')
  .then(response => response.json())
  .then(names => {

    const nameList = document.getElementById('nameList');
    names.forEach(name => {
      const listItem = document.createElement('li');
      listItem.textContent = name;
      nameList.appendChild(listItem); 
    });
  })
  .catch(error => console.error('Error fetching names:', error));