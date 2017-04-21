"use strict";

const launchGame = {};

const shipButtonRadioSelect = function() {
	let shipButtons = document.getElementsByClassName('ship-button');

  for (let shipButton of shipButtons) {
    shipButton.addEventListener('click', function(event) {
			for (shipButton of shipButtons) {
				shipButton.classList.remove('radio-selected');
			}
			event.target.classList.add('radio-selected');
    });
  }
}

const placingPhase = function() {
	shipButtonRadioSelect();


}

launchGame.playerVsPlayer = function() {
	let gridP1 = new Grid("self"),
	    gridP2 = new Grid("other");

  placingPhase();


	console.log(gridP1.visualise());
	console.log(gridP2);
}



const mainReady = function()
{

	document.getElementById('PLAY')
	        .addEventListener('click', launchGame.playerVsPlayer);

}

document.addEventListener("DOMContentLoaded", mainReady);
