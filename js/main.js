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
const removeAllGameEventListeners = function()
{
  let elements;
  let clone;

  removeEventListeners("grid_p1");
  removeEventListeners("grid_p2");
  removeEventListeners("ship-buttons");
  removeEventListeners("bonus-buttons");
  removeEventListeners("shot-buttons");

  elements = document.getElementsByClassName("validate");
  for(let element of elements) {
    clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
  }

  const cells = document.getElementsByClassName("cell");
  for(let cell of cells) cell.classList = "cell";
  const ships = document.getElementsByClassName("ship-button");
  for(let ship of ships) ship.classList = "ship-button";
  const shots = document.getElementsByClassName("shot-button");
  for(let shot of shots) shot.classList = "shot-button";
  const bonuses = document.getElementsByClassName("bonus-button");
  for(let bonus of bonuses) bonus.classList = "bonus-button";
}

const removeShips = function()
{
  const gridShips = document.getElementsByClassName("gridShip");
  for(let i=gridShips.length-1; i>=0; i--) gridShips.item(i).parentNode.removeChild(gridShips.item(i));
}
const displayShips = function(ships)
{
  removeShips();

  let pos;
  let row;
  let img;
  let div;
  let border;
  const ratio = 1;
  const IHM = document.getElementById("grid_p1");
  const rows = IHM.getElementsByClassName("row");
  for(let ship of ships) {
    if(ship.blocks.length>0) {
      pos = ship.blocks[0].getPos();
      row = rows.item(pos.row).getElementsByClassName("cell");
      div = row.item(pos.column);
      border = (div.offsetWidth - div.clientWidth)/2;

      img = document.createElement("img");
      img.classList.add("gridShip");
      img.style["top"] = parseInt(-border)+"px";
      img.style["left"] = parseInt(-border)+"px";
      if(ship.rotation) {
        img.src = "media/img/ships/"+ship.name+"RIGHT.png";
        img.setAttribute("height", parseInt(div.offsetWidth)+"px");
        img.setAttribute("width", parseInt(ship.getLength()*div.offsetWidth)+"px");
      } else {
        img.src = "media/img/ships/"+ship.name+"UP.png";
        img.setAttribute("width", parseInt(div.offsetWidth)+"px");
        img.setAttribute("height", parseInt(ship.getLength()*div.offsetWidth)+"px");
      }

      div.appendChild(img);
    }
  }
}

const checkSpecialShots = function()
{
  let array = GAME.player.ships.specialShotsCharge;
  const specials = document.getElementById("shot-buttons").getElementsByClassName("shot-button");
  const subs = document.getElementById("shot-buttons").getElementsByTagName("sub");
  for(let i=0; i<specials.length; i++) {
    if(affectedBy("self", "SHOT"+specials.item(i).id)) {
      specials.item(i).classList.add("option-selected");
      subs.item(i).style["display"] = "";
    }
    if(array[i]>0 && specials.item(i).classList.contains("option-selected")) {
      specials.item(i).classList.add("impossible");
      specials.item(i).classList.remove("possible");
      subs.item(i).style["display"] = "";
      subs.item(i).innerHTML = array[i];
    } else {
      specials.item(i).classList.remove("impossible");
      specials.item(i).classList.add("possible");
      subs.item(i).style["display"] = "none";
      subs.item(i).innerHTML = 0;
    }
  }
}
const checkMaluses = function()
{
  const maluses = document.getElementById("malus-buttons").getElementsByClassName("malus-button");
  for(let i=0; i<maluses.length; i++) {
    if(affectedBy("self", "MALUS"+maluses.item(i).id)) maluses.item(i).classList.add("malus-selected");
  }
}
const checkBonuses = function()
{
  const bonuses = document.getElementById("bonus-buttons").getElementsByClassName("bonus-button");
  for(let i=0; i<bonuses.length; i++) {
    if(affectedBy("self", "BONUS"+bonuses.item(i).id)) {
      bonuses.item(i).classList.add("option-selected");
      GAME["canUseBONUS"+bonuses.item(i).id] = true;
    }
    if(GAME["canUseBONUS"+bonuses.item(i).id]) {
      bonuses.item(i).classList.add("possible");
    } else {
      bonuses.item(i).classList.add("impossible");
    }
  }
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
            shipButton.classList.remove('button-selected');
          }
          e.target.classList.add('button-selected');
          ship.name = e.target.name;  // DEFINE [placingShip] NAME IN [placingPhase] FUNCTION

          //Enlever bateau si placé
          //recalculer position unavailable
        });
  }
}

