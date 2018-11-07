/*
// I am committed to being a person of integrity.
// This project is submitted as part of the assessment for Year 8 IST.
// This is all my own work. I have referenced any work used from other
// sources and have not plagiarised the work of others.
// (signed) Jack Bashford
*/

/*Reminder to Mr. Purcell: 
I won't lose marks for the align misalignment when they drop down each row
*/

//Initialize canvas and context
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
//Get player's name from local storage 
var name = localStorage.getItem('name');
//Local storage tutorial by Zac Gordon https://www.youtube.com/watch?v=T9GWHFDcELQ

//Checks if player's name has been stored
if (name != "null") {

	//Sets heading to player's name
	document.getElementById("nameHeading").innerHTML = name;

}

//If there is no local storage player
else {

	//Ask for player's name
	name = prompt("Please enter your username");
	//Set heading to player's name
	document.getElementById("nameHeading").innerHTML = name;
	//Add name to local storage
	localStorage.setItem('name', name);

}

//Gets highscore from local storage
var highScore = localStorage.getItem('highScore');

//If highscore exists
if (highScore) {

	//Set heading to highscore
	document.getElementById("highScoreHeading").innerHTML = `Highscore: ${highScore}`;

}

//If highscore is not stored in local storage (if highscore does not exist)
else {

	//Reset highscore to 0
	highScore = 0;
	//Set heading to highscore
	document.getElementById("highScoreHeading").innerHTML = `Highscore: ${highScore}`;

}

//All sounds sourced from http://www.classicgaming.cc/classics/space-invaders/sounds
var invaderDie = new Audio("invaderDie.wav");
var playerDie = new Audio("playerDie.wav");
var playerShoot = new Audio("playerShoot.wav");
var ufoAppear = new Audio("ufoAppear.wav");
var ufoDie = new Audio("ufoDie.wav");

//This sound sourced from http://d-gun.com/files/sounds/LASRFIR2.WAV
var invaderShoot = new Audio("invaderShoot.WAV");

//Sounds array for resolving promise on game end - see frame() function
var sounds = [invaderDie, invaderShoot, playerDie, playerShoot, ufoAppear, ufoDie];

//Sets up variables for storing each alien and each barrier, which are stored in arrays of objects
var aliens = [];
var barriers = [];

//Sets up object reference to the alien currently shooting
var shootingAlien;

