"use strict";

const updateGrid = function(grid, id)
{
  const IHM = document.getElementById(id);
  const rows = IHM.getElementsByClassName("row");
  let blocks;
  for(let y=0; y<rows.length; y++) {
    blocks = rows.item(y).getElementsByClassName("cell");
    for(let x=0; x<blocks.length; x++) {
      blocks.item(x).classList = "cell";
      blocks.item(x).classList.add(grid[y][x].getState());
    }
  }
}
const removeEventListeners = function(id)
{
  const element = document.getElementById(id);
  const clone = element.cloneNode(true);
  element.parentNode.replaceChild(clone, element);
}

const checkImpossibleCells = function() {
  let htmlPlayer1Grid = document.getElementById('grid_p1'),
  htmlPlayer1Rows = htmlPlayer1Grid.getElementsByClassName('row');

  for (let htmlPlayer1Row of htmlPlayer1Rows) {
    let cells = htmlPlayer1Row.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove('impossible');
      if (cells[i].classList.contains('ship')) {
        cells[i].classList.add('impossible');
      }
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
          ship.name = e.target.name;  // DEFINE [placingShip] NAME IN [placingPhase] FUNCTION

          //Enlever bateau si placé
          //recalculer position unavailable
        });
  }
}

const rotationButtonSelect = function(ship) {
  document.getElementById("rotation").addEventListener('click', function(e) {
    console.info(ship);
    ship.rotation = !ship.rotation;
    removeImpossibleCells();
    checkImpossibleCells();
  });
}

const placingPhase = function(grid, bot, solo) {
  document.getElementById("gamecontainer").style["top"] = "-100vh";

  let placingShip = {
    name: "",
    rotation: false,
    row: 0,
    column: 0
  };


  shipButtonSelect(placingShip);
  rotationButtonSelect(placingShip);
  //addEventListener blocks

}
const shootingPhase = function(grid, bot, solo)
{
  if(!GAME.playerAlive || !GAME.enemyAlive) {
    document.getElementById("wrapper").style["display"] = "";
    document.getElementById("gamewrapper").style["display"] = "none";
    return;
  }
  document.getElementById("gamecontainer").style["top"] = "0vh";
  updateGrid(bot.grid.grid, "grid_p2");
  updateGrid(grid.grid, "grid_p1");

  let shootingBlock = {
    special: "",
    block: null,
    div: null
  }

  let blocks;
  const cells = document.getElementById("grid_p2").getElementsByClassName("cell");
  const rows = document.getElementById("grid_p2").getElementsByClassName("row");
  for(let y=0; y<rows.length; y++) {
    blocks = rows.item(y).getElementsByClassName("cell");
    for(let x=0; x<blocks.length; x++) {
      blocks[x].addEventListener("click", function(e)
          {
            for(let cell of cells) cell.classList.remove("cell-selected");
            if(bot.grid.grid[y][x].canBeShotAt()) {
              shootingBlock.block = bot.grid.grid[y][x];
              shootingBlock.div = e.target;
              e.target.classList.add("cell-selected");
            } else {

            }
          });
    }
  }

  const specials = document.getElementsByClassName("shot-button");
  for(let special of specials) {
    special.addEventListener("click", function(e)
        {
          for(let special of specials) special.classList.remove("button-selected");
          if(shootingBlock.special!=e.target.name) {
            shootingBlock.special = e.target.name;
            e.target.classList.add("button-selected");
          } else {
            shootingBlock.special = "";
          }
        });
  }

  const validate = document.getElementById("ENEMYBOARD").getElementsByClassName("validate")[0];
  validate.addEventListener("click", function()
      {
        if(shootingBlock.block) {
          let block = shootingBlock.block;
          let shot;
		  let sound;
		  let timeout = 100;
          switch(shootingBlock.special) {
            case "destroyer":
              shot = Shot.destroyerShot;
			  sound = "destroyerShot";
              break;
            case "cruiser":
              shot = Shot.cruiserShot;
			  sound = "cruiserShot";
              break;
            case "submarine":
              shot = Shot.submarineShot;
			  sound = "submarineShot";
              break;
            case "battleship":
              shot = Shot.battleshipShot;
			  sound = "battleshipShot";
              break;
            case "carrier":
              shot = Shot.carrierShot;
			  sound = "carrierShot";
			  timeout = 6000;
              break;
            default:
              shot = Shot.normalShot;
			  sound = "normalShot";
          }
		  if(!affectedBy("self", "sound")) timeout = 100;
          shootingBlock.div.classList.remove("cell-selected");
          shootingBlock.div = null;
          shootingBlock.block = null;
          shootingBlock.special = "";
          for(let special of specials) special.classList.remove("button-selected");
          removeEventListeners("grid_p2");
          removeEventListeners("shotbuttons");

		  playSound(sound);
		  setTimeout(function()
		  {
			GAME.enemyAlive = bot.grid.fireAt(block, shot, grid);
			if(solo && GAME.enemyAlive) GAME.playerALive = bot.attack(grid, bot.grid);

			updateGrid(bot.grid.grid, "grid_p2");
			updateGrid(grid.grid, "grid_p1");
			setTimeout(function()
			{
				shootingPhase(grid, bot, solo);
			}, 1000);
		  }, timeout);
        } else {

        }
      });

}

GAME.practice = function()
{
  GAME.playerAlive = true;
  GAME.enemyAlive = true;

  let grid = new Grid("self");
  let bot = new Bot("easy");
  bot.setGrid();

  placingPhase(grid, bot);
  shootingPhase(grid, bot, false);
}
GAME.solo = function(difficulty) {
  GAME.playerAlive = true;
  GAME.enemyAlive = true;

  let grid = new Grid("self");
  let bot = new Bot(difficulty);
  bot.setGrid();

  placingPhase(grid, bot);
  shootingPhase(grid, bot, true);
}

const mainReady = function() {
  const changeButtons = document.getElementsByClassName("change");
  for(let changeButton of changeButtons) {
    changeButton.addEventListener("click", function(e)
        {
          let offset = document.getElementById(e.target.name+"BOARD").offsetTop;
          offset = 100*parseInt(Math.round(offset/window.innerHeight));
          document.getElementById("gamecontainer").style["top"] = (-offset)+"vh";
        });
  }
  const exitButtons = document.getElementsByClassName("exit");
  for(let exitButton of exitButtons) {
    exitButton.addEventListener("click", function(e)
        {
          document.getElementById("wrapper").style["display"] = "";
          document.getElementById("gamewrapper").style["display"] = "none";
        });
  }
}

document.addEventListener("DOMContentLoaded", mainReady);
