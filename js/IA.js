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

    let targets = [];
    let proba = 0;
    let tmpproba;
    for(let i in grid.grid) {
      for(let j in grid.grid[i]) {
        tmpproba = grid.grid[i][j].getProba();
        if(tmpproba>proba) {
          proba = tmpproba;
          targets = [];
        }
        if(tmpproba>=proba) targets.push(grid.grid[i][j]);
      }
    }
    grid.resetProbas();

    const i = parseInt(Math.random()*1000*targets.length)%targets.length;
    return targets[0];
  }

  static huntTargetEasy(grid, cells)
  {
    if(DEBUG) {
      Check.grid(grid);
      Check.array(cells);
      cells.forEach(function(element, index, array)
          {
            Check.instance(element, Block);
          });
    }

    let blocks = [];
    cells.forEach(function(element, index, array)
        {
          let tmp;
          let radius = 4;
          if(!grid.ships.searchShip("carrier").stillAlive) radius = 3;
          if(!grid.ships.searchShip("battleship").stillAlive) radius = 2;
          if(!grid.ships.searchShip("cruiser").stillAlive && !grid.ships.searchShip("submarine").stillAlive) radius = 1;
          const pos = element.getPos();
          for(let y=pos.row-1; y>=(pos.row-radius); y--) {
            if(y>=0) {
              tmp = grid.grid[y][pos.column];
              if(tmp.canBeShotAt()) {
                if(!blocks.includes(tmp)) blocks.push(tmp);
                break;
              }
              if(tmp.shouldNotBeLookedAt()) break;
            }
          }
          for(let y=pos.row+1; y<=(pos.row+radius); y++) {
            if(y<=9) {
              tmp = grid.grid[y][pos.column];
              if(tmp.canBeShotAt()) {
                if(!blocks.includes(tmp)) blocks.push(tmp);
                break;
              }
              if(tmp.shouldNotBeLookedAt()) break;
            }
          }
          for(let x=pos.column-1; x>=(pos.row-radius); x--) {
            if(x>=0) {
              tmp = grid.grid[pos.column][x];
              if(tmp.canBeShotAt()) {
                if(!blocks.includes(tmp)) blocks.push(tmp);
                break;
              }
              if(tmp.shouldNotBeLookedAt()) break;
            }
          }
          for(let x=pos.column+1; x<=(pos.column+radius); x++) {
            if(x<=9) {
              tmp = grid.grid[pos.row][x];
              if(tmp.canBeShotAt()) {
                if(!blocks.includes(tmp)) blocks.push(tmp);
                break;
              }
              if(tmp.shouldNotBeLookedAt()) break;
            }
          }
        });


    const targets = blocks;
    const i = parseInt(Math.random()*1000*targets.length)%targets.length;
    return targets[i];
  }
  static huntTargetMedium(grid, cells)
  {
    if(DEBUG) {
      Check.grid(grid);
      Check.array(cells);
      cells.forEach(function(element, index, array)
          {
            Check.instance(element, Block);
          });
    }

    return IA.huntTargetEasy(grid, cells);
  }
  static huntTargetHard(grid, cells)
  {
    if(DEBUG) {
      Check.grid(grid);
      Check.array(cells);
      cells.forEach(function(element, index, array)
          {
            Check.instance(element, Block);
          });
    }

    cells.forEach(function(e,i,a)
        {
          const pos = e.getPos();
          grid.ships.ships.forEach(function(element,index,array)
              {
                let blocks;
                if(element.stillAlive()) {
                  const length = element.getLength();
                  for(let x=(pos.row-length); x<=(pos.row+length); x++) {
                    if(x>=0 && x<=(10-length)) {
                      blocks = [];
                      for(let i=0; i<length; i++) {
                        blocks.push(grid.grid[x+i][pos.column]);
                      }
                      if(element.canWelcomeShipOver(blocks)) {
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
                      if(element.canWelcomeShipOver(blocks)) {
                        blocks.forEach(function(element2,index2,array2)
                            {
                              element2.addProba();
                            });
                      }
                    }
                  }
                }
              });
        });

    let blocks = [];
    cells.forEach(function(element, index, array)
        {
          let tmp;
          let radius = 4;
          if(!grid.ships.searchShip("carrier").stillAlive) radius = 3;
          if(!grid.ships.searchShip("battleship").stillAlive) radius = 2;
          if(!grid.ships.searchShip("cruiser").stillAlive && !grid.ships.searchShip("submarine").stillAlive) radius = 1;
          const pos = element.getPos();
          for(let y=pos.row-1; y>=(pos.row-radius); y--) {
            if(y>=0) {
              tmp = grid.grid[y][pos.column];
              if(tmp.canBeShotAt()) {
                if(!blocks.includes(tmp)) blocks.push(tmp);
                break;
              }
              if(tmp.shouldNotBeLookedAt()) break;
            }
          }
          for(let y=pos.row+1; y<=(pos.row+radius); y++) {
            if(y<=9) {
              tmp = grid.grid[y][pos.column];
              if(tmp.canBeShotAt()) {
                if(!blocks.includes(tmp)) blocks.push(tmp);
                break;
              }
              if(tmp.shouldNotBeLookedAt()) break;
            }
          }
          for(let x=pos.column-1; x>=(pos.row-radius); x--) {
            if(x>=0) {
              tmp = grid.grid[pos.column][x];
              if(tmp.canBeShotAt()) {
                if(!blocks.includes(tmp)) blocks.push(tmp);
                break;
              }
              if(tmp.shouldNotBeLookedAt()) break;
            }
          }
          for(let x=pos.column+1; x<=(pos.column+radius); x++) {
            if(x<=9) {
              tmp = grid.grid[pos.row][x];
              if(tmp.canBeShotAt()) {
                if(!blocks.includes(tmp)) blocks.push(tmp);
                break;
              }
              if(tmp.shouldNotBeLookedAt()) break;
            }
          }
        });

    let targets = [];
    let proba = 0;
    let tmpproba;
    blocks.forEach(function(element, index, array)
        {
          tmpproba = element.getProba();
          if(tmpproba>proba) {
            targets = [];
            proba = tmpproba;
          }
          if(tmpproba>=proba) targets.push(element);
        });
    grid.resetProbas();

    const i = parseInt(Math.random()*1000*targets.length)%targets.length;
    return targets[i];
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

    let target;
    const blocks = gridE.searchTargets();
    const ships = blocks.filter(function(element)
        {
          return element.isEqualTo("ship");
        });
    const hits = blocks.filter(function(element)
        {
          return element.isEqualTo("hit");
        });
    if(ships.length===0) {
      if(hits.length===0) {
        target = this.select(gridE);
      } else {
        target = this.hunt(gridE, hits);
      }
    } else {
      target = ships[0];
    }

    return gridE.fireAt(target, Shot.normalShot, gridS);
  }
}
