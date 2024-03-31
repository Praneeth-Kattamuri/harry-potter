let correctAnswersCount = 0;
const loader = document.getElementById('loader');
if (loader) {
    loader.style.display = 'block';
}
document.addEventListener("DOMContentLoaded", function () {
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
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
    const quizContainer = document.getElementById('quizContainer');
    let i = 0;
    function showNextQuestion() {
        if (i < quizData.length) {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('container');
            const questionHeader = document.createElement('h4');
            questionHeader.textContent = quizData[i];
            questionDiv.appendChild(questionHeader);
            for (let j = 1; j < 5; j++) {
                const optionButton = document.createElement('button');
                optionButton.type = 'button';
                optionButton.textContent = quizData[i + 1][j - 1];
                optionButton.classList.add('option-button');
                optionButton.setAttribute('data-question', i + 1);
                optionButton.setAttribute('data-option', j + 1);
                optionButton.addEventListener('click', function () {
                    const selectedQuestionIndex = this.textContent;

                    if (selectedQuestionIndex === quizData[i - 1]) {
                        this.style.backgroundColor = 'aquamarine';
                        correctAnswersCount++;
                    } else {
                        this.style.backgroundColor = 'red';
                    }
                    setTimeout(() => {
                        quizContainer.innerHTML = '';
                        if (i < quizData.length - 2) {
                            showNextQuestion();
                        } else {
                            localStorage.setItem('scoreData', JSON.stringify(correctAnswersCount));
                            const thank = document.getElementById('over');
                            quizContainer.style.display = 'none';
                            thank.style.display = 'block';

                            thank.innerHTML = `
            <h1>Quiz Over</h1>
            <p>Congratulations! You have completed the quiz.</p>
            <p><img src="image/coins.png" class="correct-count-icon">${correctAnswersCount * 10}</p>
        `;

                            return;
                        }
                    }, 1000);
                });

                const optionWrapper = document.createElement('div');
                optionWrapper.appendChild(optionButton);
                questionDiv.appendChild(optionButton);
            }

            quizContainer.appendChild(questionDiv);
            i = i + 3;
        }
    }
    if (i >= quizData.length - 3) {
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
    fetch('http://localhost:3000/submitQuiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalCorrectAnswers }),
    })
        .then(response => response.json())
        .then(data => {
        })
        .catch(error => console.error('Error submitting quiz:', error));
}


