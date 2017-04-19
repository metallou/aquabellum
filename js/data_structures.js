"use strict"

const affectedBy = function(owner, key)
{
    if(DEBUG) {
      try {
        try {
          Check.def(owner);
          Check.proto(owner, "String");
          Check.list(owner, PLAYERS);
        } catch(error) {
          throw "owner: " + error;
        }
        try {
          Check.def(key);
          Check.proto(key, "String");
        } catch(error) {
          throw "key: " + error;
        }
      } catch(error) {
        throw Error("Function (affectedBy) - " + error);
      }
    }

  return (owner==="self" || owner==="other") && localStorage.getItem(key)==="on";
}



class Block
{
  constructor(row, column)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(row);
          Check.proto(row, "Number");
          Check.sup(row, 0);
          Check.inf(row, 9);
        } catch(error) {
          throw "row: " + error;
        }
        try {
          Check.def(column);
          Check.proto(column, "Number");
          Check.sup(column, 0);
          Check.inf(column, 9);
        } catch(error) {
          throw "column: " + error;
        }
      } catch(error) {
        throw Error("Block (constructor) - " + error);
      }
    }

    this.state = "unknown";
    this.ship = false;
    this.shipName = null;
    this.row = row;
    this.column = column;
    this.proba = 0;
  }
  getProba()
  {
    return this.proba;
  }
  addProba()
  {
    this.proba++;
  }
  resetProba()
  {
    this.proba = 0;
  }
  hasShip()
  {
    return this.ship;
  }
  setShip(name)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(name);
          Check.proto(name, "String");
          Check.list(name, SHIPS);
        } catch(error) {
          throw "name: " + error;
        }
      } catch(error) {
        throw Error("Block (setShip) - " + error);
      }
    }

    this.shipName = name;
    this.ship = true;
  }
  unsetShip()
  {
    this.ship = false;
  }
  getRow()
  {
    return this.row;
  }
  getColumn()
  {
    return this.column;
  }
  getPos()
  {
    let block = {};
    block.row = this.getRow();
    block.column = this.getColumn();
    return block;
  }
  canPlaceShipAt()
  {
    if(this.hasShip()) return false;
    return true;
  }
  isEqualTo(state)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(state);
          Check.proto(state, "String");
          Check.list(state, STATES);
        } catch(error) {
          throw "state: " + error;
        }
      } catch(error) {
        throw Error("Block (isEqualTo) - " + error);
      }
    }

    if(this.getState()===state) return true;
    return false;
  }
  canWelcomeShip()
  {
    if(this.getState()==="ship") return true;
    if(this.getState()==="hit") return true;
    if(this.getState()==="unknown") return true;
    return false;
  }
  canGoThrough()
  {
    if(this.getState()==="unknown") return true;
    if(this.getState()==="empty") return true;
    if(this.getState()==="miss") return true;
    if(this.getState()==="ship") return true;
    return false;
  }
  canBeShotAt()
  {
    if(this.getState()=="unknown") return true;
    if(this.getState()==="ship") return true;
    return false;
  }
  mustBeLookedAt()
  {
    if(this.getState()==="ship") return true;
    if(this.getState()==="hit") return true;
    return false;
  }
  shouldNotBeLookedAt()
  {
    if(this.getState()==="miss") return true;
    if(this.getState()==="sunk") return true;
    return false;
  }
  onHighwayToHell()
  {
    if(this.getState()==="hit") return true;
    if(this.getState()==="sunk") return true;
    return false;
  }
  getState()
  {
    return this.state;
  }
  setState(state)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(state);
          Check.proto(state, "String");
          Check.list(state, STATES);
        } catch(error) {
          throw "state: " + error;
        }
        try {
          if(!this.hasShip() &&
              (state==="ship" || state==="hit" || state==="sunk")) {
            throw "no ship yet \"ship\"/\"hit\"/\"sunk\"";
          }
          if(this.hasShip() &&
              (state==="miss" || state==="empty")) {
            throw "ship yet miss/empty";
          }
        } catch(error) {
          throw "impossible state: " + error;
        }
      } catch(error) {
        throw Error("Block (setState) - " + error);
      }
    }

    this.state = state;
  }
}