//Player variable with positions, properties and functions
var player = {

	//Set starting horizontal position to center of screen
	xPos: 60,
	//Set starting vertical position to near bottom of screen
	yPos: 550,
	//Sets starting horizontal velocity to 0
	xVel: 0,
	//Sets size of player (height and width) to 32 pixels
	size: 32,
	//Sets starting score to 0 points, and loads highscore from local storage (if previously saved)
	score: 0,
	highScore: 0,
	//Sets variables for checking win or loss
	won: false,
	lost: false,
	//Sets color - only changed when hit by alien bullet
	color: "lime",
	//Sets shot counter for accuracy
	shots: 0,
	//Sets levels played for cumulative accuracy
	levelsPlayed: 1,
	//Sets health points for being hit by alien bullet
	healthPoints: 3,
	//Sets variable for checking if game is over (played 10 levels)
	gameOver: false,

	//Draws the player in its new position
	draw: function() {

		//Temporary renaming of variables to improve readability, troubleshooting and compactness
		var x = this.xPos;
		var y = this.yPos;
		var s = this.size;
		//Makes the player color relative to its health points
		this.healthPoints == 3 ? ctx.fillStyle = "lime" : this.healthPoints == 2 ? ctx.fillStyle = "yellow" : this.healthPoints == 1 ? ctx.fillStyle = "orange" : ctx.fillStyle = "red";
		//Draws shape of player
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo((x + (s / 2)) - 5, y);
		ctx.lineTo((x + (s / 2)) - 5, y - 10);
		ctx.lineTo((x + (s / 2)) + 5, y - 10);
		ctx.lineTo((x + (s / 2)) + 5, y);
		ctx.lineTo(x + s, y);
		ctx.lineTo(x + s, y + s);
		ctx.lineTo(x, y + s);
		ctx.lineTo(x, y);
		//Fills invisible shape with lime green to finish drawing player
		ctx.fill();

	},

	move: function() {

		//Checks if player will move off edge of left-hand side of canvas
		if (this.xPos + this.xVel <= 0) {

			//Wraps player around to right-hand edge
			this.xPos = canvas.width;

		}

		//Checks if player will move off edge of right-hand side of canvas
		else if (this.xPos + this.xVel >= canvas.width) {

			//Wraps player around to left-hand edge
			this.xPos = 0;

		}

		//Otherwise if it can move freely in both directions
		else {

			//Change its horizontal position by its horizontal velocity
			this.xPos += this.xVel;

		}

	},

	//Function for shooting called upon spacebar press
	shoot: function() {

		//Checks if the bullet has not been fired and if player is on screen
		if (bullet.yPos < 0 || !(bullet.yPos)) {// && (this.xPos >= 0 && this.xPos < canvas.width - this.size)) {

			//Fires the bullet
			bullet.fire = true;
			//Sets bullet's x and y posiion to player's x and y position
			bullet.lockedXPos = this.xPos + (this.size / 2 - 2);
			bullet.yPos = this.yPos + (this.size / 2 - 2);
			//Plays shooting sound
			playerShoot.play();
			//Increments shots for accuracy alert
			this.shots++;

		}

	},

	//Function for updating player's score visually
	updateScore: function() {

		//Sets score heading to score
		document.getElementById("scoreHeading").innerHTML = `Score: ${this.score}`;

		//Checks if player has a new highscore
		if (this.score >= highScore) {

			//Sets highscore to score
			highScore = this.score;
			//Sets highscore heading to highscore
			document.getElementById("highScoreHeading").innerHTML = `Highscore: ${highScore}`;
			//Saves highscore to local storage for next play
			localStorage.setItem('highScore', highScore.toString());

		}

	},

	//Checks win and loss
	checkWinAndLoss: function() {

		//If there are no more aliens
		if (aliens.length == 0) {

			//Player has won the round
			this.won = true;

		}

		//If player has won the round
		if (this.won) {

			//Increment level counter
			this.levelsPlayed++;

			//If player has played ten levels
			if (this.levelsPlayed == 10) {

				//Game is over - player has won
				this.gameOver = true;
				//Alert that the player has won
				alert("You killed all the aliens! You won!");

			}

			//Otherwise
			else {

				//Make new aliens
				makeAliens();

				//Delete the current alien bullet
				alienBullet.shot = false;
				//Alert accuracy rating
				alert(`You won in ${this.shots} shots! You hit aliens ${Math.floor((this.levelsPlayed - 1) * 45 / this.shots * 100)}% of the time!`);
				//Player has not won the new round
				this.won = false;
				//Moves UFO to random position on left side of screen
				ufo.xPos = Math.floor(Math.random() * 1000) * -1;
				//Makes UFO move towards game screen
				ufo.xVel = 2;

				//If player has less than full health
				if (this.healthPoints < 3) {

					//Increase player's health
					this.healthPoints++;

				}

			}

		}

		//If player has no more health left
		if (this.healthPoints <= 0) {

			//Player has lost the game
			this.lost = true;
			this.gameOver = true;

		}

		//If player was shot by aliens
		if (this.lost && this.healthPoints <= 0) {

			//Tell player they were killed
			alert("You were killed! Better luck next time!");

		}

		//If player was invaded
		if (this.lost && !(this.healthPoints <= 0)) {

			//Tell player they were invaded
			alert("You were invaded! Better luck next time!");

		}

	}

};

//Bullet variable with positions, properties and functions
var bullet = {

	//Bullet x position set to 0 to begin with
	lockedXPos: 0,
	//Bullet's y position and y velocity set to null to begin with
	yPos: null,
	yVel: null,
	//Properties for storing bullet height and width
	height: 25,
	width: 3,

	//Properties for storing current bullet state - fired and visibility
	fire: false,
	hidden: false,

	//Function for drawing bullet
	draw: function() {

		//If bullet has been fired and is visible
		if (this.fire && !(this.hidden)) {
			
			//Bullet's y velocity is equal to -10, because y position is 0 at the top of the canvas
			this.yVel = -10;
			//Draw a blue bullet
			ctx.fillStyle = "cadetblue";
			ctx.fillRect(this.lockedXPos, this.yPos, this.width, this.height);

		}
	},

	//Function for moving bullet
	move: function() {

		//If bullet has been fired
		if (this.fire) {

			//Bullet moves up by y velocity
			this.yPos += this.yVel;

		}

		//If bullet is not visible
		if (this.hidden) {

			//Bullet's y position is equal to the player's y position, as the bullet shoots from the player's position
			this.yPos = player.yPos;

		}

	}

}

