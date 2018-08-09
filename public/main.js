$(document).ready(() => {

	var board = [];
	var boardSize = 9;
	var tileWidth = Math.floor($('#grid').width() / boardSize) - 2;
	var finished= false;
	var diff;
	var bombCount = 0;

	function decideIfBomb() {
		if (Math.ceil(Math.random() * diff) == 1) {
			bombCount++;
			return true;
		}
	}

	function tile(x,y) {
		this.xPos = x;
		this.yPos = y;
		this.isBomb = decideIfBomb();
		this.num = 0;
		this.isChecked = false;
		this.element = $('<div class="aTile"></div>');
		this.element.height(tileWidth);
		this.element.width(tileWidth);
		$("#grid").append(this.element);
		
		this.element.on("click", () => {
			checkTile(this);
			if(checkWonGame() && !finished) {
				gameWon();
			}
		});

		this.element.on("contextmenu", (e) => {
			this.element.text("^");
			e.preventDefault();
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
	}

	function gameWon() {
		$(document.documentElement).append($('<p class="ending">You Win!</p>'));
		finished = true;
		$('.aTile').css({backgroundColor: 'green'});
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

	function setBoard(size) {
		diff = $("#difficulty").val();
		for(i = 0; i < size; i++) {
			board[i] = [];
			for(j = 0; j < size; j++) {
				board[i][j] = new tile(i,j);			
			}
		}
		setNumAll();
		console.log(diff);
		$('#mineCount').text('Mine Count: ' + bombCount);
	}

	setBoard(boardSize);

	$("#reset").on("click", () => {
		bombCount = 0;
		$('.aTile').remove();
		$('.ending').remove();
		setBoard(boardSize);
		finished = false;
		$('.aTile').css({backgroundColor: 'gray'});
	});

	$("#show").on("click", () => {
		for(var i = 0; i < boardSize; i++) {
			for(var j = 0; j < boardSize; j++) {
				checkTile(board[i][j]);
			}
		}
	});


});