class Shot
{
  static normalShot(grid, block)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(grid);
          Check.proto(grid, "Object");
          Check.instance(grid, Grid);
        } catch(error) {
          throw "grid : " + error;
        }
        try {
          Check.def(block);
          Check.proto(block, "Object");
          Check.instance(block, Block);
        } catch(error) {
          throw "block : " + error;
        }
      } catch(error) {
        throw Error("Shot (normalShot) - " + error);
      }
    }

    if(block.canBeShotAt()) {
      if(block.hasShip()) {
        block.setState("hit");
        grid.ships.searchShip(block.shipName).amIDead();
        return true;
      } else {
        block.setState("miss");
        return false;
      }
    }
    return false;
  }
  static flareShot(grid, block)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(grid);
          Check.proto(grid, "Object");
          Check.instance(grid, Grid);
        } catch(error) {
          throw "grid : " + error;
        }
        try {
          Check.def(block);
          Check.proto(block, "Object");
          Check.instance(block, Block);
        } catch(error) {
          throw "block : " + error;
        }
      } catch(error) {
        throw Error("Shot (flareShot) - " + error);
      }
    }

    if(block.isEqualTo("unknown")) {
      if(block.hasShip()) {
        block.setState("ship");
      } else {
        block.setState("empty");
      }
    }
    return false;
  }
  static destroyerShot(grid, block)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(grid);
          Check.proto(grid, "Object");
          Check.instance(grid, Grid);
        } catch(error) {
          throw "grid : " + error;
        }
        try {
          Check.def(block);
          Check.proto(block, "Object");
          Check.instance(block, Block);
        } catch(error) {
          throw "block : " + error;
        }
      } catch(error) {
        throw Error("Shot (destroyerShot) - " + error);
      }
    }

    let blocks = [];
    let pos = block.getPos();
    for(let y=pos.row-1; y<=(pos.row+1); y++) {
      if(y>=0 && y<=9) {
        for(let x=(pos.column-1); x<=(pos.column+1); x++) {
          if(x>=0 && x<=9) {
            if(grid.grid[y][x] && grid.grid[y][x].canBeShotAt()) {
              if(grid.grid[y][x]!=block) blocks.push(grid.grid[y][x]);
            }
          }
        }
      }
    }

    let hit = Shot.normalShot(grid, block);

    //Attempt to perform SpecialShot
    const ship = grid.ships.searchShip("destroyer");
    //is alive
    if(ship.stillAlive()) {
      //can use
      if(ship.specialShot.canUse()) {
        //can shoot
        if(blocks.length>0) {
          const i = parseInt(Math.random()*1000*blocks.length)%blocks.length;
          hit = Shot.flareShot(grid, blocks[i]) || hit;
          ship.specialShot.reset();
          //reveal if malus
          if(ship.cantTouchThis()) {
            ship.reveal();
          }
        }
      }
    }
    return hit;
  }
  static cruiserShot(grid, block)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(grid);
          Check.proto(grid, "Object");
          Check.instance(grid, Grid);
        } catch(error) {
          throw "grid : " + error;
        }
        try {
          Check.def(block);
          Check.proto(block, "Object");
          Check.instance(block, Block);
        } catch(error) {
          throw "block : " + error;
        }
      } catch(error) {
        throw Error("Shot (cruiserShot) - " + error);
      }
    }

    let blocks = [];
    let pos = block.getPos();
    for(let y=pos.row-1; y<=(pos.row+1); y++) {
      if(y>=0 && y<=9) {
        for(let x=(pos.column-1); x<=(pos.column+1); x++) {
          if(x>=0 && x<=9) {
            if(grid.grid[y][x] && grid.grid[y][x].canBeShotAt()) {
              if(grid.grid[y][x]!=block) blocks.push(grid.grid[y][x]);
            }
          }
        }
      }
    }

    let hit = Shot.normalShot(grid, block);

    //Attempt to perform SpecialShot
    const ship = grid.ships.searchShip("cruiser");
    //is alive
    if(ship.stillAlive()) {
      //can use
      if(ship.specialShot.canUse()) {
        //can shoot
        if(blocks.length>0) {
          const i = parseInt(Math.random()*1000*blocks.length)%blocks.length;
          hit = Shot.normalShot(grid, blocks[i]) || hit;
          ship.specialShot.reset();
          //reveal if malus
          if(ship.cantTouchThis()) {
            ship.reveal();
          }
        }
      }
    }
    return hit;
  }
  static submarineShot(grid, block)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(grid);
          Check.proto(grid, "Object");
          Check.instance(grid, Grid);
        } catch(error) {
          throw "grid : " + error;
        }
        try {
          Check.def(block);
          Check.proto(block, "Object");
          Check.instance(block, Block);
        } catch(error) {
          throw "block : " + error;
        }
      } catch(error) {
        throw Error("Shot (submarineShot) - " + error);
      }
    }

    let blocks = [];
    let pos = block.getPos();
    let tmpblock;
    for(let y=pos.row; y>=0; y--) {
      tmpblock = grid.grid[y][pos.column];
      if(tmpblock.canGoThrough()) {
        blocks.push(tmpblock);
        if(tmpblock.isEqualTo("ship")) break;
      } else {
        break;
      }
    }

    let hit = Shot.normalShot(grid, block);

    //Attempt to perform SpecialShot
    const ship = grid.ships.searchShip("destroyer");
    //is alive
    if(ship.stillAlive()) {
      //can use
      if(ship.specialShot.canUse()) {
        //can shoot
        if(blocks.length>0) {
          for(let i in blocks) {
            hit = Shot.normalShot(grid, blocks[i]) || hit;
            if(blocks[i].hasShip()) break;
          }
          ship.specialShot.reset();
          //reveal if malus
          if(ship.cantTouchThis()) {
            ship.reveal();
          }
        }
      }
    }
    return hit;
  }
  static battleshipShot(grid, block)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(grid);
          Check.proto(grid, "Object");
          Check.instance(grid, Grid);
        } catch(error) {
          throw "grid : " + error;
        }
        try {
          Check.def(block);
          Check.proto(block, "Object");
          Check.instance(block, Block);
        } catch(error) {
          throw "block : " + error;
        }
      } catch(error) {
        throw Error("Shot (battleshipShot) - " + error);
      }
    }

    let blocks = [];
    let pos = block.getPos();
    for(let y=pos.row-1; y<=(pos.row+1); y++) {
      if(y>=0 && y<=9) {
        for(let x=(pos.column-1); x<=(pos.column+1); x++) {
          if(x>=0 && x<=9) {
            if(grid.grid[y][x] && grid.grid[y][x].canBeShotAt()) {
              blocks.push(grid.grid[y][x]);
            }
          }
        }
      }
    }

    let hit = Shot.normalShot(grid, block);

    //Attempt to perform SpecialShot
    const ship = grid.ships.searchShip("battleship");
    //is alive
    if(ship.stillAlive()) {
      //can use
      if(ship.specialShot.canUse()) {
        //can shoot
        if(blocks.length>0) {
          for(let i in blocks) {
            hit = Shot.flareShot(grid, blocks[i]) || hit;
          }
          ship.specialShot.reset();
          //reveal if malus
          if(ship.cantTouchThis()) {
            ship.reveal();
          }
        }
      }
    }
    return hit;
  }
  static carrierShot(grid, block)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(grid);
          Check.proto(grid, "Object");
          Check.instance(grid, Grid);
        } catch(error) {
          throw "grid : " + error;
        }
        try {
          Check.def(block);
          Check.proto(block, "Object");
          Check.instance(block, Block);
        } catch(error) {
          throw "block : " + error;
        }
      } catch(error) {
        throw Error("Shot (carrierShot) - " + error);
      }
    }

    let blocks = [];
    let pos = block.getPos();
    for(let y=pos.row-1; y<=(pos.row+1); y++) {
      if(y>=0 && y<=9) {
        for(let x=(pos.column-1); x<=(pos.column+1); x++) {
          if(x>=0 && x<=9) {
            if(grid.grid[y][x] && grid.grid[y][x].canBeShotAt()) {
              blocks.push(grid.grid[y][x]);
            }
          }
        }
      }
    }

    let hit = Shot.normalShot(grid, block);

    //Attempt to perform SpecialShot
    const ship = grid.ships.searchShip("carrier");
    //is alive
    if(ship.stillAlive()) {
      //can use
      if(ship.specialShot.canUse()) {
        //can shoot
        if(blocks.length>0) {
          for(let i in blocks) {
            hit = Shot.normalShot(grid, blocks[i]) || hit;
          }
          ship.specialShot.reset();
          //reveal if malus
          if(ship.cantTouchThis()) {
            ship.reveal();
          }
        }
      }
    }
    return hit;
  }
}
class SpecialShot extends Shot
{
  constructor(name, length)
  {
    super();
    if(DEBUG) {
      try {
        try {
          Check.def(length);
          Check.proto(length, "Number");
          Check.sup(length, 2);
          Check.inf(length, 5);
        } catch(error) {
          throw "length: " + error;
        }
        try {
          Check.def(name);
          Check.proto(name, "String");
          Check.list(name, SHIPS);
        } catch(error) {
          throw "name: " + error;
        }
      } catch(error) {
        throw "SpecialShot (constructor) - " + error;
      }
    }

    this.name = name;
    this.limit = 2*length;
    this.charge = 0;
    switch(name) {
      case "destroyer":
        this.specialShot = Shot.destroyerShot;
        break;
      case "cruiser":
        this.specialShot = Shot.cruiserShot;
        break;
      case "submarine":
        this.specialShot = Shot.submarineShot;
        break;
      case "battleship":
        this.specialShot = Shot.battleshipShot;
        break;
      case "carrier":
        this.specialShot = Shot.carrierShot;
        break;
      default:
        throw Error("What the fuck ? Not supposed to go here");
    }
  }
  reset()
  {
    this.charge = 0;
    return this.limit;
  }
  canUse()
  {
    if(affectedBy("SHOT"+this.name)) {
      return this.charge===this.limit;
    }
    return false;
  }
  pumpItUp()
  {
    if(this.charge<this.limit) this.charge++;
    return this.limit - this.charge;
  }
  relaxMan()
  {
    if(this.charge>0) this.charge--;
    return this.limit - this.charge;
  }
}