//Alien variable with generic properties
var alien = {

	//Properties of x and y velocity - applied to each alien
	xVel: 1,
	yVel: 0,
	//Size and costume property - used when drawing aliens
	size: 32,
	costume1: false,

	//Function for drawing each alien
	draw: function() {

		//Iterate over each alien
		for (var i = 0; i < aliens.length; i++) {

			//If this alien is alive
			if (!(aliens[i].hit)) {

				//If costume1 property is true
				if (this.costume1) {

					//If this alien is an Octopus
					if (aliens[i].type == "Octopus") {

						//Draw the Octopus alien's first costume
						ctx.fillStyle = "#ff00ff";
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos, this.size, this.size);

						ctx.fillStyle = "black";
						ctx.fillRect(aliens[i].xPos + 11, aliens[i].yPos + 22, 11, 10);
						ctx.fillRect(aliens[i].xPos + 11, aliens[i].yPos, 11, 10);
						ctx.fillRect(aliens[i].xPos + 22, aliens[i].yPos + 10, 12, 12);
						ctx.fillRect(aliens[i].xPos - 1, aliens[i].yPos + 10, 12, 12);

					}

					//If this alien is a Crab
					else if (aliens[i].type == "Crab") {

						//Draw the Crab alien's first costume
						ctx.fillStyle = "#00ff00";
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos, this.size, this.size);

						ctx.fillStyle = "black";
						ctx.fillRect(aliens[i].xPos + 11, aliens[i].yPos + 22, 11, 10);
						ctx.fillRect(aliens[i].xPos + 11, aliens[i].yPos, 11, 10);
						ctx.fillRect(aliens[i].xPos + 22, aliens[i].yPos + 10, 12, 12);
						ctx.fillRect(aliens[i].xPos - 1, aliens[i].yPos + 10, 12, 12);

					}

					//If this alien is a Squid
					else if (aliens[i].type == "Squid") {

						//Draw the Squid alien's first costume
						ctx.fillStyle = "#0000ff";
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos, this.size, this.size);

						ctx.fillStyle = "black";
						ctx.fillRect(aliens[i].xPos + 11, aliens[i].yPos + 22, 11, 10);
						ctx.fillRect(aliens[i].xPos + 11, aliens[i].yPos, 11, 10);
						ctx.fillRect(aliens[i].xPos + 22, aliens[i].yPos + 10, 12, 12);
						ctx.fillRect(aliens[i].xPos - 1, aliens[i].yPos + 10, 12, 12);

					}

				}

				//Otherwise - if costume1 property is false
				else {

					//If this alien is an Octopus
					if (aliens[i].type == "Octopus") {

						//Draw the Octopus alien's second costume 
						ctx.fillStyle = "#ff00ff";
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos, this.size, this.size);

						ctx.fillStyle = "black";
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos, 11, 10);
						ctx.fillRect(aliens[i].xPos + 22, aliens[i].yPos, 11, 10);
						ctx.fillRect(aliens[i].xPos + 11, aliens[i].yPos + 10, 11, 12);
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos + 22, 11, 10);
						ctx.fillRect(aliens[i].xPos + 22, aliens[i].yPos + 22, 11, 10);

					}

					//If this alien is a Crab
					else if (aliens[i].type == "Crab") {

						//Draw the Crab alien's second costume 
						ctx.fillStyle = "#00ff00";
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos, this.size, this.size);

						ctx.fillStyle = "black";
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos, 11, 10);
						ctx.fillRect(aliens[i].xPos + 22, aliens[i].yPos, 11, 10);
						ctx.fillRect(aliens[i].xPos + 11, aliens[i].yPos + 10, 11, 12);
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos + 22, 11, 10);
						ctx.fillRect(aliens[i].xPos + 22, aliens[i].yPos + 22, 11, 10);

					}

					//If this alien is a Squid
					else if (aliens[i].type == "Squid") {

						//Draw the Squid alien's second costume 
						ctx.fillStyle = "#0000ff";
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos, this.size, this.size);

						ctx.fillStyle = "black";
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos, 11, 10);
						ctx.fillRect(aliens[i].xPos + 22, aliens[i].yPos, 11, 10);
						ctx.fillRect(aliens[i].xPos + 11, aliens[i].yPos + 10, 11, 12);
						ctx.fillRect(aliens[i].xPos, aliens[i].yPos + 22, 11, 10);
						ctx.fillRect(aliens[i].xPos + 22, aliens[i].yPos + 22, 11, 10);

					}

				}

			}

		}

	},

	//Function to move each alien
	move: function() {

		//Iterate over each alien
		for (var i = 0; i < aliens.length; i++) {

			//If this alien is alive
			if (!(aliens[i].hit)) {

				//This alien's x position increases by its x velocity (1 or -1 depending on direction)
				aliens[i].xPos += aliens[i].xVel;

			}

			//If any alien will hit right-hand side of screen
			if ((aliens[i].xPos + aliens[i].xVel) > (canvas.width - 60)) {

				//Iterate over each alien again
				for (var j = 0; j < aliens.length; j++) {

					//Make all aliens drop down and move left
					aliens[j].yPos += 5;
					aliens[j].xVel = -0.5;

				}

			}

			//If any alien will hit right-hand side of screen
			if ((aliens[i].xPos + aliens[i].xVel) < 60) {

				//Iterate over each alien again
				for (var j = 0; j < aliens.length; j++) {

					//Make all aliens drop down and move right
					aliens[j].yPos += 5;
					aliens[j].xVel = 0.5;
					//Fix issue with first alien not behaving correctly
					aliens[0].xPos = 60;

				}

			}

		}

	},

	//Check whether aliens are dead, or have invaded
	check: function() {

		//Iterate over each alien
		for (var i = 0; i < aliens.length; i++) {

			//If this alien is able to touch the player
			if (aliens[i].yPos + this.size >= player.yPos) {

				//Player has lost the game
				player.lost = true;

			}

			//If the bullet is touching an alien, and the alien has not been hit
			if ((bullet.lockedXPos >= aliens[i].xPos) && (bullet.lockedXPos <= aliens[i].xPos + this.size) && (bullet.yPos >= aliens[i].yPos) && (bullet.yPos <= aliens[i].yPos + this.size) && !(aliens[i].hit)) {
				
				//Set this alien to be hit
				aliens[i].hit = true;
				//Player's score increases by this alien's value
				player.score += aliens[i].points;
				//Splice the alien out of the array
				aliens.splice(i, 1);
				//Set bullet's position to offscreen to remove it from the game
				bullet.yPos = -50;
				//Play invader death sound
				invaderDie.play();

			}

		}

	},

	//Shooting function
	shoot: function() {

		//If the alien bullet has not been shot
		if (!alienBullet.shot) {

			//Shoot the alien bullet
			alienBullet.shot = true;
			//Assign the global shootingAlien to a random alien
			shootingAlien = aliens[Math.floor(Math.random() * aliens.length)];
			//Set alien bullet's x and y positions to the center of the shooting alien
			alienBullet.xPos = shootingAlien.xPos + 15;
			alienBullet.yPos = shootingAlien.yPos + 15;
			//Set the alien bullet's y velocity to 5 (default) plus two times how many levels the player has completed, so the bullet gets faster each level
			alienBullet.yVel = 5 + (player.levelsPlayed * 2);
			//Player invader shooting sound
			invaderShoot.play();

		}

	}

};

