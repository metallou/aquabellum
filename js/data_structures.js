"use strict"

const DEBUG = true;

const types = {
  Boolean: 1,
  Number: 2,
  String: 3,
  Array: 4,
  Object: 5,
  Function: 6
};
const blockStates = {
  unknown: 1,
  empty: 2,
  ship: 3,
  miss: 4,
  hit: 5,
  sunk: 6
};
const ships = {
  destroyer: 1,
  cruiser: 2,
  submarine: 3,
  battleship: 4,
  carrier: 5
};
const players = {
  self: 1,
  other: 2,
  botEasy: 3,
  botMedium: 4,
  botHard: 5
};
class Check
{
  static def(object)
  {
    try {
      if(object===null) throw "null";
      if(object===undefined) throw "undefined";
    } catch(error) {
      throw "Check.def - " + error;
    }
  }
  static list(list, object)
  {
    let str;
    let comp;
    try {
      try {
        this.def(list);
        str = Object.prototype.toString.call(list);
        comp = Object.prototype.toString.call({});
        if(!(str===comp)) throw "wrong type"
          +"\n"
            +"(received " + str + ")"
            +"\n"
            +"(expected " + comp + ")";
        if(Object.keys(list).length===0) throw "empty set";
      } catch(error) {
        throw "list: " + error;
      }
      try {
        this.def(object);
        str = Object.prototype.toString.call(object);
        comp = Object.prototype.toString.call("");
        if(!(str===comp)) throw "wrong type"
          +"\n"
            +"(received " + str + ")"
            +"\n"
            +"(expected " + comp + ")";
        if(!list[object]) throw "not in list"
          +"\n"
            +"(received \"" + object + "\")";
      } catch(error) {
        throw "object: " + error;
      }
    } catch(error) {
      throw "Check.list - " + error;
    }
  }
  static proto(object, type)
  {
    let str;
    let comp;
    try {
      try {
        this.def(type);
        str = Object.prototype.toString.call(type);
        comp = Object.prototype.toString.call("");
        if(!(str===comp)) throw "wrong type"
          +"\n"
            +"(received " + str + ")"
            +"\n"
            +"(expected " + comp + ")";
        Check.list(types, type);
      } catch(error) {
        throw "type: " + error;
      }
      try {
        this.def(object);
        str = Object.prototype.toString.call(object);
        if(!(Object.prototype.toString.call(object)==="[object "+type+"]")) {
          throw "wrong type"
            +"\n"
            +"(received " + str + ")"
            +"\n"
            +"(expected " + "[object "+type+"]" + ")";
        }
      } catch(error) {
        throw "object: " + error;
      }
    } catch(error) {
      throw "Check.proto - " + error;
    }
  }
  static instance(object, objectClass)
  {
    try {
      try {
        this.def(object);
        this.proto(object, "Object");
      } catch(error) {
        throw "object: " + error;
      }
      try {
        this.def(objectClass);
        this.proto(objectClass, "Function");
      } catch(error) {
        throw "objectClass: " + error;
      }
      if(!(object instanceof objectClass)) throw "wrong instance";
    } catch(error) {
      throw "Check.instance - " + error;
    }
  }
  static sup(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(number<limit) throw "too low"
        +"\n"
          +"(received "+number+"<"+limit+")"
    } catch(error) {
      throw "Check.sup - " + error;
    }
  }
  static inf(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(number>limit) throw "too high"
        +"\n"
          +"(received "+number+">"+limit+")"
    } catch(error) {
      throw "Check.inf - " + error;
    }
  }
  static esup(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(number<=limit) throw "too low"
        +"\n"
          +"(received "+number+"<="+limit+")"
    } catch(error) {
      throw "Check.esup - " + error;
    }
  }
  static einf(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(number>=limit) throw "too high"
        +"\n"
          +"(received "+number+">="+limit+")"
    } catch(error) {
      throw "Check.einf - " + error;
    }
  }
  static eq(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(!(number===limit)) throw "not equal"
        +"\n"
          +"(received "+number+"!="+limit+")"
    } catch(error) {
      throw "Check.eq - " + error;
    }
  }
  static neq(number, limit)
  {
    try {
      try {
        this.def(number);
        this.proto(number, "Number");
      } catch(error) {
        throw "number: " + error;
      }
      try {
        this.def(limit);
        this.proto(limit, "Number");
      } catch(error) {
        throw "limit: " + error;
      }
      if(number===limit) throw "equal"
        +"\n"
          +"(received "+number+"=="+limit+")"
    } catch(error) {
      throw "Check.neq - " + error;
    }
  }
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

    this.state = blockStates["unknown"];
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
          Check.list(ships, name);
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
  canWelcomeShip()
  {
    if(this.getState()===blockStates["ship"]) return true;
    if(this.getState()===blockStates["hit"]) return true;
    if(this.getState()===blockStates["unknown"]) return true;
    return false;
  }
  canGoThrough()
  {
    if(this.getState()===blockStates["unknown"]) return true;
    if(this.getState()===blockStates["empty"]) return true;
    if(this.getState()===blockStates["miss"]) return true;
    if(this.getState()===blockStates["ship"]) return true;
    return false;
  }
  canBeShotAt()
  {
    if(this.getState()===blockStates["unknown"]) return true;
    if(this.getState()===blockStates["ship"]) return true;
    return false;
  }
  mustBeShotAt()
  {
    if(this.getState()===blockStates["ship"]) return true;
    return false;
  }
  mustBeLookedAt()
  {
    if(this.getState()===blockStates["hit"]) return true;
    return false;
  }
  shouldNotBeLookedAt()
  {
    if(this.getState()===blockStates["miss"]) return true;
    if(this.getState()===blockStates["sunk"]) return true;
    return false;
  }
  onHighwayToHell()
  {
    if(this.getState()===blockStates["hit"]) return true;
    if(this.getState()===blockStates["sunk"]) return true;
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
          Check.list(blockStates, state);
        } catch(error) {
          throw "state: " + error;
        }
        try {
          if(!this.hasShip() &&
              (state=="ship" || state=="hit" || state=="sunk")) {
            throw "no ship yet \"ship\"/\"hit\"/\"sunk\"";
          }
          if(this.hasShip() &&
              (state=="miss" || state=="empty")) {
            throw "ship yet miss/empty";
          }
        } catch(error) {
          throw "impossible state: " + error;
        }
      } catch(error) {
        throw Error("Block (setState) - " + error);
      }
    }

    this.state = blockStates[state];
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

    if(block.hasShip()) {
      block.setState("hit");
      grid.ships.searchShip(block.shipName).updateState();
    } else {
      block.setState("miss");
    }
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

    if(block.hasShip()) {
      block.setState("ship");
    } else {
      block.setState("empty");
    }
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

    Shot.normalShot(grid, block);
    if(blocks.length>0) {
      const i = parseInt(Math.random()*1000*blocks.length)%blocks.length;
      Shot.flareShot(grid, blocks[i]);
    }
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

    Shot.normalShot(grid, block);
    if(blocks.length>0) {
      const i = parseInt(Math.random()*1000*blocks.length)%blocks.length;
      Shot.normalShot(grid, blocks[i]);
    }
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
      } else {
        break;
      }
    }

    for(let i in blocks) {
      Shot.normalShot(grid, blocks[i]);
      if(blocks[i].hasShip()) break;
    }
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

    for(let i in blocks) {
      Shot.flareShot(grid, blocks[i]);
    }
    Shot.normalShot(grid, block);
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

    for(let i in blocks) {
      Shot.normalShot(grid, blocks[i]);
    }
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
          Check.list(ships, name);
        } catch(error) {
          throw "name: " + error;
        }
      } catch(error) {
        throw "SpecialShot (constructor) - " + error;
      }
    }

    this.limit = length;
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
  constructor(name)
  {
    let str;
    if(DEBUG) {
      try {
        try {
          Check.def(name);
          Check.proto(name, "String");
          Check.list(ships, name);
        } catch(error) {
          throw "name: " + error;
        }
      } catch(error) {
        throw "Ship (constructor) - " + error;
      }
    }

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
  kill()
  {
    for(let i in this.blocks) {
      this.blocks[i].setState("sunk");
    }
    this.stayinAlive = false;
  }
  updateState()
  {
    let dead = true;
    for(let i in this.blocks) {
      if(!this.blocks[i].onHighwayToHell()) dead = false;
    }
    if(dead) this.kill();
  }
  stillAlive()
  {
    if(this.stayinAlive) return true;
    return false;
  }
  setBlocks(name, blocks)
  {
    if(DEBUG) {
      try {
        try {
          Check.def(name);
          Check.proto(name, "String");
          Check.list(ships, name);
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
}
class Ships
{
  constructor()
  {
    this.ships = [];
    this.ships.push(new Ship("destroyer"));
    this.ships.push(new Ship("cruiser"));
    this.ships.push(new Ship("submarine"));
    this.ships.push(new Ship("battleship"));
    this.ships.push(new Ship("carrier"));
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
          Check.list(ships, name);
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
      this.specialShots[i] = this.ships[i].updateSpecialShot(up);
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
          Check.list(ships, name);
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
          Check.list(players, owner);
        } catch(error) {
          throw "owner: " + error;
        }
      } catch(error) {
        throw Error("Grid (constructor) - " + error);
      }
    }

    this.owner = players[owner];
    this.login = "";
    this.ships = new Ships();
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
          Check.list(ships, name);
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
        if(this.grid[i][j].mustBeShotAt()) return this.grid[i][j];
      }
    }
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
    //this.visualise();
    return this.ships.stillAlive();
  }
  visualise()
  {
    let str = "";
    for(let i in this.grid) {
      for(let j in this.grid[i]) {
        switch(this.grid[i][j].getState()) {
          case blockStates["unknown"]:
            str += ".";
            break;
          case blockStates["empty"]:
            str += ":";
            break;
          case blockStates["miss"]:
            str += "m";
            break;
          case blockStates["ship"]:
            str += "S";
            break;
          case blockStates["hit"]:
            str += "x";
            break;
          case blockStates["sunk"]:
            str += "X";
            break;
        }
      }
      str += "\n";
    }
    console.log(str);
  }
}
