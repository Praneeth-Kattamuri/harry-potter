const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51OJkayGuq2pJVYHIQTvwbgDFlQaZrXNDqrFRzJ54TyFBKtQPuoXqMemM2RogwiPPgmxE4azkDjnh13UUThy75KiO0095Ds3j41');

const app = express();

app.use(express.static('js'));
app.set('view engine', 'ejs');
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
var array = [];
var bookSummary = new Map();
var bookIds = [];
var chapters = [];
var chaptersNames = [];
var characters = [];
var characterHouse = [];
var qoutes = [];
var quoteCharacters = [];
var quoteCharacterSet = new Set();
var spells = [];
var spellsNames = [];
var spellQuestions = [];
var characterQuestions = [];
var quoteQuestions = [];
var chapterQuestions = [];
var requestData = [];
var potionsWithIngredients = [];
var houses = ['Slytherin', 'Gryffindor', 'Hufflepuff', 'Ravenclaw'];
const cachedData = {};
var studentsDetails = [];
var allPotionDetails = {};
app.use(express.static('public'));
app.get('/admittanceStyle.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/admittanceStyle.css');
});

app.get('/bookScript.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/bookScript.js');
});

app.get('/diagonStyle.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/diagonStyle.css');
});

app.get('/diagonScript.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/diagonScript.js');
});

app.get('/eachPotion.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/eachPotion.css');
});

app.get('/eachPotion.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/eachPotion.js');
});

app.get('/style.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/style.css');
});

app.get('/script.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/script.js');
});

app.get('/owlsStyle.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/owlsStyle.css');
});

app.get('/owlsScript.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/owlsScript.js');
});

app.get('/payment.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/payment.css');
});

app.get('/successScript.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/successScript.js');
});




app.get('/fonts/magic-school-two.ttf', (req, res) => {
    res.setHeader('Content-Type', 'font/ttf');
    res.sendFile(__dirname + '/fonts/magic-school-two.ttf');
});
const path2 = require('path');

app.get('/:type/:filename', (req, res) => {
    const { type, filename } = req.params;
    const fileExtension = path2.extname(filename);

    let contentType = '';

    switch (fileExtension) {
        case 'css':
            contentType = 'text/css';
            break;
        case 'js':
            contentType = 'text/javascript';
            break;
        case 'ttf':
            contentType = 'font/ttf';
            break;
        case 'png':
            contentType = 'image/png';
            break;
        case 'jpeg':
        case 'jpg':
            contentType = 'image/jpeg';
            break;
        default:
            contentType = 'application/octet-stream';
    }
    res.setHeader('Content-Type', contentType);

    res.sendFile(path2.join(__dirname, type, filename));
});


app.get('/book', (req, res) => {
    const studentsDetails = [];

    res.render('bookOfAdmittance', { studentsDetails });
});

app.get('/diagon_alley', (req, res) => {
    res.render('diagonAlley');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/owls', (req, res) => {
    res.render('owls');
});

app.get('/success', (req, res) => {
    res.render('success');
});

app.get('/eachPotion', (req, res) => {
    const name = req.query.name;


    res.render('eachPotion', { name: name });
});


