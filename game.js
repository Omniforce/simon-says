$(function() {
	var game = new Game();

	$('#start').click(function() {
		game.startGame();
	});
});

function Game() {
	this.sequence = [];
	this.copy = [];
	this.score = 0;
	this.tiles = [$('#green'), $('#red'), $('yellow'), $('blue')];

	// ------------------- Game Logic ------------------

	this.startGame = function() {
		$('#start').hide();
		$('#score').show();

		this.sequence = [];
		this.copy = [];
		this.score = 0;

		$('.scoreValue').each(function() {
			$(this).html(0);
		});

		this.newRound();
	}

	this.newRound = function() {
		this.sequence.push(this.randomTile());
		this.copy = this.sequence.slice(0);
		this.display();
	}

	this.checkGame = function(correctInput) {
		if(this.copy.length == 0 && correctInput) {
			this.updateScore();
			this.denyUserInput();
			this.newRound();
		} else if(!correctInput) {
			this.denyUserInput();
			this.endGame();
		}
	}

	this.endGame = function() {
		$('#score').hide();
		$('#gameOver').show();
		setTimeout(function() {
			$('#gameOver').hide();
			$('#start').show();
		}, 3000);
	}

	this.randomTile = function() {
		return Math.floor((Math.random()*4) + 1);
	}

	// ------------------ User Interaction ------------------

	this.allowUserInput = function() {
		var thisGame = this;

		if (Modernizr.touch) {
			$('#simon').on('touchstart', '.tile', function() {
				$(this).addClass('active');
			}).on('touchend', '.tile', function(e) {
				$(this).removeClass('active');
				console.log(e);
				thisGame.userClick(e);
			});
		} else {
			$('#simon').on('click', '.tile', function(e) {
				thisGame.userClick(e);
			}).on('mousedown', '.tile', function() {
				$(this).addClass('active');
			}).on('mouseup', '.tile', function() {
				$(this).removeClass('active');
			});
		}
	}

	this.denyUserInput = function() {
		$('#simon').off('click mousedown mouseup touchstart touchend', '.tile');
	}

	this.userClick = function(e) {
		var clickedTile = $(e.target).attr('class').slice(-1);
		var isCorrect = clickedTile == this.copy.shift();
		this.checkGame(isCorrect);
	}

	// ------------------ Display ------------------

	this.display = function() {
		var i = 0;
		var thisGame = this;
		var interval = setInterval(function() {
			thisGame.lightUpTiles(thisGame.sequence[i]);
			i++;

			if(i >= thisGame.sequence.length) {
				clearInterval(interval);
				thisGame.allowUserInput();
			}
		}, 600);
	}

	this.lightUpTiles = function(tile) {
		$tile = $('.'+tile);
		$tile.animate({
			opacity: 1
		}, 250, function() {
			setTimeout(function() {
				$tile.css('opacity', 0.6);
			}, 250);
		});
	}

	this.updateScore = function(score) {
		var score = this.score++;
		$('.scoreValue').each(function() {
			$(this).html(score + 1);
		});
	}
}