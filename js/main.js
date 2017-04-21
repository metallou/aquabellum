"use strict";

const launchGame = {};


const shipButtonRadioSelect = function() {
  let thatShipButton = this,
	    shipButtons = document.getElementsByClassName('ship-button');

	for (let shipButton of shipButtons) {
		shipButton.classList.remove('radio-selected');
	}
	thatShipButton.classList.add('radio-selected');

}

const setOnClick = function(elem) {
	let selectors = document.querySelectorAll(elem);

  for (let selector of selectors) {
  	selector.addEventListener('click', shipButtonRadioSelect);
  }
}

launchGame.playerVsPlayer = function() {
	let gridP1 = new Grid("self"),
	    gridP2 = new Grid("other");

	function placeCruiser() {
		gridP1.placeShip('cruiser', true, '7', '3');

	}

  document.querySelector('.ship-button.cruiser')
	        .addEventListener('click', placeCruiser);

	console.log(gridP1.visualise());
	console.log(gridP2);
}

const mainReady = function()
{

  setOnClick('.ship-button');

	document.getElementById('PLAY')
	        .addEventListener('click', launchGame.playerVsPlayer);

}

document.addEventListener("DOMContentLoaded", mainReady);
