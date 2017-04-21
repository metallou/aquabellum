"use strict";

const launchGame = {};


const toggleSelect = function() {
	let item = this;
	item.classList.toggle('selected');
}

const setOnClick = function(elem) {
	let selectors = document.querySelectorAll(elem);

  for (let selector of selectors) {
  	selector.addEventListener('click', toggleSelect);
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

	setOnClick('.grid .row .cell');

	document.getElementById('PLAY')
	        .addEventListener('click', launchGame.playerVsPlayer);

}

document.addEventListener("DOMContentLoaded", mainReady);
