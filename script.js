
var quizQst = [];
let correctAnswersCount = 0;
var productsForCart = [];


const nextPageLink = document.querySelector('.next-page-link');


function displayMessage(messageText) {
  const messageElement = document.createElement('div');
  messageElement.textContent = messageText;
  messageElement.classList.add('floating-message');

  document.body.appendChild(messageElement);
  setTimeout(() => {
    messageElement.classList.add('animate-floating');
  }, 100);
  setTimeout(() => {
    messageElement.remove();
  }, 2000);
}




