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
  const gridShips = document.getElementById("grid_p1").getElementsByClassName("gridShip");
  const shipCells = document.getElementById("grid_p1").getElementsByClassName("shipPlaced");
  for(let i=gridShips.length-1; i>=0; i--) gridShips.item(i).parentNode.removeChild(gridShips.item(i));
  for(let i=shipCells.length-1; i>=0; i--) shipCells.item(i).classList.remove("shipPlaced");
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
    specials.item(i).classList.remove("option-selected");
    specials.item(i).classList.remove("possible");
    subs.item(i).style["display"] = "none";
    subs.item(i).innerHTML = "0";
    if(GAME.player.ships.searchShip(specials.item(i).id).stillAlive()) {
      if(affectedBy("self", "SHOT"+specials.item(i).id)) {
        specials.item(i).classList.add("option-selected");
        subs.item(i).style["display"] = "";
      }
    }
    if(array[i]>0 && specials.item(i).classList.contains("option-selected")) {
      specials.item(i).classList.add("possible");
      subs.item(i).style["display"] = "";
      subs.item(i).innerHTML = array[i];
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

const checkImpossibleCells = function(placingShip) {
  let cells;

  const rows = document.getElementById('grid_p1').getElementsByClassName('row');
  for(let y=0; y<rows.length; y++) {
    cells = rows.item(y).getElementsByClassName("cell");
    for(let x=0; x<cells.length; x++) {
      cells.item(x).classList.remove("unavailable");
      if(GAME.player.grid[y][x].getState()!="unknown") {
        cells.item(x).classList.add("impossible");
      }
      if(GAME.player.grid[y][x].hasShip()) {
        cells.item(x).classList.add("shipPlaced");
      }
    }
  }

  const blocks = {
    blocks: [],
    cells: []
  };
  if(placingShip.name!="") {
    for(let y=0; y<rows.length; y++) {
      cells = rows.item(y).getElementsByClassName("cell");
      for(let x=0; x<cells.length; x++) {
        cells.item(x).classList.add("unavailable");
      }
    }
    const length = GAME.player.ships.searchShip(placingShip.name).getLength();
      for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) {
          blocks.blocks = [];
          blocks.cells = [];
          for(let i=0; i<length; i++) {
            if(placingShip.rotation) {
              if((x+i)<10) {
                blocks.blocks.push(GAME.player.grid[y][x+i]);
                blocks.cells.push(rows.item(y).getElementsByClassName("cell").item(x+i));
              }
            } else {
              if((y+i)<10) {
                blocks.blocks.push(GAME.player.grid[y+i][x]);
                blocks.cells.push(rows.item(y+i).getElementsByClassName("cell").item(x));
              }
            }
          }
          if(GAME.player.ships.canWelcomeShipOver(placingShip.name, blocks.blocks)) {
            for(let cell of blocks.cells) cell.classList.remove("unavailable");
          } else {
            for(let cell of blocks.cells) {
              if(!(cell.classList.contains("impossible") || cell.classList.contains("shipPlaced"))) cell.classList.add("unavailable");
            }
          }
        }
      }
  }
}

// TODO : visibility hidden for button.change & made it visible again at the end of the placingPhase
//
const placingPhase = function(solo) {
  //reset board
  removeAllGameEventListeners();

  let elem;
  let row;
  let placingShip = {
    name: "",
    rotation: false
  }
  const cells = document.getElementById("grid_p1").getElementsByClassName("cell");
  const rows = document.getElementById("grid_p1").getElementsByClassName("row");
  const ships = document.getElementsByClassName("ship-button");
  const validate = document.getElementById("SELFBOARD").getElementsByClassName("validate")[0];

  //update board
  updateGrid(GAME.enemy.grid.grid, "grid_p2");
  updateGrid(GAME.player.grid, "grid_p1");
  document.getElementById("gamecontainer").style["top"] = "-100vh";
  checkSpecialShots();
  checkMaluses();
  checkBonuses();

  document.getElementById("rotation").addEventListener('click', function(e) {
    placingShip.rotation = !placingShip.rotation;
    if(placingShip.rotation) {
      document.getElementById("rotation").classList.add("rotate");
    } else {
      document.getElementById("rotation").classList.remove("rotate");
    }
    checkImpossibleCells(placingShip);
  });

  const shipButtons = document.getElementsByClassName('ship-button');
  for (let shipButton of shipButtons) {
    shipButton.addEventListener('click', function(e)
        {
          elem = e.target;
          while(!elem.classList.contains("ship-button")) elem = elem.parentNode;
          for (shipButton of shipButtons) shipButton.classList.remove('button-selected');
          elem.classList.add('button-selected');
          if(GAME.player.ships.searchShip(elem.name).isOnGrid()) {
            GAME.player.ships.unsetShip(elem.name);
            elem.classList.remove("ship-placed");
          }
          placingShip.name = elem.name;  // DEFINE [placingShip] NAME IN [placingPhase] FUNCTION
          displayShips(GAME.player.ships.ships);
          checkImpossibleCells(placingShip);
        });
    }


  let placed;
  for(let y=0; y<rows.length; y++) {
    row = rows.item(y).getElementsByClassName("cell");
    for(let x=0; x<row.length; x++) {
      row.item(x).addEventListener("click", function(e)
          {
            if(e.target.classList.contains("cell") && !(e.target.classList.contains("unavailable") || e.target.classList.contains("impossible"))) {
              if(placingShip.name!="") {
                placed = GAME.player.placeShip(placingShip.name, placingShip.rotation, y,x);
                for(let ship of ships) {
                  if(placed && ship.name==placingShip.name) {
                    ship.classList.add("ship-placed");
                    placingShip.name = "";
                  }
                }
                displayShips(GAME.player.ships.ships);
                checkImpossibleCells(placingShip);
              }
            }
          });
    }
  }
  validate.addEventListener("click", function()
      {
        if(GAME.player.ships.allShipsPlaced()) {
          displayShips(GAME.player.ships.ships);
          shootingPhase(solo);
        }
      });


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
          if(elem.classList.contains("possible") && shootingBlock.special!=elem.id) {
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
                  if(solo && GAME.enemyAlive) GAME.playerAlive = GAME.enemy.attack(GAME.player, GAME.enemy.grid);
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
GAME.solo = function(difficulty) {
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

  //placingPhase(true);
  IA.placeShips(GAME.player);
  displayShips(GAME.player.ships.ships);
  shootingPhase(true);
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
