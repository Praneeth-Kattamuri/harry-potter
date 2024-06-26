
const paymentData = JSON.parse(localStorage.getItem('myData'));
var allIngredients = [];
const cardContainer = document.getElementById("container");
const paymentList = document.getElementById('paymentList');
var potionsToDisplay = ['ageing-potion'];

function displayPaymentItems() {


    if (paymentList && paymentData && paymentData) {
        paymentList.innerHTML = '';
        potionsToDisplay.forEach(item => {
            const card = createPaymentCard(item);
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
            allIngredients = data;
            findSimilarPotions(paymentData, allIngredients);
            displayPaymentItems();
        })
        .catch(error => {
        });

}

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

    const image = document.createElement("img");
    image.src = "image/coins.png";
    image.classList.add("correct-count-icon");

    const price = document.createElement("p");
    price.classList.add("card-text");
    price.textContent = "10";
    price.appendChild(image);

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
    // cardBodyDiv.appendChild(description);
    cardBodyDiv.appendChild(price); 
    cardBodyDiv.appendChild(expandButton);

    cardDiv.appendChild(cardBodyDiv);
    colDiv.appendChild(cardDiv);
    paymentList.appendChild(colDiv);

    return colDiv;
}

function findSimilarPotions(potionNames, allIngredients) {
    const similarPotions = [];

    potionNames.forEach(potionName => {
        const potionIngredients = allIngredients.find(entry => entry.potionSlug === potionName)?.ingredients;
        if (potionIngredients) {
            allIngredients.forEach(ingredientObj => {
                if (ingredientObj.ingredients && !potionNames.includes(ingredientObj.potionSlug)) {
                    const ingredients = ingredientObj.ingredients.split(',').map(ingredient => ingredient.trim());
                    const commonIngredients = ingredients.filter(ingredient => potionIngredients.includes(ingredient));

                    if (commonIngredients.length > 0 && !similarPotions.includes(ingredientObj.potionSlug)) {
                        similarPotions.push(ingredientObj.potionSlug);
                    }
                }
            });
        }

    });
    similarPotions.forEach(potion => {
        potionsToDisplay.push(potion);
    })

    return similarPotions;
}



document.addEventListener('DOMContentLoaded', getAllIngredients);
if (typeof module === 'object') {
    module.exports = findSimilarPotions;
}
