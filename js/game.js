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

function initGame(size, mines) {
  gLevel = {
    SIZE: size,
    MINES: mines,
  };
  gBoard = buildBoard(gLevel.SIZE);
  randomMinesLocation(gLevel.MINES);
  setMinesNegsCount(gBoard);
  renderBoard(gBoard);

  gGame = {
    isOn: true,
    shownCount: 0, //How many cells are shown
    markedCount: 0, //How many cells are marked (with a flag)
    secsPassed: 0, //How many seconds passed
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
  console.table(board);
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
      var id = `cell-${i}-${j}`;
      strHTML += `<td id="${id}" class="cells" onclick="cellClicked(this, ${i}, ${j})"
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
    gameOver();
    return;
    
  } else {
    cell.isShown = true;
    gGame.shownCount++;
    elCell.classList.add('flipped');
    var value = getCellValue(cell);
    elCell.innerHTML = value;
    checkGameOver();
  }
}

function getCellValue(cell) {
  var value;

  switch (cell.minesAroundCount) {
    case 1:
      value = ONE;
      break;
    case 2:
      value = TWO;
      break;
    case 3:
      value = THREE;
      break;
    default:
      value = EMPTY;
      break;
  }
  return value;
}

function cellMarked(ev, i, j) {
  var cell = gBoard[i][j];
  var elCell = document.querySelector(`#cell-${i}-${j}`);

  if (ev.which == 3) {
    if (cell.isMarked) {
      elCell.innerHTML = EMPTY;
      cell.isMarked = false;
      gGame.markedCount--;
    } else {
      elCell.innerHTML = FLAG;
      cell.isMarked = true;
      gGame.markedCount++;
    }
  }
}

function checkGameOver() {
  var cellsToMark = Math.pow(gLevel.SIZE, 2) - gLevel.MINES;
  console.log('Hi');
  if (gGame.markedCount === gLevel.MINES && gGame.shownCount === cellsToMark) {
    console.log('Victory!');
    stopClock();
    gElDiv.innerHTML = VICTORY;
  }
}

function expandShown(board, elCell, i, j) {}

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
  var minePos = {
    i: getRandomIntInclusive(0, gBoard.length - 1),
    j: getRandomIntInclusive(0, gBoard.length - 1),
  };

  while (num < mines) {
    if (!gBoard[minePos.i][minePos.j].isMine) {
      gBoard[minePos.i][minePos.j].isMine = true;
      num++;
    }
    minePos = {
      i: getRandomIntInclusive(0, gBoard.length - 1),
      j: getRandomIntInclusive(0, gBoard.length - 1),
    };
  }
}
