class IA {
  static selectTargetEasy(grid)
  {
    if(DEBUG) {
      Check.grid(grid);
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
      Check.grid(grid);
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
      Check.grid(grid);
    }

    grid.ships.ships.forEach(function(element, index, array)
        {
          let blocks;
          let length;
          if(element.stillAlive()) {
            length = element.getLength();
            for(let x=0; x<=(10-length); x++) {
              for(let y=0; y<10; y++) {
                blocks = [];
                for(let i=0; i<length; i++) {
                  blocks.push(grid.grid[x+i][y]);
                }
                if(element.canShootShipOver(element.name, blocks)) {
                  blocks.forEach(function(element2,index2,array2)
                      {
                        element2.addProba();
                      });
                }
              }
            }
            for(let y=0; y<=(10-length); y++) {
              for(let x=0; x<10; x++) {
                blocks = [];
                for(let i=0; i<length; i++) {
                  blocks.push(grid.grid[x][y+i]);
                }
                if(element.canShootShipOver(element.name, blocks)) {
                  blocks.forEach(function(element2,index2,array2)
                      {
                        element2.addProba();
                      });
                }
              }
            }
          }
        });

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
      Check.grid(grid);
      Check.block(block);
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
      Check.grid(grid);
      Check.block(block);
    }

    return IA.huntTargetEasy(grid, block);
  }
  static huntTargetHard(grid, block)
  {
    if(DEBUG) {
      Check.grid(grid);
      Check.block(block);
    }

    let pos = block.getPos();
    let blocks;
    let length;

    grid.ships.ships.forEach(function(element,index,array)
        {
          if(element.stillAlive()) {
            length = element.getLength();
            for(let x=(pos.row-length); x<=(pos.row+length); x++) {
              if(x>=0 && x<=(10-length)) {
                blocks = [];
                for(let i=0; i<length; i++) {
                  blocks.push(grid.grid[x+i][pos.column]);
                }
                if(element.canWelcomeShipOver(element.name, blocks)) {
                  blocks.forEach(function(element2,index2,array2)
                      {
                        element2.addProba();
                      });
                }
              }
            }
            for(let y=(pos.column-length); y<=(pos.column+length); y++) {
              if(y>=0 && y<=(10-length)) {
                blocks = [];
                for(let i=0; i<length; i++) {
                  blocks.push(grid.grid[pos.row][y+i]);
                }
                if(element.canWelcomeShipOver(element.name, blocks)) {
                  blocks.forEach(function(element2,index2,array2)
                      {
                        element2.addProba();
                      });
                }
              }
            }
          }
        });

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
      Check.grid(grid);
      Check.ship(ship);
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
      Check.grid(grid);
    }

    grid.ships.ships.forEach(function(element, index, array)
        {
          let placed;
          let pos;
          do {
            if(IA.selectRotation()) element.setRotation();
            pos = IA.selectPlace(grid, element).getPos();
            placed = grid.placeShip(element.name,element.rotation,pos.row,pos.column);
          } while(!placed);
        });
  }
}
class Bot extends IA
{
  constructor(difficulty)
  {
    super();
    if(DEBUG) {
      Check.list(difficulty, DIFFICULTIES);
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
    this.grid = null;
  }
  setGrid()
  {
    this.grid = new Grid("BOT" + this.difficulty);
    IA.placeShips(this.grid);
  }
  attack(gridE, gridS)
  {
    if(DEBUG) {
      Check.grid(gridE);
      Check.grid(gridS);
    }

    const block = gridE.searchTarget();
    let target;
    if(block===null) {
      target = this.select(gridE);
    } else {
      if(block.isEqualTo("ship")) {
        target = block;
      } else {
        target = this.hunt(gridE, block);
      }
    }

    return gridE.fireAt(target, Shot.normalShot, gridS);
  }
}
