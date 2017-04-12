const selectTargetEasy = function(grid)
{
  let i;
  let j;
  let target = null;
  do {
    i = parseInt(Math.random()*1000*10)%10;
    j = parseInt(Math.random()*1000*10)%10;
    if(grid.grid[i][j].canBeShotAt()) target = grid.grid[i][j];
  } while(target===null);
  return target;
}
const selectTargetMedium = function(grid)
{
  let i;
  let j;
  let target = null;
  do {
    do {
      i = parseInt(Math.random()*1000*10)%10;
      j = parseInt(Math.random()*1000*10)%10;
    } while((i+j)%2===1);
    if(grid.grid[i][j].canBeShotAt()) target = grid.grid[i][j];
  } while(target===null);
  return target;
}
const selectTargetHard = function(grid)
{
  let possible;
  let blocks;

  for(let s in grid.ships.ships) {
    if(grid.ships.ships[s].stillAlive()) {
      for(let x=0; x<=(10-grid.ships.ships[s].getLength()); x++) {
        for(let y=0; y<10; y++) {
          blocks = [];
          for(let i=0; i<grid.ships.ships[s].getLength(); i++) {
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
      for(let y=0; y<=(10-grid.ships.ships[s].getLength()); y++) {
        for(let x=0; x<10; x++) {
          blocks = [];
          for(let i=0; i<grid.ships.ships[s].getLength(); i++) {
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

  let block;
  let proba = 0;
  for(let i in grid.grid) {
    for(let j in grid.grid[i]) {
      if(grid.grid[i][j].getProba()>proba) {
        proba = grid.grid[i][j].getProba();
        block = grid.grid[i][j];
      }
      grid.grid[i][j].resetProba();
    }
  }

  return block;
}

const huntTargetEasyMedium = function(grid, block)
{
  let target;
  const pos = block.getPos();
  for(let y=pos.row, target=block; y>=0 && !target.shouldNotBeLookedAt(); y--) {
    target = grid.grid[y][pos.column];
    if(target.canBeShotAt()) return target;
  }
  for(let y=pos.row, target=block; y<10 && !target.shouldNotBeLookedAt(); y++) {
    target = grid.grid[y][pos.column];
    if(target.canBeShotAt()) return target;
  }
  for(let x=pos.column, target=block; x>=0 && !target.shouldNotBeLookedAt(); x--) {
    target = grid.grid[pos.row][x];
    if(target.canBeShotAt()) return target;
  }
  for(let x=pos.column, target=block; x<10 && !target.shouldNotBeLookedAt(); x++) {
    target = grid.grid[pos.row][x];
    if(target.canBeShotAt()) return target;
  }
}
const huntTargetHard = function(grid, block)
{
  return huntTargetEasyMedium(grid, block);
}

const bot = function(grid, select, hunt)
{
  const block = grid.searchTarget();
  let target;
  if(block===null) {
    target = select(grid);
  } else {
    target = hunt(grid, block);
  }
  return grid.fireAt(target);
}




let grid;
let nbShots;
let life;
for(let l=0; l<1000; l++) {
  nbShots = 0;
  life = true;
  grid = new Grid("self");
  grid.placeShip("destroyer", true, 1,1);
  grid.placeShip("cruiser", true, 3,1);
  grid.placeShip("submarine", true, 5,1);
  grid.placeShip("battleship", true, 7,1);
  grid.placeShip("carrier", true, 9,1);
  for(let i=0; i<100 && life; i++) {
    nbShots++;
    life = bot(grid, selectTargetHard, huntTargetEasyMedium);
  }
  console.info(nbShots);
  grid = null;
}
