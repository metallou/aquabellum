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
// for prevent events to activate in the wrong phase :
const removeEventListeners = function(id)
{
  const element = document.getElementById(id);
  const clone = element.cloneNode(true); // Effect : clone remove event listeners
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
}

const rotationButtonSelect = function(ship) {
  document.getElementById("rotation").addEventListener('click', function(e) {
    console.info(ship);
    ship.rotation = !ship.rotation;
    checkImpossibleCells();
  });
}
// TODO : visibility hidden for button.change & made it visible again at the end of the placingPhase
//
const placingPhase = function(solo) {
  document.getElementById("gamecontainer").style["top"] = "-100vh";
  console.log('placing phase...');

  let placingShip = {
    name: "",
    rotation: false,
    row: 0,
    column: 0
  };

  // shipButtonSelect :
  const shipButtons = document.getElementsByClassName('ship-button');
  for (let shipButton of shipButtons) {
    shipButton.addEventListener('click', function(e)
        {
          checkImpossibleCells();
          for (shipButton of shipButtons) {
            shipButton.classList.remove('radio-selected');
          }
          e.target.classList.add('radio-selected');
          placingShip.name = e.target.name;  // DEFINE [placingShip] NAME IN [placingPhase] FUNCTION
          console.log(placingShip.name);
          //Enlever bateau si placé
          //recalculer position unavailable


    for (let shipButton of shipButtons) {
      console.log(shipButton.classList);
      if (shipButton.classList.contains('radio-selected')) {
        console.log('toto-2');
        let htmlPlayer1Grid = document.getElementById('grid_p1'),
            htmlPlayer1Rows = htmlPlayer1Grid.getElementsByClassName('row');

        for (let htmlPlayer1Row of htmlPlayer1Rows) {
          console.log('toto-1');
          let cells = htmlPlayer1Row.getElementsByClassName('cell');
          for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', function() {
              console.log('toto');
              GAME.player.placeShip(
                placingShip.name,
                placingShip.rotation,
                placingShip.row,
                placingShip.column
              );
              console.log(GAME.player);
              shipButton.style["visibility"] = "hidden";
            });

          }

        }
      }
    }

  });

  }





  // shipButtonSelect(placingShip);
  rotationButtonSelect(placingShip);
  //addEventListener blocks

}
// TODO : hide validate button if condition not full
const shootingPhase = function(solo)
{
  //check if game ended
  if(!GAME.playerAlive || !GAME.enemyAlive) {
    if(GAME.playerAlive) playSound("victory");
    if(GAME.enemyAlive) playSound("defeat");
    document.getElementById("wrapper").style["display"] = "";
    document.getElementById("gamewrapper").style["display"] = "none";
    return;
  }

  let row;
  let cells;
  let rows;
  let specials;
  let validate;
  let shootingBlock = {
    special: "",
    block: null
  }

  //reset board
  cells = document.getElementById("grid_p2").getElementsByClassName("cell");
  rows = document.getElementById("grid_p2").getElementsByClassName("row");
  specials = document.getElementsByClassName("shot-button");
  validate = document.getElementById("ENEMYBOARD").getElementsByClassName("validate")[0];
  for(let cell of cells) cell.classList.remove("cell-selected");
  for(let special of specials) special.classList.remove("button-selected");
  removeEventListeners("grid_p1");
  removeEventListeners("grid_p2");
  removeEventListeners("bonusbuttons");
  removeEventListeners("shotbuttons");
  cells = document.getElementById("grid_p2").getElementsByClassName("cell");
  rows = document.getElementById("grid_p2").getElementsByClassName("row");
  specials = document.getElementsByClassName("shot-button");
  validate = document.getElementById("ENEMYBOARD").getElementsByClassName("validate")[0];

  //update board
  updateGrid(GAME.enemy.grid.grid, "grid_p2");
  updateGrid(GAME.player.grid, "grid_p1");
  document.getElementById("gamecontainer").style["top"] = "0vh";

  //select target
  for(let y=0; y<rows.length; y++) {
    row = rows.item(y).getElementsByClassName("cell");
    for(let x=0; x<row.length; x++) {
      row.item(x).addEventListener("click", function(e)
          {
            for(let cell of cells) cell.classList.remove("cell-selected");
            if(GAME.enemy.grid.grid[y][x].canBeShotAt()) {
              shootingBlock.block = GAME.enemy.grid.grid[y][x];
              e.target.classList.add("cell-selected");
            } else {

            }
          });
    }
  }

  //select special shot
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

  //FIRE
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
          shootingBlock.block = null;
          shootingBlock.special = "";

          for(let cell of cells) cell.classList.remove("cell-selected");
          for(let special of specials) special.classList.remove("button-selected");
          removeEventListeners("grid_p1");
          removeEventListeners("grid_p2");
          removeEventListeners("bonusbuttons");
          removeEventListeners("shotbuttons");

          playSound(sound);
          setTimeout(function()
              {
                GAME.enemyAlive = GAME.enemy.grid.fireAt(block, shot, GAME.player);
                if(solo && GAME.enemyAlive) GAME.playerALive = GAME.enemy.attack(GAME.player, GAME.enemy.grid);

                updateGrid(GAME.enemy.grid.grid, "grid_p2");
                updateGrid(GAME.player.grid, "grid_p1");
                setTimeout(function()
                    {
                      shootingPhase(solo);
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

  GAME.player = new Grid("self");
  IA.placeShips(GAME.player);
  GAME.enemy = new Bot("easy");
  GAME.enemy.setGrid();

  shootingPhase(false);
}
GAME.solo = function(difficulty) {
  console.log('solo' + difficulty);
  GAME.playerAlive = true;
  GAME.enemyAlive = true;

  GAME.player = new Grid("self");
  GAME.enemy = new Bot(difficulty);
  GAME.enemy.setGrid();

  placingPhase(true);
  // shootingPhase(true);
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
          GAME.player = null;
          GAME.enemy = null;
          GAME.playerAlive = false;
          GAME.enemyALive = false;
          playSound("defeat");
          document.getElementById("wrapper").style["display"] = "";
          document.getElementById("gamewrapper").style["display"] = "none";
        });
  }
}

document.addEventListener("DOMContentLoaded", mainReady);
