
var quizQst = [];
let correctAnswersCount = 0;
var productsForCart = [];

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
      let txt = document.getElementById('blockOfText')
console.log(txt)
setTimeout(()=> {
  txt.style.display = 'block' // after timeout show img
}, 2500)
const addToCartButtons = document.querySelectorAll(".button-55");
addToCartButtons.addEventListener("click", function() {
  const card = this.closest(".card");
  const title = card.querySelector(".card-title").textContent;
  const price = card.querySelector(".card-text").textContent;
  // const item = {
  //     name: title,
  //     price: price
  // };
  console.log(title);
  // addToCart(item);
});
      const loader = document.getElementById('loader');
      if(loader){
      loader.style.display = 'block';
      console.log("loaded");
    fetch('http://localhost:3000/quizData')
    .then(response => response.json())
    .then(data => {
          const quizContainer = document.getElementById('quizContainer');  
        quizContainer.style.display = 'block';
        quizQst = data;
        displayQuiz(quizQst);
        // quizContainer.style.display = 'none';
    })
    .catch(error => console.error('Error fetching data:', error));
  }
  });
const reload = document.getElementById("reloadButton"); 
if(reload){
reload.addEventListener("click", function() {
    location.reload(); // Reload the page when the button is clicked
});
}



function displayQuiz(quizData) {
  console.log("1");
  const loader = document.getElementById('loader');
    loader.style.display = 'block';
  // console.log("param len-",quizData);
  const quizContainer = document.getElementById('quizContainer');
  console.log(document.getElementById('quizContainer'));
  let i = 0;
  function showNextQuestion() {
    console.log("i",i);
  if( i<quizData.length){
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
          // const optionInput = document.createElement('input');
          const optionButton = document.createElement('button');
          optionButton.type = 'button';
          optionButton.textContent = quizData[i+1][j-1];
          optionButton.classList.add('option-button');
            optionButton.setAttribute('data-question', i+1);
            optionButton.setAttribute('data-option', j+1);

          // optionInput.type = 'radio';
          // optionInput.name = 'quizOption' + j;
          // optionInput.value = quizData[i+1][j-1];

          // const optionLabel = document.createElement('label');
          // optionLabel.textContent = quizData[i+1][j-1];

          // const optionParagraph = document.createElement('p');
          // optionParagraph.appendChild(optionInput);
          // optionParagraph.appendChild(optionLabel);
          optionButton.addEventListener('click', function() {
            const selectedQuestionIndex = this.textContent;
            // const selectedOptionIndex = parseInt(this.getAttribute('data-option'));

            // Handle the selected option here, e.g., store it in a variable
            console.log('Selected question:', selectedQuestionIndex);
            if (selectedQuestionIndex == quizData[i + 2]) {
              this.style.backgroundColor = 'aquamarine';
              correctAnswersCount++;
            
              // If the answer is correct, display a floating message saying "Correct answer"
              // displayMessage('Correct answer');
          } else {
            this.style.backgroundColor = 'red';
              // If the answer is wrong, display a floating message saying "Wrong answer"
              // displayMessage('Wrong answer');
          }
            // console.log('Selected option:', selectedOptionIndex);

            setTimeout(() => {
          quizContainer.innerHTML = ''; // Clear previous question
          if(i < quizData.length-2){
            console.log("2");
          showNextQuestion();
          } else {
            const thank = document.getElementById('over');
            console.log(thank);
            const correctAnswersCountDisplay = document.getElementById('correctAnswersCountDisplay');
      correctAnswersCountDisplay.textContent = 'Total Correct Answers: ' + totalCorrectAnswers;
            thank.style.display = 'block';
            quizContainer.style.display = 'none';
            // sendTotalCorrectAnswers(correctAnswersCount);
            
            
            return; 
          }
        }, 1000);
        });

        const optionWrapper = document.createElement('div');
        optionWrapper.appendChild(optionButton);
          questionDiv.appendChild(optionButton);
      }

      quizContainer.appendChild(questionDiv);
      console.log("3");
      i=i+3;
    }
}
console.log("4");
if (i >= quizData.length-3){ 
  quizContainer.style.display = 'none';

  sendTotalCorrectAnswers(correctAnswersCount);
  
  return; 
} else {
showNextQuestion();
}
loader.style.display = 'none';
}

function displayMessage(messageText) {
  console.log(messageText);
  // Create a message element
  const messageElement = document.createElement('div');
  messageElement.textContent = messageText;
  messageElement.classList.add('floating-message');

  // Append the message element to the document body
  document.body.appendChild(messageElement);
  setTimeout(() => {
    messageElement.classList.add('animate-floating');
}, 100);

  // Remove the message after a certain delay (e.g., 2 seconds)
  setTimeout(() => {
      messageElement.remove();
  }, 2000);
}



function sendTotalCorrectAnswers(totalCorrectAnswers) {
  quizContainer.style.display = 'none';
  console.log("into post call")
  fetch('http://localhost:3000/submitQuiz', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ totalCorrectAnswers }),
  })
  .then(response => response.json())
  .then(data => {
      console.log('Total correct answers submitted:', totalCorrectAnswers);
      console.log('Server response:', data);
  })
  .catch(error => console.error('Error submitting quiz:', error));
}



