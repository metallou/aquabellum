"use strict"

const blockStates = {
  unknown: 1,
  empty: 2,
  ship: 3,
  miss: 4,
  hit: 5,
  sunk: 6
};
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
  setState(s)
  {
    console.log(s);
    console.log(blockStates[s]);
    if(!s) throw Error('State not defined');
    if(!blockStates[s]) throw Error('Not a state');
    if(!this.hasShip && (s=="ship" || s=="hit" || s=="sunk")) throw Error('Not a valid state');
    if(this.hasShip && (s=="miss" || s=="empty")) throw Error('Not a valid state 2');

    this.state = blockStates[s];
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

const specialShots = {
  destroyer: 1,
  cruiser: 2,
  submarine: 3,
  battleship: 4,
  carrier: 5
};
class SpecialShot
{
  constructor(l,s)
  {
    this.limit = l;
    this.charge = 0;
    this.ready = false;
    switch(l) {
      case 2:
        this.specialShot = specialShots["destroyer"];
        break;
      case 3:
        if(s) {
          this.specialShot = specialShots["submarine"];
        } else {
          this.specialShot = specialShots["cruiser"];
        }
        break;
      case 4:
        this.specialShot = specialShots["battleship"];
        break;
      case 5:
        this.specialShot = specialShots["carrier"];
        break;
      default:
        throw Error("What the fuck ? Not supposed to go here");
    }
  }
  reset()
  {
    this.charge = 0;
    this.ready = false;
  }
  pompItUp()
  {
    this.charge++;
    this.checkReady();
  }
  checkReady()
  {
    if(this.charge==this.limit) this.ready = true;
  }
}

class Ship
{
  constructor(l, s)
  {
    //Check length
    if(!l) throw Error('Length not defined');
    if(!(typeof(l)==="number")) throw Error('Not a number');
    if(l<2) throw Error('Number too low');
    if(l>5) throw Error('Number too high');
    //Check silent
    if(s===null || s===undefined) throw Error('Silent not defined');
    if(!(typeof(s)==="boolean")) throw Error('Not a boolean');

    this.length = l;
    this.silent = s;
    this.stayinAlive = true;
    this.specialShot = new SpecialShot(l, s);
    return true;
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
  }
  stillAlive()
  {
    for(let i in this.ships)
    {
      if(this.ships[i].stayinAlive) return true;
    }
    return false;
  }
  updateSpecialShots()
  {
    for(let i in this.ships)
    {
      //Not defined yet
      //this.ships[i].updateSpecialShot();
    }
  }
}

class Grid
{
  constructor()
  {

  }

}
