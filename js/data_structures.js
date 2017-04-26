"use strict"

const affectedBy = function(owner, key)
{
  if(DEBUG) {
    Check.owner(owner);
    Check.string(key);
  }

  return (owner==="self" || owner==="other") && localStorage.getItem(key)==="on";
}



class Block
{
  constructor(row, column)
  {
    if(DEBUG) {
      Check.row(row);
      Check.column(column);
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
      Check.name(name);
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
      Check.state(state);
    }

    if(this.getState()===state) return true;
    return false;
  }
  canWelcomeShip()
  {
    if(this.isEqualTo("ship")) return true;
    if(this.isEqualTo("hit")) return true;
    if(this.isEqualTo("unknown")) return true;
    return false;
  }
  canGoThrough()
  {
    if(this.isEqualTo("unknown")) return true;
    if(this.isEqualTo("empty")) return true;
    if(this.isEqualTo("miss")) return true;
    if(this.isEqualTo("ship")) return true;
    return false;
  }
  canBeShotAt()
  {
    if(this.isEqualTo("unknown")) return true;
    if(this.isEqualTo("ship")) return true;
    return false;
  }
  mustBeLookedAt()
  {
    if(this.isEqualTo("ship")) return true;
    if(this.isEqualTo("hit")) return true;
    return false;
  }
  shouldNotBeLookedAt()
  {
    if(this.isEqualTo("miss")) return true;
    if(this.isEqualTo("empty")) return true;
    if(this.isEqualTo("sunk")) return true;
    return false;
  }
  onHighwayToHell()
  {
    if(this.isEqualTo("hit")) return true;
    if(this.isEqualTo("sunk")) return true;
    return false;
  }
  getState()
  {
    return this.state;
  }
  setState(state)
  {
    if(DEBUG) {
      Check.state(state);
      if(!this.hasShip() &&
          (state==="ship" || state==="hit" || state==="sunk")) {
        throw "no ship yet \"ship\"/\"hit\"/\"sunk\"";
      }
      if(this.hasShip() &&
          (state==="miss" || state==="empty")) {
        throw "ship yet miss/empty";
      }
    }

    this.state = state;
  }
}

