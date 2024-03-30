const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51OJkayGuq2pJVYHIQTvwbgDFlQaZrXNDqrFRzJ54TyFBKtQPuoXqMemM2RogwiPPgmxE4azkDjnh13UUThy75KiO0095Ds3j41');

const app = express();
app.use(express.static('harry-potter'));
app.listen(3002, () => {
    console.log('Server is running on port 3000');
});
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
var houses = ['Slytherin','Gryffindor','Hufflepuff','Ravenclaw'];
const cachedData = {}; 

app.get('/potions', async (req, res) => {
    try {
        const { start = 0 } = req.query;
        const end = parseInt(start) + 9;
        if (cachedData[start]) {
            console.log('Sending cached data for start:', start);
            return res.json(cachedData[start]);
        }
        const response = await axios.get('https://api.potterdb.com/v1/potions');
        const allPotions = response.data.data.map(potion => potion.attributes.slug);
        potionsWithIngredients = response.data.data.map(potion => {
            return {
                potionSlug: potion.attributes.slug,
                ingredients: potion.attributes.ingredients
            };
        });
        console.log(potionsWithIngredients);
        const potionsToSend = allPotions.slice(start, end);
        cachedData[start] = potionsToSend;

        console.log('Sending data for start:', start);
        res.json(potionsToSend);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});


app.get('/books', async (req, res) => {
    try {
        const response = await axios.get('https://api.potterdb.com/v1/books');
        response.data.data.forEach(book => {
           
            bookSummary.set(book.attributes.title,book.attributes.summary);
            bookIds.push(book.id);
          });
          console.log(bookIds); 
          
        res.json(bookIds); 
    } catch (error) {
        console.error('Error fetching data:', error);
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
        console.log(spells);

        res.json(spells); 
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    spellsQuiz();
});



app.get('/chapters', async (req, res) => {
    try {
        chapters = [];
        chaptersNames = [];
            const response = await axios.get('https://api.potterdb.com/v1/books/'+bookIds[0]+'/chapters');
            response.data.data.forEach(chapter => {
                const summary = chapter.attributes.summary
            if(summary != null && summary != "" ){
            chapters.push(summary);
            chaptersNames.push(chapter.attributes.slug);
            }
            
            });
        console.log(chapters.length);
        console.log(chaptersNames.length);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    chapterQuiz();
});

app.get('/characters', async (req, res) => {
    try {
        characters = [];
        characterHouse = [];
        const response = await axios.get('https://potterhead-api.vercel.app/api/characters');
        response.data.forEach(character => {
            if(character.house != ''){
            characters.push(character.name);
            characterHouse.push(character.house);
            }
          });
        console.log(characters.length);
        console.log(characterHouse.length);
        res.json(characters); 
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    characterQuiz();
});

app.post('/submitQuiz', (req, res) => {
    console.log("in post");
    const totalCorrectAnswers = req.body.totalCorrectAnswers;
    console.log('Total correct answers received:', totalCorrectAnswers);
    res.json({ message: 'Quiz results received successfully.' });
});

app.post('/addToCartData', (req, res) => {
    requestData = req.body;
    console.log('Data received from frontend:', requestData);
    res.status(200).send('Data received successfully!');
});



app.get('/cartData', async (req, res) => {
    res.json(requestData);
  });

  app.get('/allIngredients', async (req, res) => {
    res.json(potionsWithIngredients);
  });


app.get('/names', async (req, res) => {
    res.json(characters);
  });



  const your_domain  = 'http://localhost:3000';
app.post('/checkout',async (req,res) => {
    try {
        console.log('succ',process.env.CLIENT_URL);
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
        res.json({url : session.url})
    } catch(e) {
        console.log(e.message)
        res.status(500).json({error : e.message})
    }
})

app.get('/quizData', async (req, res) => {
   
    try {
            try {
                const response = await axios.get('https://potterhead-api.vercel.app/api/characters');
                response.data.forEach(character => {
                    if(character.house != ''){
                    characters.push(character.name);
                    characterHouse.push(character.house);
                    }
                  });
                console.log(characters.length);
                console.log(characterHouse.length);
            } catch (error) {
                console.error('Error fetching data:', error);
                res.status(500).json({ error: 'An error occurred while fetching data' });
            }
            var charq = await characterQuiz();

        const booksResponse = await axios.get('https://api.potterdb.com/v1/books');
        const bookIds = booksResponse.data.data.map(book => book.id);
            const response = await axios.get('https://api.potterdb.com/v1/books/'+bookIds[0]+'/chapters');
            response.data.data.forEach(chapter => {
                const summary = chapter.attributes.summary
            if(summary != null && summary != "" ){
            chapters.push(summary);
            chaptersNames.push(chapter.attributes.slug);
            }
            
            });
        var q = await chapterQuiz();
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    console.log(q.concat(charq).length)
    res.send(q.concat(charq));
    
});

app.get('/qoutes', async (req, res) => {
    try {
        let i = 0;
        while(i < 5){
            const response = await axios.get('https://api.portkey.uk/quote');
            if(!quoteCharacterSet.has(response.data.speaker)){
            qoutes.push(response.data.quote);
            quoteCharacters.push(response.data.speaker);
            quoteCharacterSet.add(response.data.speaker);
            i+=1;
            }
        }
        console.log(qoutes);
       var q = await quotesQuiz(); 
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    res.send(q);
});


app.listen(port, () => {
    console.log(`Server is runnings on http://localhost:${port}`);
});
  

  async function fetchPotionsData() {
    try {
      const response = await axios.get('https://api.potterdb.com/v1/potions');
  
      const potionNames = response.data.data.map(potion => potion.attributes.name);
  
      console.log('Potion Names:', potionNames);
    } catch (error) {
      console.error('Error fetching potions data:', error.message);
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

    question = "What is the name of the below spell ";
        let i = 1;
        while(i<4){
            const randomNumber = getRandomNumber(1,spellsNames.length-3);
            let sample = [];
            spellQuestions.push(question+spells[randomNumber]);
            sample.push(spellsNames[randomNumber]);
            sample.push(spellsNames[randomNumber+1]);
            sample.push(spellsNames[randomNumber+2]);
            sample.push(spellsNames[randomNumber+3]);
            sample = shuffleArray(sample);
            spellQuestions.push(sample);
            spellQuestions.push(spellsNames[randomNumber]);

            i+=1;
        }
        console.log(spellQuestions);

}
function characterQuiz() {

    question = "Which house does ";
        let i = 1;
        characterQuestions = [];
        while(i<4){
            const randomNumber = getRandomNumber(1,characters.length-3);
            let sample = [];
            characterQuestions.push(question+characters[randomNumber]+" belong to?");
            sample.push(houses[0]);
            sample.push(houses[1]);
            sample.push(houses[2]);
            sample.push(houses[3]);
            sample = shuffleArray(sample);
            characterQuestions.push(sample);
            characterQuestions.push(characterHouse[randomNumber]);

            i+=1;
        }
        return characterQuestions;

}  
function quotesQuiz() {
   
    quoteQuestions = [];
    question = " was said by whom? ";
            const randomNumber = getRandomNumber(1,qoutes.length);
        
            let i =0;
            while(i<2){
                let sample = [];
            quoteQuestions.push(qoutes[i]+question);
            sample.push(quoteCharacters[0]);
            sample.push(quoteCharacters[1]);
            sample.push(quoteCharacters[2]);
            sample.push(quoteCharacters[3]);
            sample = shuffleArray(sample);
            quoteQuestions.push(sample);
            quoteQuestions.push(quoteCharacters[i]);
            i+=1;
            }
        return quoteQuestions;

}
function chapterQuiz() {

    question = " what chapter is this from?";
        let i = 1;
        chapterQuestions = [];
        while(i<4){
            const randomNumber = getRandomNumber(1,chaptersNames.length-3);
            let sample = [];
            chapterQuestions.push(chapters[randomNumber]+question);
            sample.push(chaptersNames[randomNumber]);
            sample.push(chaptersNames[randomNumber+1]);
            sample.push(chaptersNames[randomNumber+2]);
            sample.push(chaptersNames[randomNumber+3]);
            sample = shuffleArray(sample);
            chapterQuestions.push(sample);
            chapterQuestions.push(chaptersNames[randomNumber]);

            i+=1;
        }
        return chapterQuestions;

}