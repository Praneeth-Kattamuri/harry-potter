let currentPage = 1;
let productsAdded = [];
let balance = 100;
const cardsPerPage = 9;
const cardContainer = document.getElementById("cardContainer");


// Function to fetch potions for the given page
function fetchPotions(page) {
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage - 1;
    return fetch(`http://localhost:3000/potions?start=${startIndex}&end=${endIndex}`)
            .then(response => response.json());
}

// const checkoutBtn = document.getElementById("checkout");
// checkoutBtn.addEventListener("click", function() {
//         fetch('http://localhost:3000/checkout', {
//             method : 'POST',
//             headers : {
//                 'Content-Type' : 'application/JSON'
//             },
//             body : JSON.stringify({
//                 items : [
//                     {id : 1, quanityt : 1},
//                 ]
//             })
//         })
//         .then(res => {
//             if(res.ok) return res.json();
//             return res.json().then(json => Promise.reject(json));
//         })
//         .then(({url}) => {
//             console.log(url)
//             window.location = url;
//         })
//         .catch(error => console.error('Error:', error));
//     });
const checkoutBtn = document.getElementById("checkout");
if(checkoutBtn){
checkoutBtn.addEventListener("click", function() {
  window.location = "success.html";

  
     
    // displayPaymentItems();
  
   

});
}

fetch('http://localhost:3000/cartsData')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data from server:', data);
        productsForCart = data;
        console.log("got the data",productsForCart);
        // Process the data here
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });

   
 

// Function to add cards to the DOM
function addCards(cards) {
    cardContainer.innerHTML = ''; // Clear existing cards
    cards.forEach(product => {
        const colDiv = document.createElement("div");
        colDiv.classList.add("col-md-4", "mb-4");

        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        const cardBodyDiv = document.createElement("div");
        cardBodyDiv.classList.add("card-body");

        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = product;

        const description = document.createElement("p");
        description.classList.add("card-text");
        description.textContent = "Description";

        const price = document.createElement("p");
        price.classList.add("card-text");
        price.textContent = "10$";

        const addButton = document.createElement("button");
        addButton.id = "button";
        addButton.classList.add("button-55");
        addButton.textContent = "Add to Cart";
        addButton.addEventListener("click", function() {
            if (balance >= 10) { 
                balance -= 10;
                productsAdded.push(product);
                localStorage.setItem('myData', JSON.stringify(productsAdded));
                updateCart();
                updateCircleFill();

            } else {
                alert("Insufficient balance!");
            }
        });

        cardBodyDiv.appendChild(title);
        cardBodyDiv.appendChild(description);
        cardBodyDiv.appendChild(price);
        cardBodyDiv.appendChild(addButton);

        cardDiv.appendChild(cardBodyDiv);
        colDiv.appendChild(cardDiv);
        cardContainer.appendChild(colDiv);
    });
}

// Function to update cart data
function updateCart() {
    fetch('http://localhost:3000/cartsData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productsAdded)
    })
    .then(response => {
        console.log('Response from server:', response);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to update circle fill
function updateCircleFill() {
    const fillHeight = (balance / 100) * 130; 
    document.getElementById("fill").style.height = fillHeight + "px";
}

// Fetch initial page of potions and add cards
fetchPotions(currentPage)
    .then(data => {
        addCards(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// Event listener for previous page button
document.getElementById('prevPageBtn').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        fetchPotions(currentPage)
            .then(data => {
                addCards(data);
                updatePagination();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
});

// Event listener for next page button
document.getElementById('nextPageBtn').addEventListener('click', function() {
    currentPage++;
    fetchPotions(currentPage)
        .then(data => {
            addCards(data);
            updatePagination();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            currentPage--; // Roll back current page if fetching fails
        });
});

// Function to update pagination controls
function updatePagination() {
    document.getElementById('currentPage').textContent = currentPage;
}
  