class Shot
{
  static normalShot(grid, block, gridO)
  {
    if(DEBUG) {
      Check.grid(grid);
      Check.block(block);
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
  static flareShot(grid, block, gridO)
  {
    if(DEBUG) {
      Check.grid(grid);
      Check.block(block);
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
  static destroyerShot(grid, block, gridO)
  {
    if(DEBUG) {
      Check.grid(grid);
      Check.block(block);
      Check.grid(gridO);
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
    const ship = gridO.ships.searchShip("destroyer");
    //is alive
    if(ship.stillAlive()) {
      //can use
      if(ship.specialShot.canUse()) {
        //can shoot
        if(blocks.length>0) {
          gridO.ships.resetSpecialShots();
          const i = parseInt(Math.random()*1000*blocks.length)%blocks.length;
          hit = Shot.flareShot(grid, blocks[i]) || hit;
          //reveal if malus
          if(ship.cantTouchThis()) {
            ship.reveal();
          }
        }
      }
    }
    return hit;
  }
  static cruiserShot(grid, block, gridO)
  {
    if(DEBUG) {
      Check.grid(grid);
      Check.block(block);
      Check.grid(gridO);
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
    const ship = gridO.ships.searchShip("cruiser");
    //is alive
    if(ship.stillAlive()) {
      //can use
      if(ship.specialShot.canUse()) {
        //can shoot
        if(blocks.length>0) {
          gridO.ships.resetSpecialShots();
          const i = parseInt(Math.random()*1000*blocks.length)%blocks.length;
          hit = Shot.normalShot(grid, blocks[i]) || hit;
          //reveal if malus
          if(ship.cantTouchThis()) {
            ship.reveal();
          }
        }
      }
    }
    return hit;
  }
  static submarineShot(grid, block, gridO)
  {
    if(DEBUG) {
      Check.grid(grid);
      Check.block(block);
      Check.grid(gridO);
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
    const ship = gridO.ships.searchShip("submarine");
    //is alive
    if(ship.stillAlive()) {
      //can use
      if(ship.specialShot.canUse()) {
        //can shoot
        if(blocks.length>0) {
          gridO.ships.resetSpecialShots();
          for(let block of blocks) {
            hit = Shot.normalShot(grid, block) || hit;
            if(block.hasShip()) break;
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
  static battleshipShot(grid, block, gridO)
  {
    if(DEBUG) {
      Check.grid(grid);
      Check.block(block);
      Check.grid(gridO);
    }

    let blocks = [];
    let pos = block.getPos();
    let radius = 1;
    if(KONAMI) radius = 2;
    for(let y=(pos.row-radius); y<=(pos.row+radius); y++) {
      if(y>=0 && y<=9) {
        for(let x=(pos.column-radius); x<=(pos.column+radius); x++) {
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
    const ship = gridO.ships.searchShip("battleship");
    //is alive
    if(ship.stillAlive()) {
      //can use
      if(ship.specialShot.canUse()) {
        //can shoot
        if(blocks.length>0) {
          gridO.ships.resetSpecialShots();
          blocks.forEach(function(element, index, array)
              {
                hit = Shot.flareShot(grid, element) || hit;
              });
          //reveal if malus
          if(ship.cantTouchThis()) {
            ship.reveal();
          }
        }
      }
    }
    return hit;
  }
  static carrierShot(grid, block, gridO)
  {
    if(DEBUG) {
      Check.grid(grid);
      Check.block(block);
      Check.grid(gridO);
    }

    let blocks = [];
    let pos = block.getPos();
    let radius = 1;
    if(KONAMI) radius = 2;
    for(let y=(pos.row-radius); y<=(pos.row+radius); y++) {
      if(y>=0 && y<=9) {
        for(let x=(pos.column-radius); x<=(pos.column+radius); x++) {
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
    const ship = gridO.ships.searchShip("carrier");
    //is alive
    if(ship.stillAlive()) {
      //can use
      if(ship.specialShot.canUse()) {
        //can shoot
        if(blocks.length>0) {
          gridO.ships.resetSpecialShots();
          blocks.forEach(function(element, index, array)
              {
                hit = Shot.normalShot(grid, element) || hit;
              });
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
  constructor(owner, name, length)
  {
    super();
    if(DEBUG) {
      Check.owner(owner);
      Check.name(name);
      Check.length(length);
    }

    this.owner = owner;
    this.name = name;
    this.limit = 2*length;
    this.charge = 0;
    if(KONAMI) this.charge = this.limit;
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
    if(KONAMI) this.charge = this.limit;
    return this.limit - this.charge;
  }
  canUse()
  {
    if(KONAMI) return true;
    if(affectedBy(this.owner, "SHOT"+this.name)) {
      return this.charge===this.limit;
    }
    return false;
  }
  pumpItUp()
  {
    if(this.charge<this.limit) this.charge++;
    if(KONAMI) this.charge = this.limit;
    return this.limit - this.charge;
  }
  relaxMan()
  {
    if(this.charge>0) this.charge--;
    if(KONAMI) this.charge = this.limit;
    return this.limit - this.charge;
  }
}

class Ship
{
  constructor(owner, name)
  {
    let str;
    if(DEBUG) {
      Check.owner(owner);
      Check.name(name);
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
    this.specialShot = new SpecialShot(this.owner, this.name, this.length);
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
      Check.up(up);
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
  unsetOnGrid()
  {
    this.onGrid = false;
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
      return this.blocks.some(function(element, index, array)
          {
            return element.onHighwayToHell();
          });
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
    this.blocks.forEach(function(element, index, array)
        {
          element.setState("sunk");
        });
    this.stayinAlive = false;
  }
  amIDead()
  {
    const dead = this.blocks.every(function(element, index, array)
        {
          return element.onHighwayToHell();
        });
    if(dead) this.kill();
    return dead;
  }
  canPlaceShipOver(name, blocks)
  {
    if(DEBUG) {
      Check.name(name);
      Check.blocks(blocks, this.getLength());
    }

    return blocks.every(function(element, index, array)
        {
          return element.canPlaceShipAt();
        });
  }
  canShootShipOver(name, blocks)
  {
    if(DEBUG) {
      Check.name(name);
      Check.blocks(blocks, this.getLength());
    }

    return blocks.every(function(element, index, array)
        {
          return element.canBeShotAt();
        });
  }
  canWelcomeShipOver(blocks)
  {
    if(DEBUG) {
      Check.blocks(blocks, this.getLength());
    }

    return blocks.every(function(element, index, array)
        {
          return element.isEqualTo("unknown") && !element.hasShip();
        });
  }
  setShipOver(name, blocks)
  {
    if(DEBUG) {
      Check.name(name);
      Check.blocks(blocks, this.getLength());
    }

    if(this.isOnGrid()) {
      throw Error("Ship Already set");
    } else {
      if(blocks.some(function(element, index, array)
            {
              return element.hasShip();
            })) {
        return false;
      } else {
        this.blocks = blocks;
        this.blocks.forEach(function(element, index, array)
            {
              element.setShip(name);
            });
        this.setOnGrid();
        return true;
      }
    }
  }
  unsetShip()
  {
    this.blocks.forEach(function(element,index,array)
        {
          element.unsetShip();
        });
    this.blocks = [];
    this.unsetOnGrid();
  }
  reveal()
  {
    this.blocks.forEach(function(element, index, array)
        {
          if(element.isEqualTo("unknown")) element.setState("ship");
        });
  }
}
class Ships
{
  constructor(owner)
  {
    if(DEBUG) {
      Check.owner(owner);
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
      Check.name(name);
    }

    return this.ships.find(function(ship)
        {
          return ship.name===name;
        });
  }
  stillAlive()
  {
    return this.ships.some(function(element, index, array)
        {
          return element.stillAlive();
        })
  }
  updateSpecialShots(up)
  {
    if(DEBUG) {
      Check.up(up);
    }

    let tmp = [];
    this.ships.forEach(function(element, index, array)
        {
          tmp[index] = element.updateSpecialShot(up);
        });
    this.specialShotsCharge = tmp;
  }
  resetSpecialShots()
  {
    let tmp = [];
    this.ships.forEach(function(element, index, array)
        {
          tmp[index] = element.resetSpecialShot();
        });
    this.specialShotsCharge = tmp;
  }
  canPlaceShipOver(name, blocks)
  {
    if(DEBUG) {
      Check.name(name);
      Check.blocks(blocks, this.searchShip(name).getLength());
    }

    return this.searchShip(name).canPlaceShipOver(name, blocks);
  }
  canShootShipOver(name, blocks)
  {
    if(DEBUG) {
      Check.name(name);
      Check.blocks(blocks, this.searchShip(name).getLength());
    }

    return this.searchShip(name).canShootShipOver(name, blocks);
  }
  canWelcomeShipOver(name, blocks)
  {
    if(DEBUG) {
      Check.name(name);
    }

    if(blocks.length!=this.searchShip(name).getLength()) return false;
    return this.searchShip(name).canWelcomeShipOver(blocks);
  }
  setShipOver(name, blocks)
  {
    if(DEBUG) {
      Check.name(name);
      Check.blocks(blocks, this.searchShip(name).getLength());
    }

    return this.searchShip(name).setShipOver(name, blocks);
  }
  unsetShip(name)
  {
    if(DEBUG) {
      Check.name(name);
    }

    this.searchShip(name).unsetShip();
  }
  allShipsPlaced()
  {
    return this.ships.every(function(element,index,array)
        {
          return element.isOnGrid();
        });
  }
}

class Grid
{
  constructor(owner)
  {
    if(DEBUG) {
      Check.owner(owner);
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
      Check.login(login);
    }

    this.login = login;
  }
  placeShip(name, rotation, row, column)
  {
    if(DEBUG) {
      Check.name(name);
      Check.rotation(rotation);
      Check.row(row);
      Check.column(column);
    }

    let ship = this.ships.searchShip(name);
    ship.rotation = rotation;
    let blocks = [];
    for(let i=0; i<ship.getLength(); i++) {
      if(rotation) {
        if(column+i<10) blocks.push(this.grid[row][column+i])
      } else {
        if(row+i<10) blocks.push(this.grid[row+i][column])
      }
    }

    if(blocks.length!=ship.getLength()) return false;
    return this.ships.setShipOver(name, blocks);
  }
  resetProbas()
  {
    for(let i in this.grid) {
      for(let j in this.grid[i]) {
        this.grid[i][j].resetProba();
      }
    }
  }
  searchTargets()
  {
    let targets = [];
    for(let i in this.grid) {
      for(let j in this.grid[i]) {
        if(this.grid[i][j].mustBeLookedAt()) targets.push(this.grid[i][j]);
      }
    }
    return targets;
  }
  fireAt(block, attackMode, gridO)
  {
    if(DEBUG) {
      Check.block(block);
      Check.func(attackMode);
      Check.grid(gridO);
    }

    attackMode(this, block, gridO);
    gridO.ships.updateSpecialShots(true);

    const chance = parseInt(Math.random()*1000);
    if(affectedBy(this.owner, "MALUSrevealblock") && chance%10===0) {
      let blocks = [];
      let tmp;
      if(affectedBy(this.owner, "MALUSrevealship") && chance%20===0) {
        for(let i in this.grid) {
          tmp = [];
          for(let j in this.grid[i]) {
            if(this.grid[i][j].isEqualTo("unknown")) {
              if(this.grid[i][j].hasShip()) {
                tmp.push(this.grid[i][j]);
              }
            }
          }
          if(tmp.length>0) blocks.push(tmp);
        }
      } else {
        for(let i in this.grid) {
          tmp = [];
          for(let j in this.grid[i]) {
            if(this.grid[i][j].isEqualTo("unknown")) {
              tmp.push(this.grid[i][j]);
            }
          }
          if(tmp.length>0) blocks.push(tmp);
        }
      }
      if(blocks.length) {
        const i = parseInt(Math.random()*1000*blocks.length)%blocks.length;
        const j = parseInt(Math.random()*1000*blocks[i].length)%blocks[i].length;
        Shot.flareShot(this, gridO.grid[i][j]);
      }
    }

    return this.ships.stillAlive();
  }
}
