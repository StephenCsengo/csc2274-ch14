"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Tutorial Case

   Author: Stephen Csengo
   Date:   5/1/2024

   Filename: ag_cards.js


   Custom Object Classes
   
   pokerGame
      The pokerGame object contains properties and methods for the game
      of draw poker

   pokerDeck
      The pokerDeck object contains an array of poker cards and methods
      for shuffling and drawing cards from the deck.

   pokerHand
      The pokerHand object contains an array of poker cards drawn from a
      poker deck. The methods associated with the object include the ability 
      to calculate the value of the hand and to mark cards to be discarded,
      replaced with new cards from a poker deck.

   pokerCard
      The pokerCard object contains properties and methods associated with
      individual poker cards including the card rank, suit, and value.
   
	
*/
//The pokerGame object
let pokerGame = {
  currentBank: null,
  currentBet: null,
  placeBet: function () {
    this.currentBank -= this.currentBet;
    return this.currentBank;
  },
};
//Constructor function for poker cards
function pokerCard(cardSuit, cardRank) {
  this.suit = cardSuit;
  this.rank = cardRank;
  this.rankValue = null;
}

//Method to reference the image src file for a card
pokerCard.prototype.cardImage = function () {
  let suitAbbr = this.suit.substring(0, 1).toLowerCase();
  return suitAbbr + this.rankValue + ".png";
};

//Method to replace a card with one from the deck
pokerCard.prototype.replaceFromDeck = function (pokerDeck) {
  this.suit = pokerDeck.cards[0].suit;
  this.rank = pokerDeck.cards[0].rank;
  this.rankValue = pokerDeck.cards[0].rankValue;
  pokerDeck.cards.shift();
};
//Constructor function for poker decks
function pokerDeck() {
  this.cards = new Array(52);

  let suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
  let ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King",
    "Ace",
  ];
  let cardCount = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 13; j++) {
      this.cards[cardCount] = new pokerCard(suits[i], ranks[j]);
      this.cards[cardCount].rankValue = j + 2;
      cardCount++;
    }
  }
  //Method to randomly sort deck
  this.shuffle = function () {
    this.cards.sort(function () {
      return 0.5 - Math.random();
    });
  };

  //Method to deal cards from the deck into a poker hand
  this.dealTo = function (pokerHand) {
    for (let i = 0; i < pokerHand.cards.length; i++) {
      pokerHand.cards[i] = this.cards.shift();
    }
  };
}
//Constructor function for poker hands
function pokerHand(handLength) {
  this.cards = new Array(handLength);
}
//Return the highest ranked card in the hand
pokerHand.prototype.highCard = function () {
  return Math.max.call(
    pokerHand,
    this.cards[0].rankValue,
    this.cards[1].rankValue,
    this.cards[2].rankValue,
    this.cards[3].rankValue,
    this.cards[4].rankValue
  );
};
//Test for a flush
pokerHand.prototype.hasFlush = function () {
  let firstSuit = this.cards[0].suit;
  return this.cards.every(function (card) {
    return card.suit === firstSuit;
  });
};
//Test for a straight
pokerHand.prototype.hasStraight = function () {
  this.cards.sort(function (a, b) {
    return a.rankValue - b.rankValue;
  });
  return this.cards.every(function (card, i, cards) {
    if (i > 0) {
      return cards[i].rankValue - cards[i - 1].rankValue === 1;
    } else {
      return true;
    }
  });
};
//Test for a straight flush
pokerHand.prototype.hasStraightFlush = function () {
  return this.hasFlush() && this.hasStraight();
};
//Test for a royal flush
pokerHand.prototype.hasRoyalFlush = function () {
  return this.hasStraightFlush() && this.highCard() === 14;
};
//Test for duplicates in the hand
pokerHand.prototype.hasSets = function () {
  let handSets = {};
  let sets = "none";
  let pairRank;
  this.cards.forEach(function (card) {
    if (handSets.hasOwnProperty(card.rankValue)) {
      handSets[card.rankValue]++;
    } else {
      handSets[card.rankValue] = 1;
    }
  });

  for (let cardRank in handSets) {
    if (handSets[cardRank] === 4) {
      sets = "Four of a kind";
    }
    if (handSets[cardRank] === 3) {
      if (sets === "Pair") {
        sets = "Full House";
      } else {
        sets = "Three of a kind";
      }
    }
    if (handSets[cardRank] === 2) {
      if (sets === "Three of a kind") {
        sets = "Full House";
      } else if (sets === "Pair") {
        sets = "Two pair";
      } else {
        sets = "Pair";
        pairRank = cardRank;
      }
    }
  }

  if (sets === "Pair" && pairRank >= 11) {
    sets = "Jacks or better";
  }
  return sets;
};

pokerHand.prototype.handType = function () {
  if (this.hasRoyalFlush()) {
    return "Royal Flush";
  } else if (this.hasFlush()) {
    return "Flush";
  } else if (this.hasStraight()) {
    return "Straight";
  } else {
    let sets = this.hasSets();
    if (sets === "Pair" || sets === "none") {
      sets = "No winner";
    }
    return sets;
  }
};
