var ranks, suits, strength, deck, playerHand, computerHand, cardsPlayed;

ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
suits = ['H', 'S', 'C', 'D'];
strength = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, 
          '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
cardsPlayed = [];

/* Constructor for a Deck object.  Contains ability to shuffle and deal cards.*/
function Deck() {
  this.cards = [];

  this.count = function() {
    return this.cards.length;
  }

  /* Initialize a deck containing one card of each rank/suit combination */
  this.init = function() {
    for (var s = 0; s < suits.length; s++) {
      for (var r = 0; r < ranks.length; r++) {
        this.cards.push(new Card(ranks[r], suits[s]));
      }
    }
  }

  /* Shuffle the cards in the deck */
  this.shuffle = function() {
    var input = this.cards;
    for (var i = this.count() - 1; i >= 0; i--) {
      var randomIndex, itemAtIndex;
      randomIndex = Math.floor(Math.random() * (i + 1));
      itemAtIndex = input[randomIndex];
      input[randomIndex] = input[i];
      input[i] = itemAtIndex;
    }
    this.cards = input;
  }
  
  /* Remove and return a card, to deal to a hand or other location */
  this.dealCard = function() {
    return this.cards.shift();
  }

  /* Print every card in the deck */
  this.printDeck = function() {
    for (var c = 0; c < this.count(); c++) {
      this.cards[c].show();
    }
  }
}

/* Constructor for a Card object. */
function Card(rank, suit) {
  this.rank = rank;
  this.suit = suit;
  this.strength = strength[rank];
  this.show = function() {
    console.log(this.rank + " of " + this.suit);
    return (this.rank + " of " + this.suit);
  }
}

/* Constructor for a hand for the game of War */
function WarHand(name) {
  this.cards = [];
  this.name = name;
  this.count = function() {
    return this.cards.length;
  }

  this.addCard = function(card) {
    this.cards.push(card);
  }

  this.printHand = function() {
    for (var c = 0; c < this.count(); c++) {
      this.cards[c].show();
    }
  }

  this.playCard = function() {
    if (this.count != 0) {
      var nextCard = this.cards[0];
      console.log(this.name + " plays a:")
      nextCard.show();
      if (this.name == "Player") {
        document.getElementById("playerText").innerHTML = "Player played a " + nextCard.rank + " of " + nextCard.suit;
      }
      else if (this.name == "Computer") {
        document.getElementById("computerText").innerHTML = "Computer played a " + nextCard.rank + " of " + nextCard.suit;
      }
      else {
        alert("Not a valid deck!");
      }
      return this.cards.shift();
    }
  }

  this.showCount = function() {
    if (this.name == "Player") {
      document.getElementById("playerCount").innerHTML = this.name + 
        " cards left: " + this.count();
    }
    else if (this.name == "Computer") {
      document.getElementById("computerCount").innerHTML = this.name + 
        " cards left: " + this.count();
        
    }
  }
}

deck = new Deck();
deck.init();
deck.shuffle();

playerHand = new WarHand("Player");
computerHand = new WarHand("Computer");

/* Initialize hands to start a game of War */
var startWar = function(gameDeck) {
  var toggle, dealtCard;
  toggle = 0;
  while (gameDeck.count() > 0) {
    if (toggle === 0) {
      playerHand.addCard(gameDeck.dealCard());
      toggle++;
    }
    else if (toggle === 1) {
      computerHand.addCard(gameDeck.dealCard());
      toggle--;
    }
  }
  playerHand.showCount();
  computerHand.showCount();
}

/* Play a round of War */
var playRound = function(hand1, hand2) {
  var card1 = hand1.playCard();
  var card2 = hand2.playCard();

  if (card1.strength > card2.strength) {
    hand1.addCard(card1);
    hand1.addCard(card2);
    hand1.cards = hand1.cards.concat(cardsPlayed);
    cardsPlayed = [];
    document.getElementById("gameText").innerHTML = "Player wins and takes the cards!";
    console.log("Player wins and takes the cards!");
  }

  else if (card1.strength < card2.strength) {
    hand2.addCard(card1);
    hand2.addCard(card1);
    hand2.cards = hand2.cards.concat(cardsPlayed);
    cardsPlayed = [];
    document.getElementById("gameText").innerHTML = "Computer wins and takes the cards!";
    console.log("Computer wins and takes the cards!");
  }

  else if (card1.strength === card2.strength) {
    var card3, card4;
    document.getElementById("gameText2").innerHTML = "War!";
    console.log("War!");
    cardsPlayed.push(card1);
    cardsPlayed.push(card2);
    for (i = 1; i <= 3; i++) {
      cardsPlayed.push(hand1.playCard());
      cardsPlayed.push(hand2.playCard());
    }
    document.getElementById("playerText2").innerHTML = "Player lays down a " +
      cardsPlayed[cardsPlayed.length - 6].show() + ", " + cardsPlayed
      [cardsPlayed.length - 4].show() + ", and " + cardsPlayed
      [cardsPlayed.length - 2].show();
    document.getElementById("computerText2").innerHTML = 
      "Computer lays down a " + cardsPlayed[cardsPlayed.length - 5].show() + 
      ", " + cardsPlayed[cardsPlayed.length - 3].show() + ", and " +
      cardsPlayed[cardsPlayed.length - 1].show();
    playRound(hand1, hand2);
  }

  playerHand.showCount();
  computerHand.showCount(); 
}

startWar(deck);
