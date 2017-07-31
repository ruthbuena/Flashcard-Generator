var inquirer =require('inquirer');
var BasicCard = require('./BasicCard.js');
var ClozeCard = require('./ClozeCard.js');
var library = require('./flashcardLibrary.json');
var colors = require('colors');

var drawCard;
var playerCard;
var count = 0;
function letsStart() {
  inquirer.prompt([{
    type: "list",
    message: "\nPlease choose an option",
    choices: ["Create", "Use All", "Random", "Shuffle", "Show All", "Exit"],
    name: "menuOptions"
  }]).then(function(answer) {
    var waitMsg;

    switch (answer.menuOptions) {

      case 'Create':
        console.log("Ok lets make a new flashcard...");
        waitMsg = setTimeout(createCard, 1000);
        break;

      case 'Use All':
        console.log("OK lets run through the deck...");
        waitMsg = setTimeout(askQuestions, 1000);
        break;

      case 'Random':
        console.log("OK I'll pick one random card from the deck...");
        waitMsg = setTimeout(randomCard, 1000);
        break;

      case 'Shuffle':
        console.log("OK I'll shuffle all the cards in the deck...");
        waitMsg = setTimeout(shuffleDeck, 1000);
        break;

      case 'Show All':
        console.log("OK I'll print all cards in the deck to your screen...");
        waitMsg = setTimeout(showCards, 1000);
        break;

      case 'Exit':
        console.log("Thank you for using the Flashcard-Generator")
        return;
        break;

      default:
        console.log("");
        console.log("Sorry I don't understand");
        console.log("");
    }
  });
}

letsStart();


function createCard() {
  inquirer.prompt([{
        type: "list",
        message: "What type of flashcard do you want to create?",
        choices: ["Basic Card", "Cloze Card"],
        name: "cardType"
      }

    ]).then(function(appData) {

        var cardType = appData.cardType;
        console.log(cardType);

        if (cardType === "Basic Card") {
          inquirer.prompt([{
              type: "input",
              message: "Please fill out the front of your card (Your Question).",
              name: "front"
            },

            {
              type: "input",
              message: "Please fill out the back of your card (Your Answer).",
              name: "back"
            }

          ]).then(function(cardData) {

            var cardObj = {
              type: "BasicCard",
              front: cardData.front,
              back: cardData.back
            };
            library.push(cardObj);
            fs.writeFile("flashcardLibrary.json", JSON.stringify(library, null, 2));
            inquirer.prompt([{
                type: "list",
                message: "Do you want to create another card?",
                choices: ["Yes", "No"],
                name: "anotherCard"
              }

            ]).then(function(appData) {
              if (appData.anotherCard === "Yes") {
                createCard();
              } else {
                setTimeout(letsStart, 1000);
              }
            });
          });

        } else {
          inquirer.prompt([{
              type: "input",
              message: "Please type out the full text of your statement (remove cloze in next step).",
              name: "text"
            },

            {
              type: "input",
              message: "Please type the portion of text you want to cloze, replacing it with '...'.",
              name: "cloze"
            }

          ]).then(function(cardData) {

            var cardObj = {
              type: "ClozeCard",
              text: cardData.text,
              cloze: cardData.cloze
            };
            if (cardObj.text.indexOf(cardObj.cloze) !== -1) {
              library.push(cardObj);
              fs.writeFile("flashcardLibrary.json", JSON.stringify(library, null, 2));
            } else {
              console.log("Sorry, The cloze must match some word(s) in the text of your statement.");

            }
            inquirer.prompt([{
                type: "list",
                message: "Do you want to create another card?",
                choices: ["Yes", "No"],
                name: "anotherCard"
              }

            ]).then(function(appData) {
              if (appData.anotherCard === "Yes") {
                createCard();
              } else {
                setTimeout(letsStart, 1000);
              }
            });
          });
        }
});
};

function getQuestion(card) {
  if (card.type === "BasicCard") {
    drawnCard = new BasicCard(card.front, card.back);
    return drawnCard.front;
  } else if (card.type === "ClozeCard") {
    drawnCard = new ClozeCard(card.text, card.cloze)
    return drawnCard.clozeRemoved();
  }
};
function askQuestions() {
  if (count < library.length) {
    playedCard = getQuestion(library[count]);
    inquirer.prompt([{
      type: "input",
      message: playedCard,
      name: "question"
    }]).then(function(answer) {
      if (answer.question === library[count].back || answer.question === library[count].cloze) {
        console.log(colors.green("You are correct."));
      } else {
        if (drawnCard.front !== undefined) {
          console.log(colors.red("Sorry, the correct answer was ") + library[count].back + ".");
        } else {
          console.log(colors.red("Sorry, the correct answer was ") + library[count].cloze + ".");
        }
      }
      count++;
      askQuestions();
    });
  } else {
    count = 0;
    letsStart();
  }
};

function shuffleDeck() {
  newDeck = library.slice(0);
  for (var i = library.length - 1; i > 0; i--) {

    var getIndex = Math.floor(Math.random() * (i + 1));
    var shuffled = newDeck[getIndex];

    newDeck[getIndex] = newDeck[i];

    newDeck[i] = shuffled;
  }
  fs.writeFile("flashcardLibrary.json", JSON.stringify(newDeck, null, 2));
  console.log(colors.cyan("The deck of flashcards have been shuffled"));
}

function randomCard() {
  var randomNumber = Math.floor(Math.random() * (library.length - 1));

  playedCard = getQuestion(library[randomNumber]);
  inquirer.prompt([{
    type: "input",
    message: playedCard,
    name: "question"
  }]).then(function(answer) {
    if (answer.question === library[randomNumber].back || answer.question === library[randomNumber].cloze) {
      console.log(colors.green("You are correct."));
      setTimeout(letsStart, 1000);
    } else {
      if (drawnCard.front !== undefined) {
        console.log(colors.red("Sorry, the correct answer was ") + library[randomNumber].back + ".");
        setTimeout(letsStart, 1000);
      } else {
        console.log(colors.red("Sorry, the correct answer was ") + library[randomNumber].cloze + ".");
        setTimeout(letsStart, 1000);
      }
    }
  });

};

function showCards() {

  var library = require("./flashcardLibrary.json");

  if (count < library.length) {

    if (library[count].front !== undefined) {
      console.log("");
      console.log(colors.yellow("++++++++++++++++++ Basic Card ++++++++++++++++++"));
      console.log(colors.yellow("++++++++++++++++++++++++++++++++++++++++++++++++"));
      console.log("Front: " + library[count].front);
      console.log("------------------------------------------------");
      console.log("Back: " + library[count].back + ".");
      console.log(colors.yellow("++++++++++++++++++++++++++++++++++++++++++++++++"));
      console.log("");

    } else {
      console.log("");
      console.log(colors.yellow("++++++++++++++++++ Cloze Card ++++++++++++++++++"));
      console.log(colors.yellow("++++++++++++++++++++++++++++++++++++++++++++++++"));
      console.log("Text: " + library[count].text);
      console.log("------------------------------------------------");
      console.log("Cloze: " + library[count].cloze + ".");
      console.log(colors.yellow("++++++++++++++++++++++++++++++++++++++++++++++++"));
      console.log("");
    }
    count++;
    showCards();
  } else {
    count = 0;
    letsStart();
  }
}