//Variable for storing the alien bullet
var alienBullet = {

	//Shot - whether the bullet has been shot
	shot: false,
	//x and y positions - set to null to begin with
	xPos: null,
	yPos: null,
	//y velocity - set to 0 to begin with
	yVel: 0,

	//Function for moving the bullet
	move: function() {

		//If the bullet has been shot
		if (this.shot) {

			//Increase the bullet's y position by its y velocity
			this.yPos += this.yVel;

		}

	},

	//Function for drawing the bullet
	draw: function() {

		//If the bullet has been shot
		if (this.shot) {

			//Fill an orange rectangle with the same dimensions as the player's bullet from the alien bullet's x and y positions
			ctx.fillStyle = "orange";
			ctx.fillRect(this.xPos, this.yPos, 3, 25);

		}

	},

	//Function for checking whether the bullet has hit anything or gone offscreen
	check: function() {

		//If the bullet is touching the player
		if ((this.xPos + 3 >= player.xPos) && (this.xPos + 3 <= player.xPos + player.size) && (this.yPos + 25 >= player.yPos) && (this.yPos + 25 <= player.yPos + player.size)) {

			//The bullet has not been shot
			this.shot = false;
			//The player's health decrements
			player.healthPoints--;
			//The player's hit sound plays
			playerDie.play();
			//The player's x position is set to the beginning x position
			player.xPos = 60;

		}

		//If the bullet has gone off the bottom edge of the screen
		if (this.xPos < 0 || this.xPos > canvas.width || this.yPos > canvas.height) {

			//The bullet has not been shot
			this.shot = false;

		}

	}

};

