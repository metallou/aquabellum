"use strict"

const types = {
  Boolean: 1,
  Number: 2,
  Array: 3,
  Object: 4,
  Function: 5
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
class Check
{
  static list(list, object)
  {
    Check.def(list);
    Check.def(object);
    if(!(Object.prototype.toString.call(list)==="[object Object]")) throw "wrong list type"
        +"\n"
        +"(received " + Object.prototype.toString.call(list) + ")"
        +"\n"
        +"(expected " + Object.prototype.toString.call({}) + ")";
    if(!(Object.prototype.toString.call(object)==="[object String]")) throw "wrong object type"
        +"\n"
        +"(received " + Object.prototype.toString.call(object) + ")"
        +"\n"
        +"(expected " + Object.prototype.toString.call("") + ")";
    if(!list[object]) throw "object not in list"
        +"\n"
        +"(received \"" + object + "\")";
  }
  static def(object)
  {
    if(object===null) throw "null";
    if(object===undefined) throw "undefined";
  }
  static proto(object, type)
  {
    Check.def(object);
    Check.def(type);
    if(!(Object.prototype.toString.call(type)==="[object String]")) throw "wrong type type";
    Check.list(types, type);
    if(!(Object.prototype.toString.call(object)==="[object "+type+"]")) throw "wrong object type";
  }
}

class Block
{
  constructor()
  {
    this.state = blockStates["unknown"];
    this.hasShip = false;
  }
  getState()
  {
    return this.state;
  }
  setState(state)
  {
    try {
      try {
        Check.def(state);
        Check.list(blockStates, state);
      } catch(error) {
        throw "state: " + error;
      }
      try {
        if(!this.hasShip && (state=="ship" || state=="hit" || state=="sunk")) throw "no ship yet \"ship\"/\"hit\"/\"sunk\"";
        if(this.hasShip && (state=="miss" || state=="empty")) throw "ship yet miss/empty";
      } catch(error) {
        throw "impossible state: " + error;
      }
    } catch(error) {
      throw Error("Block (setState) - " + error);
    }

    this.state = blockStates[state];
    return true;
  }
  setShip()
  {
    this.hasShip = true;
    return true;
  }
  unsetShip()
  {
    return true;
  }
}

class SpecialShot
{
  constructor(length,silent)
  {
    let str;
    try {
      try {
        Check.def(length);
        Check.proto(length, "Number");
        if(length<2) throw "too low";
        if(length>5) throw "too high";
      } catch(error) {
        throw "length: " + error;
      }
      try {
        Check.def(silent);
        Check.proto(silent, "Boolean");
      } catch(error) {
        throw "silent: " + error;
      }
      if(silent && length!=3) throw "impossible combination";
      switch(length) {
        case 2:
          str = "destroyer";
          break;
        case 3:
          if(silent) {
            str = "submarine";
          } else {
            str = "cruiser";
          }
          break;
        case 4:
          str = "battleship";
          break;
        case 5:
          str = "carrier";
          break;
        default:
          throw Error("What the fuck ? Not supposed to go here");
      }
      try {
        Check.list(ships, str);
      } catch(error) {
        throw "ship: " + error;
      }
    } catch(error) {
      throw "SpecialShot (constructor) - " + error;
    }

    this.limit = length;
    this.charge = 0;
    this.specialShot = ships[str];
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
  constructor(length, silent)
  {
    let str;
    try {
      try {
        Check.def(length);
        Check.proto(length, "Number");
        if(length<2) throw "too low";
        if(length>5) throw "too high";
      } catch(error) {
        throw "length: " + error;
      }
      try {
        Check.def(silent);
        Check.proto(silent, "Boolean");
      } catch(error) {
        throw "silent: " + error;
      }
      if(silent && length!=3) throw "impossible combination";
      switch(length) {
        case 2:
          str = "destroyer";
          break;
        case 3:
          if(silent) {
            str = "submarine";
          } else {
            str = "cruiser";
          }
          break;
        case 4:
          str = "battleship";
          break;
        case 5:
          str = "carrier";
          break;
        default:
          throw Error("What the fuck ? Not supposed to go here");
      }
      try {
        Check.list(ships, str);
      } catch(error) {
        throw "ship: " + error;
      }
    } catch(error) {
      throw "Ship (constructor) - " + error;
    }

    this.name = str;
    this.length = length;
    this.blocks = [];
    for(let i=0; i<length; i++) {
      this.blocks.push(null);
    }
    console.log(this.blocks);
    this.silent = silent;
    this.stayinAlive = true;
    this.specialShot = new SpecialShot(length, silent);
    return true;
  }
  updateSpecialShot(up)
  {
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
  setBlocks(blocks)
  {
    try {
      try {
        Check.def(blocks);
        Check.proto(blocks, "Array");
        if(blocks.length!=this.length) throw "wrong size";
      } catch(error) {
        throw "blocks: " + error;
      }
    } catch(error) {
      throw "Ship (setBlocks) - " + error;
    }
    for(let i in blocks){
      this.blocks[i] = blocks[i];
    }
  }
}
class Ships
{
  constructor()
  {
    this.ships = [];
    this.ships.push(new Ship(2,false));
    this.ships.push(new Ship(3,false));
    this.ships.push(new Ship(3,true));
    this.ships.push(new Ship(4,false));
    this.ships.push(new Ship(5,false));
    this.specialShotsCharge = [];
    this.resetSpecialShot();
  }
  searchShip(name)
  {
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
    return this.ships.find(function(ship)
        {
          return ship.name===name;
        });
  }
  stillAlive()
  {
    for(let i in this.ships) {
      if(this.ships[i].stayinAlive) return true;
    }
    return false;
  }
  updateSpecialShots(up)
  {
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
    for(let i in this.ships) {
      this.specialShots[i] = this.ships[i].updateSpecialShot(up);
    }
  }
  resetSpecialShots()
  {
    for(let i in this.ships) {
      this.specialShots[i] = this.ships[i].resetSpecialShot();
    }
  }
  setShipBlocks(name, blocks)
  {
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
      } catch(error) {
        throw "blocks: " + error;
      }
    } catch(error) {
      throw "Ship (insertShip) - " + error;
    }
    this.searchShip(name).setBlocks(blocks);
  }
}

class Grid
{
  constructor()
  {

  }

}

let tmp;
tmp = new Ship(3,false);
