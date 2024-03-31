var studentsDetails = [];
var visibleCards = 16;
var loadedCards = 0;

document.addEventListener("DOMContentLoaded", function () {
    const nameList = document.getElementById('nameList');

    function loadCards(startIndex, endIndex) {
        for (let i = startIndex; i < endIndex; i++) {
            const student = studentsDetails[i];

            const colDiv = document.createElement("div");
            colDiv.classList.add("col-md-3", "mb-4");

            const cardDiv = document.createElement("div");
            cardDiv.classList.add("card");

            const cardBodyDiv = document.createElement("div");
            cardBodyDiv.classList.add("card-body");

            const title = document.createElement("h5");
            title.classList.add("card-title");
            title.textContent = student[0];

            const house = document.createElement("p");
            house.classList.add("card-text");
            house.textContent = "House: " + student[1];

            const image = document.createElement('img');
            image.classList.add("card-img-top");
            if (student[2]) {
                image.src = student[2];
            } else {
                image.src = 'image/unknown.jpeg';
            }
            image.alt = student[0];
            image.loading = "lazy";

            cardBodyDiv.appendChild(title);
            cardBodyDiv.appendChild(house);
            cardDiv.appendChild(image);
            cardDiv.appendChild(cardBodyDiv);
            colDiv.appendChild(cardDiv);
            nameList.appendChild(colDiv);

            loadedCards++;
        }
    }


    fetch('http://localhost:3000/characters')
        .then(response => response.json())
        .then(namesData => {
            studentsDetails = namesData;
            loadCards(0, visibleCards);
        })
        .catch(error => console.error('Error fetching names:', error));


    window.addEventListener('scroll', function () {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight && loadedCards < studentsDetails.length) {
            const remainingCards = studentsDetails.length - loadedCards;
            const cardsToLoad = Math.min(remainingCards, visibleCards);
            loadCards(loadedCards, loadedCards + cardsToLoad);
        }
    });
});