const rotationButtonSelect = function(ship) {
  document.getElementById("rotation").addEventListener('click', function(e) {
    ship.rotation = !ship.rotation;
    removeImpossibleCells();
    checkImpossibleCells();
  });
}
// TODO : visibility hidden for button.change & made it visible again at the end of the placingPhase
//
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
// TODO : hide validate button if condition not full
const shootingPhase = function(grid, bot, solo)
{
  //check if game ended
  if(!GAME.playerAlive || !GAME.enemyAlive) {
    if(GAME.playerAlive) playSound("victory");
    if(GAME.enemyAlive) playSound("defeat");
    document.getElementById("wrapper").style["display"] = "";
    document.getElementById("gamewrapper").style["display"] = "none";
    return;
  }

  //reset board
  removeAllGameEventListeners();

  let elem;
  let row;
  let shootingBlock = {
    special: "",
    bonus: "",
    block: null
  }
  const cells = document.getElementById("grid_p2").getElementsByClassName("cell");
  const rows = document.getElementById("grid_p2").getElementsByClassName("row");
  const specials = document.getElementsByClassName("shot-button");
  const bonuses = document.getElementsByClassName("bonus-button");
  const validate = document.getElementById("ENEMYBOARD").getElementsByClassName("validate")[0];
  const bonusValidate = document.getElementById("SELFBOARD").getElementsByClassName("validate")[0];

  //update board
  updateGrid(GAME.enemy.grid.grid, "grid_p2");
  updateGrid(GAME.player.grid, "grid_p1");
  document.getElementById("gamecontainer").style["top"] = "0vh";
  checkSpecialShots();
  checkMaluses();
  checkBonuses();

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
          elem = e.target;
          while(!elem.classList.contains("shot-button")) elem = elem.parentNode;
          if(elem.classList.contains("option-selected") && shootingBlock.special!=elem.id) {
            shootingBlock.special = elem.id;
            elem.classList.add("button-selected");
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
          removeAllGameEventListeners();

          playSound(sound);
          setTimeout(function()
              {
                GAME.enemyAlive = GAME.enemy.grid.fireAt(block, shot, GAME.player);
                if(GAME.shield) {
                  GAME.shield = false;
                } else {
                  if(solo && GAME.enemyAlive) GAME.playerALive = GAME.enemy.attack(GAME.player, GAME.enemy.grid);
                }

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

  //select bonus
  for(let bonus of bonuses) {
    bonus.addEventListener("click", function(e)
        {
          for(let bonus of bonuses) bonus.classList.remove("button-selected");
          elem = e.target;
          while(!elem.classList.contains("bonus-button")) elem = elem.parentNode;
          if(elem.classList.contains("option-selected") && shootingBlock.bonus!=elem.id) {
            shootingBlock.bonus = elem.id;
            elem.classList.add("button-selected");
          } else {
            shootingBlock.bonus = "";
          }
        });
  }

  bonusValidate.addEventListener("click", function()
      {
        let bonus;
        let valid = false;
        switch(shootingBlock.bonus) {
          case "move":
            bonus = function()
            {
              if(GAME.canUseBONUSmove) {
                placingPhase(solo);
              }
            };
            valid = true;
            break;
          case "repair":
            bonus = function()
            {
              if(GAME.canUseBONUSrepair) {
                GAME.player.ships.ships.forEach(function(element, index, array)
                    {
                      element.blocks.forEach(function(element2, index2, array2)
                          {
                            if(element2.getState()==="hit") element2.setState("ship");
                          });
                    });
              }
            };
            valid = true;
            break;
          case "shield":
            bonus = function()
            {
              if(GAME.canUseBONUSshield) {
                GAME.shield = true;
              }
            };
            valid = true;
            break;
        }

        if(valid) {
          GAME["canUseBONUS"+shootingBlock.bonus] = false;
          shootingBlock.bonus = "";
          bonus();
        }
      });
}

GAME.practice = function()
{
  GAME.playerAlive = true;
  GAME.enemyAlive = true;
  GAME.canUseBONUSmove = false;
  GAME.canUseBONUSrepair = false;
  GAME.canUseBONUSshield = false;
  GAME.shield = false;

  GAME.player = new Grid("self");
  IA.placeShips(GAME.player);
  GAME.enemy = new Bot("easy");
  GAME.enemy.setGrid();

  removeShips();
  checkSpecialShots();
  checkMaluses();
  checkBonuses();
  removeAllGameEventListeners();

  displayShips(GAME.player.ships.ships);
  shootingPhase(false);
}
GAME.solo = function(difficulty)
{
  GAME.playerAlive = true;
  GAME.enemyAlive = true;
  GAME.canUseBONUSmove = false;
  GAME.canUseBONUSrepair = false;
  GAME.canUseBONUSshield = false;
  GAME.shield = false;

  GAME.player = new Grid("self");
  GAME.enemy = new Bot(difficulty);
  GAME.enemy.setGrid();

  removeShips();
  checkSpecialShots();
  checkMaluses();
  checkBonuses();
  removeAllGameEventListeners();

  placingPhase();
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
