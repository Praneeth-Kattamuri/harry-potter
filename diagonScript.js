let currentPage = 1;
let productsAdded = [];
let balance = 100;

let scoreBalance = 0;
balance = balance + scoreBalance * 10;
const cardsPerPage = 9;
const cardContainer = document.getElementById("cardContainer");



function fetchPotions(page) {
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage - 1;
    return fetch(`http://localhost:3000/potions?start=${startIndex}&end=${endIndex}`)
        .then(response => response.json());
}


const checkoutBtn = document.getElementById("checkout");
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
        window.location = "http://localhost:3000/success";
    });
}

document.addEventListener("DOMContentLoaded", function () {

    cardContainer.addEventListener("click", function (event) {
        if (event.target && event.target.classList.contains("button-55")) {
            event.stopPropagation();
            const button = event.target;
            const card = button.closest(".card");
            const title = card.querySelector(".card-title").textContent;
            const price = card.querySelector(".card-text").textContent;

        }
    });

});


function addCards(cards) {
    cardContainer.innerHTML = '';
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

        const priceDiv = document.createElement("div");
        priceDiv.classList.add("price");

        const price = document.createElement("p");

        const image = document.createElement("img");
        image.src = "image/coins.png";
        image.classList.add("correct-count-icon");

        const text = document.createTextNode("10");
        price.appendChild(text);
        price.appendChild(image);

        priceDiv.appendChild(price);

        const addButton = document.createElement("button");
        addButton.id = "button";
        addButton.classList.add("button-55");
        addButton.textContent = "Add to Cart";
        let flag = balance;
        addButton.addEventListener("click", function () {
            if (balance >= 10) {
                balance -= 10;
                productsAdded.push(product);
                localStorage.setItem('myData', JSON.stringify(productsAdded));
                updateCart();
                updateCircleFill(balance, flag);

            } else {
                openCustomAlert("Insufficient balance!");
            }
        });

        const expandButton = document.createElement("button");
        expandButton.classList.add("expand-button");
        expandButton.textContent = 'Expand';
        expandButton.title = "Expand";
        expandButton.addEventListener("click", function () {

            this.classList.add("card-clicked");
            setTimeout(() => {
                this.classList.remove("card-clicked");
            }, 200);

            const url = `http://localhost:3000/eachPotion?name=${encodeURIComponent(product)}`;

            window.location.href = url;
        });

        cardBodyDiv.appendChild(title);
        cardBodyDiv.appendChild(priceDiv);
        cardBodyDiv.appendChild(addButton);
        cardBodyDiv.appendChild(expandButton);

        cardDiv.appendChild(cardBodyDiv);
        colDiv.appendChild(cardDiv);
        cardContainer.appendChild(colDiv);
    });
}



function updateCart() {
    fetch('http://localhost:3000/addToCartData', {
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

function updateCircleFill(balance, flag) {
    const fillHeight = (balance / flag) * 130;
    document.getElementById("fill").style.height = fillHeight + "px";
}


fetchPotions(currentPage)
    .then(data => {
        addCards(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

document.getElementById('prevPageBtn').addEventListener('click', function () {
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

document.getElementById('nextPageBtn').addEventListener('click', function () {
    currentPage++;
    fetchPotions(currentPage)
        .then(data => {
            addCards(data);
            updatePagination();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            currentPage--;
        });
});

function updatePagination() {
    document.getElementById('currentPage').textContent = currentPage;
}

function openCustomAlert(message) {
    document.getElementById("custom-alert-message").innerText = message;
    document.getElementById("custom-alert").style.display = "block";
}

function closeCustomAlert() {
    document.getElementById("custom-alert").style.display = "none";
}




