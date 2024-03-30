let correctAnswersCount = 0;
const loader = document.getElementById('loader');
if(loader){
loader.style.display = 'block';
console.log("loaded");
}
document.addEventListener("DOMContentLoaded", function() {
fetch('http://localhost:3000/quizData')
.then(response => response.json())
.then(data => {
    const quizContainer = document.getElementById('quizContainer');  
  quizContainer.style.display = 'block';
  quizQst = data;
  displayQuiz(quizQst);
})
.catch(error => console.error('Error fetching data:', error));

});


function displayQuiz(quizData) {
    console.log("1");
    const loader = document.getElementById('loader');
      loader.style.display = 'block';
    const quizContainer = document.getElementById('quizContainer');
    console.log(document.getElementById('quizContainer'));
    let i = 0;
    function showNextQuestion() {
      console.log("i",i);
    if( i<quizData.length){
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('container');
        const questionHeader = document.createElement('h4');
        questionHeader.textContent = quizData[i];
        questionDiv.appendChild(questionHeader);
        for(let j = 1; j<5;j++){
            const optionButton = document.createElement('button');
            optionButton.type = 'button';
            optionButton.textContent = quizData[i+1][j-1];
            optionButton.classList.add('option-button');
              optionButton.setAttribute('data-question', i+1);
              optionButton.setAttribute('data-option', j+1);
            optionButton.addEventListener('click', function() {
              const selectedQuestionIndex = this.textContent;
              console.log('Selected question:', selectedQuestionIndex);
              if (selectedQuestionIndex == quizData[i + 2]) {
                this.style.backgroundColor = 'aquamarine';
                correctAnswersCount++;
            } else {
              this.style.backgroundColor = 'red';
            }
              setTimeout(() => {
            quizContainer.innerHTML = ''; 
            if(i < quizData.length-2){
              console.log("2");
            showNextQuestion();
            } else {
              const thank = document.getElementById('over');
              console.log(thank);
            //   const correctAnswersCountDisplay = document.getElementById('correctAnswersCountDisplay');
        // correctAnswersCountDisplay.textContent = 'Total Correct Answers: ' + correctAnswersCount;
              thank.style.display = 'block';
              quizContainer.style.display = 'none';
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

  const reload = document.getElementById("reloadButton"); 
if(reload){
reload.addEventListener("click", function() {
location.reload(); 
});
}