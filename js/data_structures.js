"use strict"

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
        if(!(Object.prototype.toString.call(object)==="[object "+type+"]")) throw "wrong type"
          +"\n"
          +"(received " + str + ")"
          +"\n"
          +"(expected " + "[object "+type+"]" + ")";
      } catch(error) {
        throw "object: " + error;
      }
    } catch(error) {
      throw "Check.proto - " + error;
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
  constructor(x, y)
  {
    try {
      try {
        Check.def(x);
        Check.proto(x, "Number");
        Check.sup(x, 0);
        Check.inf(x, 9);
      } catch(error) {
        throw "x: " + error;
      }
      try {
        Check.def(y);
        Check.proto(y, "Number");
        Check.sup(y, 0);
        Check.inf(y, 9);
      } catch(error) {
        throw "y: " + error;
      }
    } catch(error) {
      throw Error("Block (constructor) - " + error);
    }

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
        Check.sup(length, 2);
        Check.inf(length, 5);
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
        Check.sup(length, 2);
        Check.inf(length, 2);
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
