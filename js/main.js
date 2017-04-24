"use strict";

const launchGame = {};

const checkImpossibleCells = function() {
	let htmlPlayer1Grid = document.getElementById('grid_p1'),
	    htmlPlayer1Rows = htmlPlayer1Grid.getElementsByClassName('row');

	for (let htmlPlayer1Row of htmlPlayer1Rows) {
    let cells = htmlPlayer1Row.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
			if (cells[i].classList.contains('ship')) {
        cells[i].classList.add('impossible');
			}
		}
  }

}

const removeImpossibleCells = function() {
	let htmlPlayer1Grid = document.getElementById('grid_p1'),
	    htmlPlayer1Rows = htmlPlayer1Grid.getElementsByClassName('row');

	for (let htmlPlayer1Row of htmlPlayer1Rows) {
    let cells = htmlPlayer1Row.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
      cells[i].classList.remove('impossible');
		}
  }

}

const shipButtonSelect = function(ship) {
	const shipButtons = document.getElementsByClassName('ship-button');
  for (let shipButton of shipButtons) {
    shipButton.addEventListener('click', function(e)
		{
			checkImpossibleCells();
			for (shipButton of shipButtons) {
				shipButton.classList.remove('radio-selected');
			}
			e.target.classList.add('radio-selected');
			ship.name = e.target.name;  // define ship name on placingPhase function

			//Enlever bateau si placé
			//recalculer position unavailable
    });
  }
}

const rotationButtonSelect = function(ship) {
	document.getElementById("rotation").addEventListener('click', function(e)
		{
			console.info(ship);
			ship.rotation = !ship.rotation;

			//recalculer position unavailable
    });
}

const placingPhase = function() {
        document.getElementById("gamecontainer").style["top"] = "-100vh";

	let placingShip = {
				name: "",
				rotation: false,
				row: 0,
				column: 0
			};

	//Repérage blocs impossibles




	// for (let htmlPlayer1Cell of htmlPlayer1Cells) {
	//   if (!htmlPlayer1Cell.canPlaceShipAt()) {
	// 		htmlPlayer1Cell.classList.add('impossible');
	// 		console.log(htmlPlayer1Cell + "has a ship");
	// 	}

		// htmlPlayer1Cell hasShip() ? htmlPlayer1Cell.classList.add('impossible') : console.log(htmlPlayer1Cell + "oké");
	// }


	shipButtonSelect(placingShip);
	rotationButtonSelect(placingShip);
	//addEventListener blocks

}

launchGame.solo = function() {
	let gridP1 = new Grid("self"),
	    bot = new Grid("BOTeasy");

  placingPhase();

	gridP1.visualise();
	console.log(gridP1);
}

const mainReady = function() {
        const changeButtons = document.getElementsByClassName("change");
        for(let changeButton of changeButtons) {
          changeButton.addEventListener("click", function(e)
              {
                console.log(e.target);
                console.log(e.target.id);
                let offset = document.getElementById(e.target.name+"BOARD").offsetTop;
                offset = 100*parseInt(Math.round(offset/window.innerHeight));
                document.getElementById("gamecontainer").style["top"] = (-offset)+"vh";
              });
        }

        placingPhase();
}

document.addEventListener("DOMContentLoaded", mainReady);
