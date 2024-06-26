"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Tutorial Case

   Author: Stephen Csengo
   Date:   5/1/2024
   
   Filename: ag_poker.js

*/
window.addEventListener("load", playDrawPoker);

function playDrawPoker() {
  let dealButton = document.getElementById("dealB");
  let drawButton = document.getElementById("drawB");
  let standButton = document.getElementById("standB");
  let resetButton = document.getElementById("resetB");
  let handValueText = document.getElementById("handValue");
  let betSelection = document.getElementById("bet");
  let bankBox = document.getElementById("bank");
  let cardImages = document.querySelectorAll("img.cardImg");

  //Set the initial values of the pokerGame object
  pokerGame.currentBank = 500;
  pokerGame.currentBet = 25;

  //Create a new deck of cards and shuffle it
  let myDeck = new pokerDeck();
  myDeck.shuffle();

  //Create a pokerHand object
  let myHand = new pokerHand(5);
  bankBox.value = pokerGame.currentBank;
  betSelection.onchange = function (e) {
    pokerGame.currentBet = parseInt(
      e.target.options[e.target.selectedIndex].value
    );
  };
  //Restart the game when the reset button is clicked
  resetButton.addEventListener("click", function () {
    pokerGame.currentBank = 500;
    bankBox.value = pokerGame.currentBank;
    enableObj(dealButton);
    enableObj(betSelection);
    disableObj(drawButton);
    disableObj(standButton);
  });
  //Enable the draw and stand buttons after the deal
  dealButton.addEventListener("click", function () {
    if (pokerGame.currentBank >= pokerGame.currentBet) {
      handValueText.textContent = "";
      disableObj(dealButton);
      disableObj(betSelection);
      enableObj(drawButton);
      enableObj(standButton);
      bankBox.value = pokerGame.placeBet();
    } else {
      alert("Reduce the size of your bet");
    }
    //Deal cards into poker hand after confirming there are at least 10 cards in deck
    if (myDeck.cards.length < 10) {
      myDeck = new pokerDeck();
      myDeck.shuffle();
    }
    myDeck.dealTo(myHand);

    //Display the card images on the table
    for (let i = 0; i < cardImages.length; i++) {
      cardImages[i].src = myHand.cards[i].cardImage();
      //Event handler for each card image
      cardImages[i].index = i;
      cardImages[i].onclick = function (e) {
        if (e.target.discard !== true) {
          e.target.discard = true;
          e.target.src = "ag_cardback.png";
        } else {
          e.target.discard = false;
          e.target.src = myHand.cards[e.target.index].cardImage();
        }
      };
    }
  });
  //Enable the deal and bet options when the current hand ends
  drawButton.addEventListener("click", function () {
    enableObj(dealButton);
    enableObj(betSelection);
    disableObj(drawButton);
    disableObj(standButton);

    //Replace the cards selected
    for (let i = 0; i < cardImages.length; i++) {
      if (cardImages[i].discard) {
        myHand.cards[i].replaceFromDeck(myDeck);
        cardImages[i].src = myHand.cards[i].cardImage();
        cardImages[i].discard = false;
      }
      cardImages[i].onclick = null;
    }
    //Eval the hand drawn by user
    handValueText.textContent = myHand.handType();
    //Pay out the final hand
    bankBox.value = pokerGame.payout(myHand.handOdds());
  });
  standButton.addEventListener("click", function () {
    enableObj(dealButton);
    enableObj(betSelection);
    disableObj(drawButton);
    disableObj(standButton);

    //Eval the hand dealt to the user
    handValueText.textContent = myHand.handType();
    //Pay out the final hand
    bankBox.value = pokerGame.payout(myHand.handOdds());
  });
  //Disable poker button
  function disableObj(obj) {
    obj.disabled = true;
    obj.style.opacity = 0.25;
  }
  //Enable poker button
  function enableObj(obj) {
    obj.disabled = false;
    obj.style.opacity = 1;
  }
}