class Ship
{
  constructor(owner, name)
  {
    let str;
    if(DEBUG) {
      try {
        try {
          Check.def(owner);
          Check.proto(owner, "String");
          Check.list(owner, PLAYERS);
        } catch(error) {
          throw "owner: " + error;
        }
        try {
          Check.def(name);
          Check.proto(name, "String");
          Check.list(name, SHIPS);
        } catch(error) {
          throw "name: " + error;
        }
      } catch(error) {
        throw "Ship (constructor) - " + error;
      }
    }

    this.owner = owner;
    this.name = name;
    switch(this.name) {
      case "destroyer":
        this.length = 2;
        this.silent = false;
        break;
      case "cruiser":
        this.length = 3;
        this.silent = false;
        break;
      case "submarine":
        this.length = 3;
        this.silent = true;
        break;
      case "battleship":
        this.length = 4;
        this.silent = false;
        break;
      case "carrier":
        this.length = 5;
        this.silent = false;
        break;
      default:
        throw Error("What the fuck ? Not supposed to go here");
    };
    this.blocks = [];
    for(let i=0; i<length; i++) {
      this.blocks.push(null);
    }
    this.rotation = false;
    this.onGrid = false;
    this.stayinAlive = true;
    this.specialShot = new SpecialShot(this.name, this.length);
    return true;
  }
  getLength()
  {
    return this.length;
  }
  isSilent()
  {
    return this.silent;
  }
  updateSpecialShot(up)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(up);
          Check.proto(up, "Boolean");
        } catch(error) {
          throw "up: " + error;
        }
      } catch(error) {
        throw "Ship (updateSpecialShot) - " + error;
      }
    }
    if(up) {
      return this.specialShot.pumpItUp();
    } else {
      return this.specialShot.relaxMan();
    }
  }
  resetSpecialShot()
  {
    return this.specialShot.reset();
  }
  isOnGrid()
  {
    return this.onGrid;
  }
  setOnGrid()
  {
    this.onGrid = true;
  }
  setOffGrid()
  {
    this.onGrid = false;
  }
  getRotation()
  {
    return this.rotation;
  }
  rotate()
  {
    if(this.getRotation()) {
      this.unsetRotation();
    } else {
      this.setRotation();
    }
  }
  setRotation()
  {
    this.rotation = true;
  }
  unsetRotation()
  {
    this.rotation = false;
  }
  cantTouchThis()
  {
    if(affectedBy(this.owner, "MALUSreveal") && !this.isSilent()) {
      for(let i in this.blocks) {
        if(this.blocks[i].onHighwayToHell()) return true;
      }
    }
    return false;
  }
  stillAlive()
  {
    if(this.stayinAlive) return true;
    return false;
  }
  kill()
  {
    for(let i in this.blocks) {
      this.blocks[i].setState("sunk");
    }
    this.stayinAlive = false;
  }
  amIDead()
  {
    let dead = true;
    for(let i in this.blocks) {
      if(!this.blocks[i].onHighwayToHell()) dead = false;
    }
    if(dead) this.kill();
    return dead;
  }
  setBlocks(name, blocks)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(name);
          Check.proto(name, "String");
          Check.list(name, SHIPS);
        } catch(error) {
          throw "name: " + error;
        }
        try {
          Check.def(blocks);
          Check.proto(blocks, "Array");
          if(blocks.length!=this.getLength()) throw "wrong size";
          for(let i in blocks) {
            Check.instance(blocks[i], Block);
          }
        } catch(error) {
          throw "blocks: " + error;
        }
      } catch(error) {
        throw "Ship (setBlocks) - " + error;
      }
    }
    if(this.isOnGrid()) {
      throw Error("Ship Already set");
    } else {
      for(let i in blocks) {
        if(blocks[i].hasShip()) return false;
      }
      for(let i in blocks) {
        blocks[i].setShip(name);
        this.blocks[i] = blocks[i];
      }

      this.setOnGrid();
      return true;
    }
  }
  reveal()
  {
    for(let i in this.blocks) {
      if(this.blocks[i].isEqualTo("unknown")) this.blocks[i].setState("ship");
    }
  }
}
class Ships
{
  constructor(owner)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(owner);
          Check.proto(owner, "String");
          Check.list(owner, PLAYERS);
        } catch(error) {
          throw "owner: " + error;
        }
      } catch(error) {
        throw Error("Ships (constructor) - " + error);
      }
    }

    this.owner = owner;
    this.ships = [];
    this.ships.push(new Ship(owner, "destroyer"));
    this.ships.push(new Ship(owner, "cruiser"));
    this.ships.push(new Ship(owner, "submarine"));
    this.ships.push(new Ship(owner, "battleship"));
    this.ships.push(new Ship(owner, "carrier"));
    this.specialShotsCharge = [];
    this.resetSpecialShots();
  }
  searchShip(name)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(name);
          Check.proto(name, "String");
          Check.list(name, SHIPS);
        } catch(error) {
          throw "name: " + error;
        }
      } catch(error) {
        throw "Ships (searchShip) - " + error;
      }
    }

    return this.ships.find(function(ship)
        {
          return ship.name===name;
        });
  }
  stillAlive()
  {
    for(let i in this.ships) {
      if(this.ships[i].stillAlive()) return true;
    }
    return false;
  }
  updateSpecialShots(up)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(up);
          Check.proto(up, "Boolean");
        } catch(error) {
          throw "up: " + error;
        }
      } catch(error) {
        throw "Ships (updateSpecialShots) - " + error;
      }
    }

    for(let i in this.ships) {
      this.specialShotsCharge[i] = this.ships[i].updateSpecialShot(up);
    }
  }
  resetSpecialShots()
  {
    for(let i in this.ships) {
      this.specialShotsCharge[i] = this.ships[i].resetSpecialShot();
    }
  }
  allShipsPlaces()
  {
    for(let i in this.ships) {
      if(!this.ships[i].isOnGrid()) return false;
    }
    return true;
  }
  setShipBlocks(name, blocks)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(name);
          Check.proto(name, "String");
          Check.list(name, SHIPS);
        } catch(error) {
          throw "name: " + error;
        }
        try {
          Check.def(blocks);
          Check.proto(blocks, "Array");
          if(blocks.length!=this.searchShip(name).getLength()) {
            throw "wrong size";
          }
          for(let i in blocks) {
            Check.instance(blocks[i], Block);
          }
        } catch(error) {
          throw "blocks: " + error;
        }
      } catch(error) {
        throw "Ship (insertShip) - " + error;
      }
    }

    return this.searchShip(name).setBlocks(name, blocks);
  }
}

