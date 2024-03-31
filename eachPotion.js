document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const potionName = urlParams.get('name');
    getPotionName(potionName);
});

var imgAlt = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyA0PM7YG9JGnK013loys6lnZeTFuPs3j35A&usqp=CAU";

function getPotionName(potionName) {
    fetch('http://localhost:3000/allPotionsDetails')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            for (const potion in data) {
                if (potion === potionName) {
                    createPotionCard(data[potion]);
                }
            }

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function createPotionCard(potion) {
    const container = document.querySelector('.container');

    const card = document.createElement('div');
    card.classList.add('card');

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
    img.src = potion.image || imgAlt;
    img.classList.add('card-img-top');

    imgContainer.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = potion.name;

    const characteristics = document.createElement('p');
    characteristics.classList.add('card-text');
    characteristics.textContent = `Characteristics: ${potion.characteristics}`;

    const difficulty = document.createElement('p');
    difficulty.classList.add('card-text');
    difficulty.textContent = `Difficulty: ${potion.difficulty}`;

    const effect = document.createElement('p');
    effect.classList.add('card-text');
    effect.textContent = `Effect: ${potion.effect}`;

    const ingredients = document.createElement('p');
    ingredients.classList.add('card-text');
    ingredients.textContent = `Ingredients: ${potion.ingredients}`;

    const wikiLink = document.createElement('a');
    wikiLink.href = potion.wiki;
    wikiLink.textContent = 'Wiki';
    wikiLink.classList.add('btn');
    wikiLink.setAttribute('target', '_blank');

    cardBody.appendChild(title);
    cardBody.appendChild(characteristics);
    cardBody.appendChild(difficulty);
    cardBody.appendChild(effect);
    cardBody.appendChild(ingredients);
    cardBody.appendChild(wikiLink);

    card.appendChild(imgContainer);
    card.appendChild(cardBody);

    container.appendChild(card);
}

