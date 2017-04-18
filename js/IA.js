const difficulties = {
  easy: 1,
  medium: 2,
  hard: 3
};
class IA {
  static selectTargetEasy(grid)
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
      } catch(error) {
        throw Error("IA (selectTargetEasy) - " + error);
      }
    }

    let blocks = [];
    let row;
    for(let y in grid.grid) {
      row = [];
      for(let x in grid.grid[y]) {
        if(grid.grid[y][x].canBeShotAt()) row.push(grid.grid[y][x]);
      }
      if(row.length>0) blocks.push(row);
    }

    const i = parseInt(Math.random()*1000*blocks.length)%blocks.length;
    const j = parseInt(Math.random()*1000*blocks[i].length)%blocks[i].length;

    return blocks[i][j];
  }
  static selectTargetMedium(grid)
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
      } catch(error) {
        throw Error("IA (selectTargetMedium) - " + error);
      }
    }

    let blocks = [];
    let row;
    for(let y in grid.grid) {
      row = [];
      for(let x in grid.grid[y]) {
        if((parseInt(x)+parseInt(y))%2===0 && grid.grid[y][x].canBeShotAt()) {
          row.push(grid.grid[y][x]);
        }
      }
      if(row.length>0) blocks.push(row);
    }

    const i = parseInt(Math.random()*1000*blocks.length)%blocks.length;
    const j = parseInt(Math.random()*1000*blocks[i].length)%blocks[i].length;

    return blocks[i][j];
  }
  static selectTargetHard(grid)
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
      } catch(error) {
        throw Error("IA (selectTargetHard) - " + error);
      }
    }

    let possible;
    let blocks;
    let length;

    for(let s in grid.ships.ships) {
      if(grid.ships.ships[s].stillAlive()) {
        length = grid.ships.ships[s].getLength();
        for(let x=0; x<=(10-length); x++) {
          for(let y=0; y<10; y++) {
            blocks = [];
            for(let i=0; i<length; i++) {
              blocks.push(grid.grid[x+i][y]);
            }
            possible = true;
            for(let item in blocks) {
              if(!blocks[item].canBeShotAt()) possible = false;
            }
            if(possible) {
              for(let item in blocks) {
                blocks[item].addProba();
              }
            }
          }
        }
        for(let y=0; y<=(10-length); y++) {
          for(let x=0; x<10; x++) {
            blocks = [];
            for(let i=0; i<length; i++) {
              blocks.push(grid.grid[x][y+i]);
            }
            possible = true;
            for(let item in blocks) {
              if(!blocks[item].canBeShotAt()) possible = false;
            }
            if(possible) {
              for(let item in blocks) {
                blocks[item].addProba();
              }
            }
          }
        }
      }
    }

    let target;
    let proba = 0;
    let tmpproba;
    for(let i in grid.grid) {
      for(let j in grid.grid[i]) {
        tmpproba = grid.grid[i][j].getProba();
        if(tmpproba>proba) {
          proba = tmpproba;
          target = grid.grid[i][j];
        }
      }
    }
    grid.resetProbas();

    return target;
  }

  static huntTargetEasy(grid, block)
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
        throw Error("IA (huntTargetHard) - " + error);
      }
    }

    let target;
    const pos = block.getPos();

    target = block;
    for(let y=pos.row; y>=0 && !target.shouldNotBeLookedAt(); y--) {
      target = grid.grid[y][pos.column];
      if(target.canBeShotAt()) return target;
    }
    target = block;
    for(let y=pos.row; y<10 && !target.shouldNotBeLookedAt(); y++) {
      target = grid.grid[y][pos.column];
      if(target.canBeShotAt()) return target;
    }
    target = block;
    for(let x=pos.column; x>=0 && !target.shouldNotBeLookedAt(); x--) {
      target = grid.grid[pos.row][x];
      if(target.canBeShotAt()) return target;
    }
    target = block;
    for(let x=pos.column; x<10 && !target.shouldNotBeLookedAt(); x++) {
      target = grid.grid[pos.row][x];
      if(target.canBeShotAt()) return target;
    }
  }
  static huntTargetMedium(grid, block)
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
        throw Error("IA (huntTargetMedium) - " + error);
      }
    }

    return IA.huntTargetEasy(grid, block);
  }
  static huntTargetHard(grid, block)
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
        throw Error("IA (huntTargetHard) - " + error);
      }
    }

    let pos = block.getPos();
    let possible;
    let blocks;
    let length;

    for(let s in grid.ships.ships) {
      if(grid.ships.ships[s].stillAlive()) {
        length = grid.ships.ships[s].getLength();
        for(let x=(pos.row-length); x<=(pos.row+length); x++) {
          if(x>=0 && x<=(10-length)) {
            blocks = [];
            for(let i=0; i<length; i++) {
              blocks.push(grid.grid[x+i][pos.column]);
            }
            possible = true;
            for(let item in blocks) {
              if(!blocks[item].canWelcomeShip()) possible = false;
            }
            if(possible) {
              for(let item in blocks) {
                blocks[item].addProba();
              }
            }
          }
        }
        for(let y=(pos.column-length); y<=(pos.column+length); y++) {
          if(y>=0 && y<=(10-length)) {
            blocks = [];
            for(let i=0; i<length; i++) {
              blocks.push(grid.grid[pos.row][y+i]);
            }
            possible = true;
            for(let item in blocks) {
              if(!blocks[item].canWelcomeShip()) possible = false;
            }
            if(possible) {
              for(let item in blocks) {
                blocks[item].addProba();
              }
            }
          }
        }
      }
    }

    let target;
    let tmptarget;
    let proba = 0;
    let tmpproba;
    let x;
    let y;

    tmptarget = block;
    for(let y=pos.row; y>=0 && !tmptarget.shouldNotBeLookedAt(); y--) {
      tmptarget = grid.grid[y][pos.column];
      if(tmptarget.canBeShotAt()) {
        tmpproba = tmptarget.getProba();
        if(tmpproba>proba) {
          proba = tmpproba;
          target = tmptarget;
        }
        break;
      }
    }
    tmptarget = block;
    for(let y=pos.row; y<10 && !tmptarget.shouldNotBeLookedAt(); y++) {
      tmptarget = grid.grid[y][pos.column];
      if(tmptarget.canBeShotAt()) {
        tmpproba = tmptarget.getProba();
        if(tmpproba>proba) {
          proba = tmpproba;
          target = tmptarget;
        }
        break;
      }
    }
    tmptarget = block;
    for(let x=pos.column; x>=0 && !tmptarget.shouldNotBeLookedAt(); x--) {
      tmptarget = grid.grid[pos.row][x];
      if(tmptarget.canBeShotAt()) {7
        tmpproba = tmptarget.getProba();
        if(tmpproba>proba) {
          proba = tmpproba;
          target = tmptarget;
        }
        break;
      }
    }
    tmptarget = block;
    for(let x=pos.column; x<10 && !tmptarget.shouldNotBeLookedAt(); x++) {
      tmptarget = grid.grid[pos.row][x];
      if(tmptarget.canBeShotAt()) {
        tmpproba = tmptarget.getProba();
        if(tmpproba>proba) {
          proba = tmpproba;
          target = tmptarget;
        }
        break;
      }
    }

    grid.resetProbas();

    return target;
  }

  static selectPlace(grid, ship)
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
          Check.def(ship);
          Check.proto(ship, "Object");
          Check.instance(ship, Ship);
        } catch(error) {
          throw "ship : " + error;
        }
      } catch(error) {
        throw Error("IA (selectPlace) - " + error);
      }
    }

    let blocks = [];
    let row;
    let length = ship.getLength();
    let rotation = ship.getRotation();
    if(ship.getRotation()) {
      for(let y=0; y<10; y++) {
        row = [];
        for(let x=0; x<=(10-length); x++) {
          if(grid.grid[y][x].canPlaceShipAt()) row.push(grid.grid[y][x]);
        }
        if(row.length>0) blocks.push(row);
      }
    } else {
      for(let y=0; y<=(10-length); y++) {
        row = [];
        for(let x=0; x<10; x++) {
          if(grid.grid[y][x].canPlaceShipAt()) row.push(grid.grid[y][x]);
        }
        if(row.length>0) blocks.push(row);
      }
    }

    const i = parseInt(Math.random()*1000*blocks.length)%blocks.length;
    const j = parseInt(Math.random()*1000*blocks[i].length)%blocks[i].length;

    return blocks[i][j];
  }
  static selectRotation()
  {
    if(parseInt(Math.random()*1000)%2===0) return true;
    return false;
  }
  static placeShips(grid)
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
      } catch(error) {
        throw Error("IA (placeShips) - " + error);
      }
    }

    let placed;
    let pos;
    for(let i in grid.ships.ships) {
      do {
        if(IA.selectRotation()) grid.ships.ships[i].setRotation();
        pos = IA.selectPlace(grid, grid.ships.ships[i]).getPos();
        placed = grid.placeShip(
            grid.ships.ships[i].name,
            grid.ships.ships[i].getRotation(),
            pos.row,
            pos.column);
      } while(!placed);
    }
  }
}
class Bot extends IA
{
  constructor(difficulty)
  {
    super();
    if(DEBUG) {
      try {
        try {
          Check.def(difficulty);
          Check.proto(difficulty, "String");
          Check.list(difficulties, difficulty);
        } catch(error) {
          throw "difficulty : " + error;
        }
      } catch(error) {
        throw Error("IA (constructor) - " + error);
      }
    }

    this.difficulty = difficulty;
    switch(difficulty) {
      case "easy":
        this.select = IA.selectTargetEasy;
        this.hunt = IA.huntTargetEasy;
        break;
      case "medium":
        this.select = IA.selectTargetMedium;
        this.hunt = IA.huntTargetMedium;
        break;
      case "hard":
        this.select = IA.selectTargetHard;
        this.hunt = IA.huntTargetHard;
        break;
      default:
        this.select = IA.selectTargetMedium;
        this.hunt = IA.huntTargetMedium;
    }
  }
  attack(grid, attackMode)
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
          Check.def(attackMode);
          Check.proto(attackMode, "Function");
        } catch(error) {
          throw "attackMode : " + error;
        }
      } catch(error) {
        throw Error("IA (attack) - " + error);
      }
    }

    const block = grid.searchTarget();
    let target;
    if(block===null) {
      target = this.select(grid);
    } else {
      if(block.mustBeShotAt()) {
        target = block;
      } else {
        target = this.hunt(grid, block);
      }
    }

    return grid.fireAt(target, attackMode);
  }
}



let grid1;
let grid2;
let nbShots;
let life1;
let life2;
let bot1 = new Bot("medium");
let bot2 = new Bot("hard");
for(let l=0; l<1; l++) {
  nbShots = 0;
  life1 = true;
  life2 = true;
  grid1 = new Grid("botMedium");
  grid2 = new Grid("botHard");
  IA.placeShips(grid1);
  IA.placeShips(grid2);
  for(let i=0; i<100 && life1 && life2; i++) {
    nbShots++;
    life1 = bot1.attack(grid2, Shot.normalShot);
    life2 = bot2.attack(grid1, Shot.normalShot);
  }
  if(life1) {
    console.info("bot1 : " + nbShots);
  } else {
    console.info("bot2 : " + nbShots);
  }
  grid1 = null;
  grid2 = null;
}
