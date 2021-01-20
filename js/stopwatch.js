'use strict';

var gStartTime;
var gClock = 0;
var gInterval;
var gTimer = document.querySelector('.timer');
var gTime = gTimer.querySelector('.time');

function startClock() {
  if (!gInterval) {
    gStartTime = Date.now();
    gInterval = setInterval(update, 1000);
  }
}

function stopClock() {
  if (gInterval) {
    clearInterval(gInterval);
    gInterval = null;
    gTime.innerHTML = 0;
  }
}

function update() {
  var now = Date.now();
  gClock = now - gStartTime;
  gTime.innerHTML = Math.round(gClock / 1000);
  gGame.secsPassed++;
}