class Grid
{
  constructor(owner)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(owner);
          Check.proto(owner, "String");
          Check.list(owner, PLAYERS);
        } catch(error) {
          throw "owner: " + error;
        }
      } catch(error) {
        throw Error("Grid (constructor) - " + error);
      }
    }

    this.owner = owner;
    this.login = "";
    this.ships = new Ships(owner);
    this.grid = [];
    let tmp;
    for(let i=0; i<10; i++) {
      tmp = [];
      for(let j=0; j<10; j++) {
        tmp.push(new Block(i,j));
      }
      this.grid.push(tmp);
    }
  }
  readyToBegin()
  {
    return this.ships.allShipsPlaced();
  }
  setLogin(login)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(owner);
          Check.proto(owner, "String");
        } catch(error) {
          throw "name: " + error;
        }
      } catch(error) {
        throw Error("Grid (setLogin) - " + error);
      }
    }

    this.login = login;
  }
  placeShip(name, rotation, row, column)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(name);
          Check.proto(name, "String");
          Check.list(name, SHIPS);
        } catch(error) {
          throw "name: " + error;
        }
        try {
          Check.def(rotation);
          Check.proto(rotation, "Boolean");
        } catch(error) {
          throw "rotation: " + error;
        }
        try {
          Check.def(row);
          Check.proto(row, "Number");
          Check.sup(row, 0);
          Check.inf(row, 9);
        } catch(error) {
          throw "row: " + error;
        }
        try {
          Check.def(column);
          Check.proto(column, "Number");
          Check.sup(column, 0);
          Check.inf(column, 9);
        } catch(error) {
          throw "column: " + error;
        }
      } catch(error) {
        throw Error("Grid (placeShip) - " + error);
      }
    }

    let ship = this.ships.searchShip(name);
    let blocks = [];
    for(let i=0; i<ship.getLength(); i++) {
      if(rotation) {
        blocks.push(this.grid[row][column+i])
      } else {
        blocks.push(this.grid[row+i][column])
      }
    }

    return this.ships.setShipBlocks(name, blocks);
  }
  resetProbas()
  {
    for(let i in this.grid) {
      for(let j in this.grid[i]) {
        this.grid[i][j].resetProba();
      }
    }
  }
  searchTarget()
  {
    for(let i in this.grid) {
      for(let j in this.grid[i]) {
        if(this.grid[i][j].mustBeLookedAt()) return this.grid[i][j];
      }
    }
    return null;
  }
  fireAt(block, attackMode)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(block);
          Check.proto(block, "Object");
          Check.instance(block, Block);
        } catch(error) {
          throw "block: " + error;
        }
        try {
          Check.def(attackMode);
          Check.proto(attackMode, "Function");
        } catch(error) {
          throw "attackMode: " + error;
        }
      } catch(error) {
        throw Error("Grid (fireAt) - " + error);
      }
    }

    attackMode(this, block);

    const chance = parseInt(Math.random()*1000);
    if(affectedBy(this.owner, "MALUSrevealblock") && chance%10===0) {
        let blocks = [];
        let tmp;
        if(affectedBy(this.owner, "MALUSrevealship") && chance%2===0) {
          for(let i in this.grid) {
            tmp = [];
            for(let j in this.grid[i]) {
              if(this.grid[i][j].isEqualTo("unknown")) {
                if(this.grid[i][j].hasShip()) {
                  tmp.push(this.grid[i][j]);
                }
              }
            }
            blocks.push(tmp);
          }
        } else {
          for(let i in this.grid) {
            tmp = [];
            for(let j in this.grid[i]) {
              if(this.grid[i][j].isEqualTo("unknown")) {
                tmp.push(this.grid[i][j]);
              }
            }
            blocks.push(tmp);
          }
        }
        const i = parseInt(Math.random()*1000*blocks.length)%blocks.length;
        const j = parseInt(Math.random()*1000*blocks[i].length)%blocks[i].length;
        Shot.flareShot(this, this.grid[i][j]);
    }

    //this.visualise();
    return this.ships.stillAlive();
  }
  visualise()
  {
    let str = "";
    for(let i in this.grid) {
      for(let j in this.grid[i]) {
        switch(this.grid[i][j].getState()) {
          case "unknown":
            str += ".";
            break;
          case "empty":
            str += ":";
            break;
          case "miss":
            str += "m";
            break;
          case "ship":
            str += "S";
            break;
          case "hit":
            str += "x";
            break;
          case "sunk":
            str += "X";
            break;
        }
      }
      str += "\n";
    }
    console.log(str);
  }
}
