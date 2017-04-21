"use strict";

const launchGame = {};

const shipButtonSelect = function(ship)
{
	const shipButtons = document.getElementsByClassName('ship-button');
  for (let shipButton of shipButtons) {
    shipButton.addEventListener('click', function(e)
		{
			for (let shipButton of shipButtons) {
				shipButton.classList.remove('radio-selected');
			}
			e.target.classList.add('radio-selected');
			ship.name = e.target.name;

			//Enlever bateau si placé
			//recalculer position unavailable
    });
  }
}
const rotationButtonSelect = function(ship)
{
	document.getElementById("rotation").addEventListener('click', function(e)
		{
			console.info(ship);
			ship.rotation = !ship.rotation;

			//recalculer position unavailable
    });
}

const placingPhase = function()
{
	let placingShip = {
		name: "",
		rotation: false,
		row: 0,
		column: 0
	};

	//Repérage blocs impossibles

	shipButtonSelect(placingShip);
	rotationButtonSelect(placingShip);
	//addEventListener blocks

}

launchGame.playerVsPlayer = function()
{
	let gridP1 = new Grid("self");
	let gridP2 = new Grid("other");

  placingPhase();

	gridP1.visualise();
	console.log(gridP2);
}

const mainReady = function()
{
	document.getElementById('PLAY').addEventListener('click', launchGame.playerVsPlayer);
}
document.addEventListener("DOMContentLoaded", mainReady);
