'use strict';

const STARTGAME = '😊';
const GAMEOVER = '🤯';
const VICTORY = '😎';
const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';

var gBoard;
var gLevel;
var gGame;
var gElDiv = document.querySelector('.gameStatus');
var gElMines = document.querySelector('.mines-left');
var gElLivesCount = document.querySelector('.lives-count');
var gElBestTime = document.querySelector('.best');
var gBestTime;

function initGame(size, mines) {
  gLevel = {
    SIZE: size,
    MINES: mines,
  };

  gBestTime = localStorage.getItem(`bestTimeLevel${gLevel.SIZE}`);
  gElBestTime.innerHTML = gBestTime;
  gElMines.innerHTML = gLevel.MINES;
  gElLivesCount.innerHTML = '3';
  gBoard = buildBoard(gLevel.SIZE);
  renderBoard(gBoard);

  gGame = {
    isOn: true,
    shownCount: 0, //How many cells are shown
    markedCount: 0, //How many cells are marked (with a flag)
    secsPassed: 0, //How many seconds passed
    lives: 3,
  };

  gElDiv.innerHTML = STARTGAME;
  stopClock();
  gTime.innerHTML = 0;
}

function buildBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      var cell = {
        minesAroundCount: 0,
        location: { i: i, j: j },
        isShown: false,
        recisShown: false,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;
    }
  }
  return board;
}

function setMinesNegsCount(board) {
  var bombCounter = 0;
  var pos = { i: 0, j: 0 };

  while (pos.i < board.length && pos.j < board.length) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
      if (i < 0 || i > board.length - 1) continue;
      for (var j = pos.j - 1; j <= pos.j + 1; j++) {
        if (j < 0 || j > board[0].length - 1) continue;
        if (i === pos.i && j === pos.j) continue;
        var neighbor = board[i][j];
        if (neighbor.isMine) bombCounter++;
      }
    }
    board[pos.i][pos.j].minesAroundCount = bombCounter;
    pos.j++;
    bombCounter = 0;
    if (pos.j === board.length) {
      pos.j = 0;
      pos.i++;
    }
  }
}

function cellClicked(elCell, i, j) {
  if (!gGame.isOn) return;

  var cell = gBoard[i][j];

  if (cell.isMarked) return;
  else if (cell.isShown) return;
  else if (cell.isMine) {
    if (gGame.lives === 1) {
      gameOver();
      return;
    } else {
      decreaseLives(elCell);
      return;
    }
  } else {
    cell.isShown = true;
    gGame.shownCount++;
    elCell.classList.add('flipped');
    if (!cell.minesAroundCount) {
      if (gGame.shownCount === 1) {
        // first click on the board
        expandShown(gBoard, i, j);
        randomMinesLocation(gLevel.MINES);
        startClock();
        setMinesNegsCount(gBoard);
        renderBoard(gBoard);
      }
      expandShown(gBoard, i, j);
      recExpandShow(gBoard, i, j);
    } else {
      //cell has mine neighbors so no expandShown
      var value = getCellValue(cell);
      elCell.innerHTML = value;
      style(cell, elCell);
      checkGameOver();
    }
  }
}

function cellMarked(ev, i, j) {
  var cell = gBoard[i][j];
  var elCell = document.querySelector(`#cell-${i}-${j}`);

  if (cell.isShown) return; //can't locate a flag on a flipped cell

  if (ev.which == 3) {
    if (cell.isMarked) {
      //check if I'm re-pressing a flag;
      elCell.innerHTML = EMPTY;
      cell.isMarked = false;
      gGame.markedCount--;
      gElMines.innerHTML++;
    } else {
      elCell.innerHTML = FLAG;
      cell.isMarked = true;
      gGame.markedCount++;
      gElMines.innerHTML--;
    }
  }
  if (gGame.markedCount === 1) {
    startClock();
  }
  checkGameOver();
}

function expandShown(board, i, j) {
  var pos = { i: i, j: j };

  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue;
      if (i === pos.i && j === pos.j) continue;
      var neighbor = board[i][j];
      var elNeighbor = document.querySelector(`#cell-${i}-${j}`);
      elNeighbor.innerHTML = getCellValue(neighbor);
      elNeighbor.classList.add('flipped');
      style(neighbor, elNeighbor);
      if (!neighbor.isShown) {
        neighbor.isShown = true;
        gGame.shownCount++;
      }
    }
  }
  checkGameOver();
}

function randomMinesLocation(mines) {
  var num = 0;

  while (num < mines) {
    var minePos = {
      //draw two random numbers for i and j
      i: getRandomIntInclusive(0, gBoard.length - 1),
      j: getRandomIntInclusive(0, gBoard.length - 1),
    };
    var cell = gBoard[minePos.i][minePos.j];
    var elCell = document.querySelector(`#cell-${minePos.i}-${minePos.j}`);
    var isFlipped = elCell.classList.contains('flipped');

    if (isFlipped) continue;
    //can't locate a mine on a flipped cell
    else if (cell.isShown) continue;
    //can't locate a mine on a flipped cell
    else if (cell.isMine) continue;
    //can't locate a mine on a mine
    else {
      cell.isMine = true;
      num++;
    }
  }
}

function gameOver() {
  gGame.isOn = false;
  stopClock();
  gElLivesCount.innerHTML = '0';

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j];
      var elCell = document.querySelector(`#cell-${i}-${j}`);
      if (cell.isMine) {
        elCell.innerHTML = MINE;
      }
    }
  }
  gElDiv.innerHTML = GAMEOVER;
}

function recExpandShow(board, i, j) {
  var elCell = document.querySelector(`#cell-${i}-${j}`);
  var cell = board[i][j];
  if (cell.recisShown) return;
  else if (cell.minesAroundCount){
    if (!cell.isShown){
      showCell(cell, elCell)
    }
    cell.recisShown = true;
    return;
  } 
  else {
    if (!cell.isShown){
      showCell(cell, elCell)
    }
    cell.recisShown = true;
    for (var x = i - 1; x <= i + 1; x++) {
      if (x < 0 || x > board.length - 1) continue;
      for (var y = j - 1; y <= j + 1; y++){
        if (y < 0 || y > board.length - 1) continue;
        recExpandShow(board,x,y)
      } 
    }  
  }
}