//Variable for storing the barrier's functions - all properties are in the barriers array
var barrier = {

	//Function for drawing each barrier
	draw: function() {

		//Iterate over each barrier
		for (var i = 0; i < barriers.length; i++) {

			//If this barrier is alive
			if (barriers[i].health != 0) {

				//Fill a lime rectangle with the sizes determined by how much health the barrier has
				ctx.fillStyle = "lime";
				ctx.fillRect(barriers[i].xPos, barriers[i].yPos, 100 * (barriers[i].health / 10), 50 * (barriers[i].health / 10));

			}

		}

	},

	//Function for hit detection on both bullets
	check: function() {

		//Iterate over each barrier
		for (var i = 0; i < barriers.length; i++) {

			//If the bullet is touching this barrier
			if (bullet.lockedXPos >= barriers[i].xPos && bullet.lockedXPos <= barriers[i].xPos + (barriers[i].health * 10) && bullet.yPos >= barriers[i].yPos && bullet.yPos <= barriers[i].yPos + (barriers[i].height * 5) && bullet.fire && barriers[i].health) {

				//The bullet has hot been fired
				bullet.fire = false;
				//The bullet moves offscreen
				bullet.yPos = -50;
				//This barrier loses 1 health point
				barriers[i].health--;
				//The x and y positions increase - used to center the drawing function 
				barriers[i].xPos += 5;
				barriers[i].yPos += 2.5;

			}

			//If the alien bullet is touching this barrier
			if (alienBullet.xPos + 3 >= barriers[i].xPos && alienBullet.xPos + 3 <= barriers[i].xPos + (barriers[i].health * 10) && alienBullet.yPos + 25 >= barriers[i].yPos && alienBullet.yPos + 25 <= barriers[i].yPos + (barriers[i].health * 5) && alienBullet.shot && barriers[i].health) {

				//The alien bullet has not been shot
				alienBullet.shot = false;
				//The alien bullet moves offscreen
				alienBullet.yPos = canvas.height + 50;
				//This barrier loses 1 health point
				barriers[i].health--;
				//The x and y positions increase - used to center the drawing function
				barriers[i].xPos += 5;
				barriers[i].yPos += 2.5;

			}

		}

	}

};

