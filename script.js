
var quizQst = [];
let correctAnswersCount = 0;
var productsForCart = [];

  
    const nextPageLink = document.querySelector('.next-page-link');
    let txt = document.getElementById('blockOfText')
    console.log(txt)
    setTimeout(()=> {
    txt.style.display = 'block' 
    }, 2500)
    
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
  setTimeout(() => {
      messageElement.remove();
  }, 2000);
}




