
var quizQst;
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
  

    // Get the link element
    const nextPageLink = document.querySelector('.next-page-link');

    // Add event listener for click event
    // nextPageLink.addEventListener('click', function (event) {
    //     event.preventDefault();
    //     console.log('clicked');
        
    //     fetch('/quizData')
    //         .then(response => response.json())
    //         .then(data => displayQuiz(data))
    //         .catch(error => console.error('Error fetching quiz data:', error));
    // });
    document.addEventListener("DOMContentLoaded", function() {
      console.log("loaded");
    fetch('http://localhost:3000/quizData')
    .then(response => response.json())
    .then(data => {
        // console.log(data);  
        quizQst = data;
        displayQuiz(quizQst);
    })
    .catch(error => console.error('Error fetching data:', error));
  });


function displayQuiz(quizData) {
  const quizContainer = document.getElementById('quizContainer');
  console.log(document.getElementById('quizContainer'));
  
  for(let i=0; i<quizData.length; i=i+3){
      const questionDiv = document.createElement('div');
      questionDiv.classList.add('container');
      // console.log(document.getElementById('qContainer'));
  
      // questionDiv.id = 'quizContainer';

      const questionHeader = document.createElement('h4');
      // console.log(document.getElementById('qContainer'));
  
      questionHeader.textContent = quizData[i];
      // console.log(document.getElementById('qContainer'));
  
      questionDiv.appendChild(questionHeader);

      for(let j = 1; j<5;j++){
          const optionInput = document.createElement('input');
          optionInput.type = 'radio';
          optionInput.name = 'quizOption' + j;
          optionInput.value = quizData[i+1][j-1];

          const optionLabel = document.createElement('label');
          optionLabel.textContent = quizData[i+1][j-1];

          const optionParagraph = document.createElement('p');
          optionParagraph.appendChild(optionInput);
          optionParagraph.appendChild(optionLabel);

          questionDiv.appendChild(optionParagraph);
      }

      quizContainer.appendChild(questionDiv);
    }
}