//Variable for storing the UFO's properties and methods
var ufo = {

	//Starting x and y positions
	xPos: -200,
	yPos: 20,
	//Starting x velocity
	xVel: 2,
	//Starting points value - for random value
	points: 50,
	//Array for storing possible points values
	scores: [50, 100, 150, 200, 250, 300],
	//Margin for how much the UFO moves offscreen each time it hits the edge
	margin: 200,

	//Function for moving the UFO
	move: function() {

		//If the UFO has hit the margin on the right hand side of the screen
		if (this.xPos + this.xVel >= canvas.width + this.margin) {

			//The UFO moves left
			this.xVel = -2;
			//Margin is recalculated to a random value between 1 and 1000
			this.margin = Math.floor(Math.random() * 1000);

		}

		//If the UFO has hit the margin on the left hand side of the screen
		else if (this.xPos + this.xVel <= this.margin * -1) {

			//The UFO moves right
			this.xVel = 2;
			//Margin is recalculated to a random value between 1 and 1000
			this.margin = Math.floor(Math.random() * 1000);

		}

		//Otherwise - if the UFO has not hit anything
		else {

			//The UFO's x position increases by its x velocity
			this.xPos += this.xVel;

		}

	},

	//Function for drawing UFO
	draw: function() {

		//Draw a red rectangle 64 pixels wide and 32 pixels high
		ctx.fillStyle = "red";
		ctx.fillRect(this.xPos, this.yPos, 64, 32);

	},

	//Function for detecting hits
	check: function() {

		//If the bullet has hit the UFO
		if (bullet.lockedXPos >= this.xPos && bullet.lockedXPos <= this.xPos + 64 && bullet.yPos >= this.yPos && bullet.yPos <= this.yPos + 32) {

			//The bullet has not been fired
			bullet.fire = false;
			//The bullet moves offscreen
			bullet.yPos = -50;
			//The player's score increases by the current value of the UFO
			player.score += this.points;
			//Margin is recalculated to a random value between 1 and 1000
			this.margin = Math.floor(Math.random() * 1000);
			//The UFO's x position is set to the margin on the left hand side of the screen
			this.xPos = this.margin * -1;
			//The UFO moves right
			this.xVel = 2;
			//The UFO death sound is played
			ufoDie.play();

		}

	},

	//Function for calculating a random points value
	randomValue: function() {

		//Assigns the points property to a random element in the scores array
		this.points = this.scores[Math.floor(Math.random() * this.scores.length)];

	},

	//Function for playing the UFO sight sounds
	playSound: function() {

		//If the UFO is on the screen
		if (this.xPos >= 0 && this.xPos <= canvas.width) {

			//Play the UFO appearing sound
			ufoAppear.play();

		}

		//If the UFO is off the screen
		if (this.xPos >= canvas.width || this.xPos <= 0) {

			//Pause the UFO appearing sound
			ufoAppear.pause();

		}

	}

}

//Recursive game loop that updates items every frame
function frame() {

	//Clear the entire canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//Move, update, and check every item
	moveAndUpdateItems();

	//If the player has not won or lost
	if (!player.won && !player.lost) {

		//Recursively update the frame
		requestAnimationFrame(frame);

	}

	else if (player.won && player.gameOver) {

		//This code is to prevent a Promise DOMException error. Code is from https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
		sounds.forEach(function(sound) {

			//Makes a new promise
			var soundPromise = sound.play();

			//If the promise exists
			if (soundPromise != undefined) {

				soundPromise.then(function(_) {

					//Pause and reset the sound
					sound.pause();
					sound.currentTime = 0;

				});

			}

		});

		//Remove the canvas element
		canvas.parentNode.removeChild(canvas);
		
		//Remove all three headings
		document.getElementById("scoreHeading").parentNode.removeChild(document.getElementById("scoreHeading"));
		document.getElementById("highScoreHeading").parentNode.removeChild(document.getElementById("highScoreHeading"));
		document.getElementById("nameHeading").parentNode.removeChild(document.getElementById("nameHeading"));
		
		//Create a button that reloads the page
		var button = document.createElement("button");
		button.setAttribute("onclick", "location.reload()");
		
		//Set the button text to "You Won! Play Again?"
		button.innerHTML = "You Won! Play Again?";
		
		//Add the button to the page
		document.body.append(button);

	}

	//If the player has lost the game
	else if (player.lost && player.gameOver) {

		//This code is to prevent a Promise DOMException error. Code is from https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
		sounds.forEach(function(sound) {

			//Makes a new promise
			var soundPromise = sound.play();

			//If the promise exists
			if (soundPromise != undefined) {

				soundPromise.then(function(_) {

					//Pause and reset the sound
					sound.pause();
					sound.currentTime = 0;

				});

			}

		});

		//Remove the canvas
		canvas.parentNode.removeChild(canvas);
		
		//Remove all three headings
		document.getElementById("scoreHeading").parentNode.removeChild(document.getElementById("scoreHeading"));
		document.getElementById("highScoreHeading").parentNode.removeChild(document.getElementById("highScoreHeading"));
		document.getElementById("nameHeading").parentNode.removeChild(document.getElementById("nameHeading"));
		
		//Create a button the reloads the page
		var button = document.createElement("button");
		button.setAttribute("onclick", "location.reload()");
		
		//Set the button's text to "You Lost! Play Again?"
		button.innerHTML = "You Lost! Play Again?";
		
		//Set the button's background color to red
		button.style.backgroundColor = "red";
		
		//Add the button to the page
		document.body.append(button);

	}

}

