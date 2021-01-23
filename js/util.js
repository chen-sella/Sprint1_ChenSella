'use strict';

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function decreaseLives(elCell) {
  gGame.lives--;
  elCell.innerHTML = MINE;
  gElLivesCount.innerHTML = `${gGame.lives}`;
 
  setTimeout(() => {
    elCell.innerHTML = EMPTY;
  }, 1000);
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

function checkGameOver() {
  var cellsToReveal = Math.pow(gLevel.SIZE, 2) - gLevel.MINES;
  
  if (
    gGame.markedCount === gLevel.MINES &&
    gGame.shownCount === cellsToReveal
  ) {
    stopClock();
    gElDiv.innerHTML = VICTORY;
    bestTime();
  }
}

function bestTime() {
  if (!gBestTime) {
    //if the filed doesn't exist yet in the Local storage
    localStorage.setItem(`bestTimeLevel${gLevel.SIZE}`, gGame.secsPassed);
    gElBestTime.innerHTML = gGame.secsPassed;
  } else {
    if (gBestTime > gGame.secsPassed) {
      localStorage.setItem(`bestTimeLevel${gLevel.SIZE}`, gGame.secsPassed);
      gElBestTime.innerHTML = gGame.secsPassed;
    } else {
      gElBestTime.innerHTML = gBestTime;
    }
  }
}

function startOver() {
  initGame(gLevel.SIZE, gLevel.MINES);
}

function style(cell, elCell) {
  switch (cell.minesAroundCount) {
    case 1:
      elCell.style.color = '#b93b2d';
      break;
    case 2:
      elCell.style.color = '#ce9b44';
      break;
    case 3:
      elCell.style.color = '#526E7C';
      break;
    case 4:
      elCell.style.color = '#a5803b';
      break;
    case 5:
      elCell.style.color = '#ce663d';
      break;
    case 6:
      elCell.style.color = '#697269';
      break;
    case 7:
      elCell.style.color ='#b2a684'
  }
}
