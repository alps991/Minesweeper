$(document).ready(() => {

	var board = [];
	var boardWidth = 9;
	var boardHeight = 9;
	var finished = false;
	var bombCount = 0;
	var bombTotal = 10;

	function setBombs() {
		while (bombCount < bombTotal) {
			var y = Math.floor(Math.random() * boardWidth);
			var x = Math.floor(Math.random() * boardHeight);
			if (!board[x][y].isBomb) {
				board[x][y].isBomb = true;
				bombCount++;
			}
		}
	}

	function tile(x, y) {
		this.xPos = x;
		this.yPos = y;
		this.isBomb = false;
		this.num = 0;
		this.isChecked = false;
		this.isFlagged = false;
		this.element = $('<div class="aTile"></div>');
		$("#grid").append(this.element);

		this.element.on("click", () => {
			if (!finished && !this.isFlagged) {
				checkTile(this);
				if (checkWonGame() && !finished) {
					gameWon();
				}
			}
		});

		this.element.on("contextmenu", (e) => {
			e.preventDefault();
			if (!finished && !this.isChecked) {
				this.isFlagged = !this.isFlagged;
				if (this.isFlagged) {
					this.element.html("<img src='./images/flag.png'>");
					bombCount--;
					$('#mineCount').text(bombCount);
				} else {
					this.element.html("");
					bombCount++;
					$('#mineCount').text(bombCount);
				}
			}
		});
	}

	function checkWonGame() {
		for (var i = 0; i < board.length; i++) {
			for (var j = 0; j < board[0].length; j++) {
				if (!board[i][j].isBomb && !board[i][j].isChecked) {
					return false;
				}
			}
		}
		return true;
	}

	function countBorderingMines(x, y) {
		total = 0;
		if (board[x][y].isBomb != true) {
			adj = adjacentTiles(board[x][y]);
			for (let i = 0; i < adj.length; i++) {
				if (adj[i].isBomb) {
					total++;
				}
			}
		}
		return total;
	}

	function setNumAll() {
		for (i = 0; i < board.length; i++) {
			for (j = 0; j < board[0].length; j++) {
				board[i][j].num = countBorderingMines(i, j);
			}
		}
	}

	function gameOver() {
		$(document.documentElement).append($('<p class="ending">You Lose</p>'));
		finished = true;
		$('.aTile').css({ backgroundColor: 'red' });
		showBoard();
	}

	function gameWon() {
		$(document.documentElement).append($('<p class="ending">You Win!</p>'));
		finished = true;
		$('.aTile').css({ backgroundColor: 'green' });
		showBoard();
		$('#mineCount').text(0);
	}

	function checkTile(tile) {
		tile.isChecked = true;
		if (tile.isBomb) {
			tile.element.html("<img src='./images/bomb.png'>");
			if (!finished) {
				gameOver();
			}
		} else {
			tile.element.text(tile.num);
			if (tile.num == 0) {
				var adj = adjacentTiles(tile);
				for (var i = 0; i < adj.length; i++) {
					if (!adj[i].isChecked) {
						checkTile(adj[i]);
					}
				}
			}
		}
	}

	function adjacentTiles(tile) {
		answer = [];
		for (k = tile.xPos - 1; k <= tile.xPos + 1; k++) {
			for (l = tile.yPos - 1; l <= tile.yPos + 1; l++) {
				if (k >= 0 && k < board.length && l >= 0 && l < board[0].length) {
					if (!(tile.xPos == k && tile.yPos == l)) {
						answer.push(board[k][l]);
					}
				}
			}
		}
		return answer;
	}

	function showBoard() {
		for (var i = 0; i < board.length; i++) {
			for (var j = 0; j < board[0].length; j++) {
				checkTile(board[i][j]);
			}
		}
	}

	function setBoard() {
		diff = $("#difficulty").val();
		for (i = 0; i < boardHeight; i++) {
			board[i] = [];
			for (j = 0; j < boardWidth; j++) {
				board[i][j] = new tile(i, j);
			}
		}
		$("#grid").width(boardWidth * ($('.aTile').width() + 2));
		setBombs();
		setNumAll();
		$('#mineCount').text(bombCount);
	}

	setBoard();

	$("#reset").on("click", () => {
		let bombs = $('#difficulty').val();
		let bWidth = Number($('#board-width').val());
		let bHeight = Number($('#board-height').val());

		if (bWidth > 30) {
			boardWidth = 30;
			$('#board-width').val(30);
		} else if (bWidth < 4) {
			boardWidth = 4;
			$('#board-width').val(4);
		} else {
			boardWidth = bWidth;
		}

		if (bHeight > 30) {
			boardHeight = 30;
			$('#board-height').val(30);
		} else if (bHeight < 4) {
			boardHeight = 4;
			$('#board-height').val(4);
		} else {
			boardHeight = bHeight;
		}

		if (bombs > boardHeight * boardWidth) {
			bombTotal = boardHeight * boardWidth;
			$('#difficulty').val(bombTotal);
		} else if (bombs < 1) {
			bombTotal = 1;
			$('#difficulty').val(1);
		} else {
			bombTotal = bombs;
		}

		bombCount = 0;
		$('.aTile').remove();
		$('.ending').remove();
		setBoard();
		finished = false;
		$('.aTile').css({ backgroundColor: 'gray' });
	});

	$("#show").on("click", () => {
		showBoard();
	});

	$(".num-input").on("input", (e) => {
		e.target.value = e.target.value.replace(/\D/g, '');
		$('#custom').prop("checked", true);
	});

	$("#mode-select").on("change", () => {
		var mode = $('input[name="mode"]:checked', '#mode-select').val();
		switch(mode) {
			case 'beginner':
				$('#difficulty').val(10);
				$('#board-width').val(9);
				$('#board-height').val(9);
				break;
			case 'intermediate':
				$('#difficulty').val(40);
				$('#board-width').val(16);
				$('#board-height').val(16);
				break;
			case 'expert':
				$('#difficulty').val(99);
				$('#board-width').val(30);
				$('#board-height').val(16);
				break;
		}
	})

});