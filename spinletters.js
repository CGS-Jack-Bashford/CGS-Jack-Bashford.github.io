var finalLetters = "Hacker by day...hacker by night also. Student in remaining time.".split('');
var currentLetters = Array(finalLetters.length);
var lockedLetters = [];
var timesShuffled = 0;
for (var i = 0; i < finalLetters.length; i++) {
	if (finalLetters[i] == ' ') {
		lockedLetters.push(i);
		currentLetters[i] = ' ';
	}
}
$(function() {
	window.setTimeout(function() {
		shuffleLetters();
	}, 0);
})

function shuffleLetters() {
	if (currentLetters != finalLetters) {
		if (timesShuffled%3 == 0 && timesShuffled > 20) {
			var index = timesShuffled/3-20;
			currentLetters[index] = finalLetters[index];
			lockedLetters.push(index);
		}
		for (var i = 0; i < currentLetters.length; i++) {
			if (!lockedLetters.includes(i)) {
				currentLetters[i] = randomChar();
			}
		}
		$('#description').text(currentLetters.join(''));
		timesShuffled++;
		window.setTimeout(shuffleLetters, 20);
	}
}

function getRandomCharacter() {
	var charList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYS1234567890!@#$%^&*()-=_+,./<>?;':\"[]\{}|`~".split('');
	return charList[Math.floor(Math.random() * charList.length)];
}