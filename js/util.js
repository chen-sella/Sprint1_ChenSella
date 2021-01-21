'use strict';

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(nums) {
  var currentIndex = nums.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = getRandomIntInclusive(0, nums.length-1);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = nums[currentIndex];
    nums[currentIndex] = nums[randomIndex];
    nums[randomIndex] = temporaryValue;
  }
  console.log(nums);
  return nums;
}