app.get('/potions', async (req, res) => {
    try {
        const { start = 0 } = req.query;
        const end = parseInt(start) + 9;
        if (cachedData[start]) {
            return res.json(cachedData[start]);
        }
        const response = await axios.get('https://api.potterdb.com/v1/potions');
        const allPotions = response.data.data.map(potion => potion.attributes.slug);
        response.data.data.forEach((potion) => {
            allPotionDetails[potion.attributes.slug] = potion.attributes;
        })
        potionsWithIngredients = response.data.data.map(potion => {
            return {
                potionSlug: potion.attributes.slug,
                ingredients: potion.attributes.ingredients
            };
        });
        const potionsToSend = allPotions.slice(start, end);
        cachedData[start] = potionsToSend;

        res.json(potionsToSend);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});


app.get('/books', async (req, res) => {
    try {
        const response = await axios.get('https://api.potterdb.com/v1/books');
        response.data.data.forEach(book => {

            bookSummary.set(book.attributes.title, book.attributes.summary);
            bookIds.push(book.id);
        });

        res.json(bookIds);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.get('/spells', async (req, res) => {
    try {
        const response = await axios.get('https://api.potterdb.com/v1/spells');
        response.data.data.forEach(spell => {
            spellsNames.push(spell.attributes.slug);
            spells.push(spell.attributes.effect);

        });

        res.json(spells);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    spellsQuiz();
});



app.get('/chapters', async (req, res) => {
    try {
        chapters = [];
        chaptersNames = [];
        const response = await axios.get('https://api.potterdb.com/v1/books/' + bookIds[0] + '/chapters');
        response.data.data.forEach(chapter => {
            const summary = chapter.attributes.summary
            if (summary != null && summary != "") {
                chapters.push(summary);
                chaptersNames.push(chapter.attributes.slug);
            }

        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    chapterQuiz();
});

app.get('/characters', async (req, res) => {
    try {
        characters = [];
        characterHouse = [];
        const response = await axios.get('https://potterhead-api.vercel.app/api/characters');
        let i = 0;
        response.data.forEach(character => {
            if (character.house != '') {
                studentsDetails.push([]);
                studentsDetails[i].push(character.name);
                studentsDetails[i].push(character.house);
                studentsDetails[i].push(character.image);
                i++;
            }
        });
        res.json(studentsDetails);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    characterQuiz();
});

app.post('/submitQuiz', (req, res) => {
    const totalCorrectAnswers = req.body.totalCorrectAnswers;
    res.json({ message: 'Quiz results received successfully.' });
});

app.post('/addToCartData', (req, res) => {
    requestData = req.body;
    res.status(200).send('Data received successfully!');
});



app.get('/cartData', async (req, res) => {
    res.json(requestData);
});

app.get('/allIngredients', async (req, res) => {
    res.json(potionsWithIngredients);
});


app.get('/names', async (req, res) => {
    res.json(studentsDetails);
});

app.get('/houses', async (req, res) => {
    res.json(characterHouse);
});

app.get('/allPotionsDetails', async (req, res) => {
    res.json(allPotionDetails);
});



const your_domain = 'http://localhost:3000';
app.post('/checkout', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: requestData.map(item => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item,
                        },
                        unit_amount: 0,
                    },
                    quantity: 1,
                };
            }),
            success_url: 'http://localhost:3002/success.html',
            cancel_url: 'http://localhost:3002/failed',
        });
        res.json({ url: session.url })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

app.get('/quizData', async (req, res) => {

    try {
        try {
            const response = await axios.get('https://potterhead-api.vercel.app/api/characters');
            response.data.forEach(character => {
                if (character.house != '') {
                    characters.push(character.name);
                    characterHouse.push(character.house);
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching data' });
        }
        var charq = await characterQuiz();

        const booksResponse = await axios.get('https://api.potterdb.com/v1/books');
        const bookIds = booksResponse.data.data.map(book => book.id);
        const response = await axios.get('https://api.potterdb.com/v1/books/' + bookIds[0] + '/chapters');
        response.data.data.forEach(chapter => {
            const summary = chapter.attributes.summary
            if (summary != null && summary != "") {
                chapters.push(summary);
                chaptersNames.push(chapter.attributes.slug);
            }

        });
        var q1 = await chapterQuiz();

        try {
            const response = await axios.get('https://api.potterdb.com/v1/spells');
            response.data.data.forEach(spell => {
                spellsNames.push(spell.attributes.slug);
                spells.push(spell.attributes.effect);

            });

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching data' });
        }
        var q3 = await spellsQuiz();

        try {
            let i = 0;
            while (i < 5) {
                const response = await axios.get('https://api.portkey.uk/quote');
                if (!quoteCharacterSet.has(response.data.speaker)) {
                    qoutes.push(response.data.quote);
                    quoteCharacters.push(response.data.speaker);
                    quoteCharacterSet.add(response.data.speaker);
                    i += 1;
                }
            }
            var q2 = await quotesQuiz();
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching data' });
        }


    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }

    res.send(q3.concat(q2.concat(q1.concat(charq))));

});

app.get('/qoutes', async (req, res) => {
    try {
        let i = 0;
        while (i < 5) {
            const response = await axios.get('https://api.portkey.uk/quote');
            if (!quoteCharacterSet.has(response.data.speaker)) {
                qoutes.push(response.data.quote);
                quoteCharacters.push(response.data.speaker);
                quoteCharacterSet.add(response.data.speaker);
                i += 1;
            }
        }
        var q = await quotesQuiz();
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    res.send(q);
});


app.listen(port, () => {
});


async function fetchPotionsData() {
    try {
        const response = await axios.get('https://api.potterdb.com/v1/potions');

        const potionNames = response.data.data.map(potion => potion.attributes.name);

    } catch (error) {
    }
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function spellsQuiz() {

    question = "What is the spell that ";
    let i = 1;
    while (i < 5) {
        const randomNumber = getRandomNumber(1, spellsNames.length - 3);
        let sample = [];
        spellQuestions.push(question + spells[randomNumber]);
        sample.push(spellsNames[randomNumber]);
        sample.push(spellsNames[randomNumber + 1]);
        sample.push(spellsNames[randomNumber + 2]);
        sample.push(spellsNames[randomNumber + 3]);
        sample = shuffleArray(sample);
        spellQuestions.push(sample);
        spellQuestions.push(spellsNames[randomNumber]);

        i += 1;
    }
    return spellQuestions;

}
function characterQuiz() {

    question = "Which house does ";
    let i = 1;
    characterQuestions = [];
    while (i < 4) {
        const randomNumber = getRandomNumber(1, characters.length - 3);
        let sample = [];
        characterQuestions.push(question + characters[randomNumber] + " belong to?");
        sample.push(houses[0]);
        sample.push(houses[1]);
        sample.push(houses[2]);
        sample.push(houses[3]);
        sample = shuffleArray(sample);
        characterQuestions.push(sample);
        characterQuestions.push(characterHouse[randomNumber]);

        i += 1;
    }
    return characterQuestions;

}
function quotesQuiz() {

    quoteQuestions = [];
    question = " was said by whom? ";
    const randomNumber = getRandomNumber(1, qoutes.length);

    let i = 0;
    while (i < 2) {
        let sample = [];
        quoteQuestions.push(qoutes[i] + question);
        sample.push(quoteCharacters[0]);
        sample.push(quoteCharacters[1]);
        sample.push(quoteCharacters[2]);
        sample.push(quoteCharacters[3]);
        sample = shuffleArray(sample);
        quoteQuestions.push(sample);
        quoteQuestions.push(quoteCharacters[i]);
        i += 1;
    }
    return quoteQuestions;

}
function chapterQuiz() {

    question = " what chapter is this from?";
    let i = 1;
    chapterQuestions = [];
    while (i < 2) {
        const randomNumber = getRandomNumber(1, chaptersNames.length - 3);
        let sample = [];
        chapterQuestions.push(chapters[randomNumber] + question);
        sample.push(chaptersNames[randomNumber]);
        sample.push(chaptersNames[randomNumber + 1]);
        sample.push(chaptersNames[randomNumber + 2]);
        sample.push(chaptersNames[randomNumber + 3]);
        sample = shuffleArray(sample);
        chapterQuestions.push(sample);
        chapterQuestions.push(chaptersNames[randomNumber]);

        i += 1;
    }
    return chapterQuestions;

}