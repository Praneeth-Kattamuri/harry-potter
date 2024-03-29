// Retrieve stored data from localStorage
const paymentData = JSON.parse(localStorage.getItem('myData'));
var allIngredients = [];
const cardContainer = document.getElementById("container");
const paymentList = document.getElementById('paymentList');
var potionsToDisplay = ['potion1'];

// Function to display payment items
function displayPaymentItems() {
    console.log("into items ",paymentData);
    

    if (paymentList && paymentData && paymentData) {
        paymentList.innerHTML = '';
        console.log("potions to display",potionsToDisplay);
        // Loop through the paymentData items array and add each item to the list
        potionsToDisplay.forEach(item => {
            const card = createPaymentCard(item);
            console.log(card);
            // paymentList.appendChild(card);
        });
    }
}

function getAllIngredients() {
    fetch('http://localhost:3000/allIngredients')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // console.log('Data from server:', data);
        allIngredients = data;
        // console.log("got the data",productsForCart);
        // Process the data here
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
    potionsToDisplay.push(findSimilarPotions(paymentData,allIngredients));
    displayPaymentItems();
}

// Function to create a card element for a payment item
function createPaymentCard(product) {
    const colDiv = document.createElement("div");
            colDiv.classList.add("col-md-4", "mb-4");
    
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("card2");
    
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
            cardBodyDiv.appendChild(title);
            cardBodyDiv.appendChild(description);
            cardBodyDiv.appendChild(price);
    
            cardDiv.appendChild(cardBodyDiv);
            colDiv.appendChild(cardDiv);
            paymentList.appendChild(colDiv);

    return colDiv;
}

function findSimilarPotions(potionNames, allIngredients) {
    const similarPotions = [];

    potionNames.forEach(potionName => {
        // const similarPotions = [];

        // Find the ingredients of the given potion
        const potionIngredients = allIngredients.find(entry => entry.potionSlug === potionName)?.ingredients;

        if (potionIngredients) {
            // Iterate through all other potions to find similar ingredients
            allIngredients.forEach(ingredientObj => {
                if (ingredientObj.ingredients && ingredientObj.potionSlug !== potionName) {
                    const ingredients = ingredientObj.ingredients.split(',').map(ingredient => ingredient.trim());
                    // Check if there are common ingredients
                    const commonIngredients = ingredients.filter(ingredient => potionIngredients.includes(ingredient));
                    if (commonIngredients.length > 0) {
                        similarPotions.push(ingredientObj.potionSlug);
                    }
                }
            });
        }

        // similarPotionsMap[potionName] = similarPotions;
    });

    return similarPotions;
}


// Call the displayPaymentItems function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', getAllIngredients);
