$(document).ready(() => {

	var board = [];
	var boardSize = 9;
	var finished= false;
	var diff;
	var bombCount = 0;
	var bombTotal = $('#difficulty').val();

	function setBombs() {
		while(bombCount < bombTotal) {
			var x = Math.floor(Math.random() * boardSize);
			var y = Math.floor(Math.random() * boardSize);	
			if (!board[x][y].isBomb) {
				board[x][y].isBomb = true;
				bombCount++;
			}
		}
	}

	function tile(x,y) {
		this.xPos = x;
		this.yPos = y;
		this.isBomb = false;
		this.num = 0;
		this.isChecked = false;
		this.isFlagged = false;
		this.element = $('<div class="aTile"></div>');
		$("#grid").append(this.element);
		
		this.element.on("click", () => {
			if(!finished && !this.isFlagged){
				checkTile(this);
				if(checkWonGame() && !finished) {
					gameWon();
				}
			}
		});

		this.element.on("contextmenu", (e) => {
			e.preventDefault();
			if(!finished && !this.isChecked){
				this.isFlagged = !this.isFlagged;
				if(this.isFlagged) {
					this.element.text("^");	
					bombCount--;
				} else {
					this.element.text("");	
					bombCount++;
				}
			}
		});
		
	}

	function checkWonGame() {
		for(var i = 0; i < boardSize; i++) {
			for(var j = 0; j < boardSize; j++) {
				if(!board[i][j].isBomb && !board[i][j].isChecked) {
					return false;
				}			
			}
		}
		return true;	
	}

	function countBorderingMines(x,y) {
		total = 0;
		if (board[x][y].isBomb != true){
			adj = adjacentTiles(board[x][y]);
			for (let i = 0; i < adj.length; i++){			
				  if(adj[i].isBomb){
						total++;
				  }			
				}
			}
		return total;
	}

	function setNumAll() {
		for(i = 0; i < board.length; i++) {
			for(j = 0; j < board.length; j++) {
				board[i][j].num = countBorderingMines(i,j);
			}
		}
	}

	function gameOver() {
		$(document.documentElement).append($('<p class="ending">You Lose</p>'));
		finished = true;
		$('.aTile').css({backgroundColor: 'red'});
		showBoard();
	}

	function gameWon() {
		$(document.documentElement).append($('<p class="ending">You Win!</p>'));
		finished = true;
		$('.aTile').css({backgroundColor: 'green'});
		showBoard();
	}

	function checkTile(tile) {
		tile.isChecked = true;
		if (tile.isBomb) {
			tile.element.text("*");
			if(!finished){			
				gameOver();
			}
		} else{
			tile.element.text(tile.num);
			if(tile.num == 0) {
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
		for(k = tile.xPos-1; k <= tile.xPos+1; k++) {
			for(l = tile.yPos-1; l <= tile.yPos+1; l++) {
				if(k >= 0 && k < boardSize && l >= 0 && l < boardSize) {
					if (!(tile.xPos == k && tile.yPos == l)) { 
						answer.push(board[k][l]);
					}	
				}				
			}
		}
		return answer;
	}

	function showBoard() {
		for(var i = 0; i < boardSize; i++) {
			for(var j = 0; j < boardSize; j++) {
				checkTile(board[i][j]);
			}
		}
	}

	function setBoard(size) {
		diff = $("#difficulty").val();		
		for(i = 0; i < size; i++) {
			board[i] = [];
			for(j = 0; j < size; j++) {
				board[i][j] = new tile(i,j);			
			}
		}
		$("#grid").width((boardSize + 1) * $('.aTile').width());
		setBombs();
		setNumAll();
		$('#mineCount').text('Mine Count: ' + bombCount);
	}

	setBoard(boardSize);

	$("#reset").on("click", () => {
		bombTotal = $('#difficulty').val();
		bombCount = 0;
		$('.aTile').remove();
		$('.ending').remove();
		setBoard(boardSize);
		finished = false;
		$('.aTile').css({backgroundColor: 'gray'});
	});

	$("#show").on("click", () => {
		showBoard();
	});


});

