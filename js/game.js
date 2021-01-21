'use strict';

const STARTGAME = '😊';
const GAMEOVER = '🤯';
const VICTORY = '😎';
const MINE = '💣';
const FLAG = '🚩';
const ONE = '1️';
const TWO = '2️';
const THREE = '3️';
const EMPTY = '';

var gBoard;
var gLevel;
var gGame;
var gElDiv = document.querySelector('.gameStatus');
var gElMines = document.querySelector('.mines-left');

function initGame(size, mines) {
  gLevel = {
    SIZE: size,
    MINES: mines,
  };
  gElMines.innerHTML = gLevel.MINES;
  gBoard = buildBoard(gLevel.SIZE);
  renderBoard(gBoard);

  gGame = {
    isOn: true,
    shownCount: 0, //How many cells are shown
    markedCount: 0, //How many cells are marked (with a flag)
    secsPassed: 0, //How many seconds passed
    lives:3,
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
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;
    }
  }
  console.log(board);
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

function renderBoard(board) {
  var strHTML = '';

  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j];
      var className = cell.isShown ? 'cells flipped' : 'cells';
      var id = `cell-${i}-${j}`;
      strHTML += `<td id="${id}" class="${className}" onclick="cellClicked(this, ${i}, ${j})"
       onmousedown="cellMarked(event, ${i}, ${j})" oncontextmenu="return false;"></td>`;
    }
    strHTML += '</tr>';
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {
  if (!gGame.isOn) return;

  var cell = gBoard[i][j];

  if (cell.isMarked) return;

  else if (cell.isShown) return;

  else if (cell.isMine) {
    if (gGame.lives === 0){
      gameOver();
      return;
    }
    else{
      decreaseLives(elCell);
      return;
    }
    

  } else {
    cell.isShown = true;
    gGame.shownCount++;
    elCell.classList.add('flipped');
    if (!cell.minesAroundCount) {
      if (gGame.shownCount === 1) {
        expandShown(gBoard, i, j);
        randomMinesLocation(gLevel.MINES);
        setMinesNegsCount(gBoard);
        renderBoard(gBoard);
      }
      expandShown(gBoard, i, j);
    } else {
      var value = getCellValue(cell);
      elCell.innerHTML = value;
      checkGameOver();
    }
  }
}

function getCellValue(cell) {
  var value;

  if (cell.minesAroundCount === 0) {
    value = EMPTY;
  } else {
    value = cell.minesAroundCount;
  }

  return value;
}

function cellMarked(ev, i, j) {
  var cell = gBoard[i][j];
  var elCell = document.querySelector(`#cell-${i}-${j}`);

  if (cell.isShown) return;

  if (ev.which == 3) {
    if (cell.isMarked) {
      elCell.innerHTML = EMPTY;
      cell.isMarked = false;
      gGame.markedCount--;
      gElMines.innerHTML ++;
    } else {
      elCell.innerHTML = FLAG;
      cell.isMarked = true;
      gGame.markedCount++;
      gElMines.innerHTML --;
    }
  }
  checkGameOver();
}

function checkGameOver() {
  var cellsToReveal = Math.pow(gLevel.SIZE, 2) - gLevel.MINES;
  if (gGame.markedCount === gLevel.MINES && gGame.shownCount === cellsToReveal) {
    console.log('Victory!');
    stopClock();
    gElDiv.innerHTML = VICTORY;
  }
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
      if (!neighbor.isShown) {
        neighbor.isShown = true;
        gGame.shownCount++;
      }
    }
  }
  checkGameOver();
}

function gameOver() {
  gGame.isOn = false;
  stopClock();

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

function randomMinesLocation(mines) {
  var num = 0;

  while (num < mines) {
    var minePos = {
      i: getRandomIntInclusive(0, gBoard.length - 1),
      j: getRandomIntInclusive(0, gBoard.length - 1),
    };
    var cell = gBoard[minePos.i][minePos.j];
    var elCell = document.querySelector(`#cell-${minePos.i}-${minePos.j}`);
    var isFlipped = elCell.classList.contains('flipped');

    if (isFlipped) continue;
    else if (cell.isShown) continue;
    else if (cell.isMine) continue;
    else {
      cell.isMine = true;
      num++;
    }
  }
}

function decreaseLives(elCell){
  gGame.lives --
  elCell.innerHTML = MINE;
  var elLivesCount = document.querySelector('.lives-count');
  elLivesCount.innerHTML = `${gGame.lives}`;

  setTimeout(() => {
    elCell.innerHTML = EMPTY

  }, 2000);
}