//Function for updating all items on the canvas
function moveAndUpdateItems() {

	//UFO functions
	ufo.randomValue();
	ufo.check();
	ufo.move();
	ufo.draw();
	ufo.playSound();
	
	//Barrier functions
	barrier.draw();
	barrier.check();
	
	//Alien functions
	alien.check();
	alien.shoot();
	alien.move();
	alien.draw();
	
	//Player bullet functions
	bullet.draw();
	bullet.move();
	
	//Player functions
	player.draw();
	player.move();
	player.updateScore();
	player.checkWinAndLoss();
	
	//Alien bullet functions
	alienBullet.draw();
	alienBullet.move();
	alienBullet.check();

}

//Custom key down handler function
function keyDown(e) {

	//If the right arrow key was pressed
	if (e.keyCode == 39) {

		//The player's x velocity is 3
		player.xVel = 3;

	} 

	//If the left arrow key was pressed
	if (e.keyCode == 37) {

		//The player's x velocity is -3
		player.xVel = -3;	

	} 

	//If the spacebar was pressed
	if (e.keyCode == 32) {

		//The player shoots
		player.shoot();

	}

}

//Custom key up handler function
function keyUp(e) {

	//If the left or right årrow keys were released
	if (e.keyCode == 39 || e.keyCode == 37) {

		//The player's x velocity is 0
		player.xVel = 0;

	} 

}

//Alien constructor function
function Alien(xPos, yPos, hit, xVel, spawnX, points) {

	//Assign all function parameters to object properties
	this.xPos = xPos;
	this.yPos = yPos;
	this.hit = hit;
	this.xVel = xVel;
	this.spawnX = spawnX;
	this.points = points;

	//If points value is 10
	if (points == 10) {

		//This type of alien is an Octopus
		this.type = "Octopus";

	}

	//If points value is 20
	else if (points == 20) {

		//This type of alien is a Crab
		this.type = "Crab";

	}

	//If points value is 40
	else if (points == 40) {

		//This type of alien is a Squid
		this.type = "Squid";

	}

}

//Function for making aliens at the beginning of each round
function makeAliens() {

	//For loop iterates over y positinns and point values
	for (var i = 60, points = 40; i <= 208; i += 37, changeValue(i)) {

		//For loop iterates over x positions
		for (var j = 60; j <= 356; j += 37) {

			//Creates a new alien
			var newAlien = new Alien(j, i, false, 0.5, j, points);
			//Add the new alien to the aliens array
			aliens.push(newAlien);

		}

	}

	//Function for updating point values 
	function changeValue(num) {

		//If the y position is 97 - this type of alien is a Crab
		if (num == 97) {

			//The point value is 20
			points = 20;

		}

		//If the y position is 171 - this type of alien is an Octopus
		else if (num == 171) {

			//The point value is 10
			points = 10;	

		}

	}

}

//Barrier constructing function
function Barrier(xPos) {

	//Sets all properties to default
	this.xPos = xPos;
	this.yPos = player.yPos - 70;
	this.health = 10;
	this.height = 50;
	this.width = 48.5;

}

//Function for creating barriers at the start of the game
function makeBarriers() {

	//Iterate over each barrier position
	for (var i = 60; i <= 680; i += 194) {

		//Make a new barrier
		var newBarrier = new Barrier(i);
		//Add the new barrier to the barriers array
		barriers.push(newBarrier);

	}

}

//Function for starting gane
function play() {

	//Adds event listeners to the body for key up and key down events
	document.body.addEventListener("keydown", function(event) {
		
		keyDown(event);
		
	});
	document.body.addEventListener("keyup", function(event) {
		
		keyUp(event);
		
	});

	//Sets the canvas to visible - starts invisible
	canvas.style.display = "block";

	//Makes a NodeList of each heading
	var headings = document.getElementsByTagName("h1");

	//Iterates over each heading
	[].forEach.call(headings, function(heading) {

		//Makes each heading visible
		heading.style.display = "block";

	});

	//Removes the play button from the page
	document.getElementById("playButton").parentNode.removeChild(document.getElementById("playButton"));

	//Creates aliens and barriers
	makeAliens();
	makeBarriers();
	//Starts the animation process
	requestAnimationFrame(frame);

	//Repeats a function every second
	setInterval(function() {

		//Toggle the Boolean alien costume variable
		alien.costume1 = !alien.costume1;

	}, 1000);

}
