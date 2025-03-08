var dim = 7; // max 10
var board = [
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0]
];
var turn = 1;
var spread = false;

function undo() {
}

function addattr(element) {
	element.setAttribute("onmouseover", "mouseover(this)");
	element.setAttribute("onmouseout", "mouseout(this)");
	element.setAttribute("onclick", "mouseclick(this)");
}

function newgame(dimension) {
	dim = dimension;
	for (var i = 0; i < dim; i++) {
		for (var j = 0; j < dim; j++) {
			board[i][j] = 0;
		}
	}
	turn = 1;
	spread = false;
	start();
}

function start() {
	gameinit = true;
	manual = false;
	draw_board();
}

function draw_board() {

	var tb = document.getElementById("board");
	// clear game board
	while (tb.firstChild) tb.removeChild(tb.firstChild);
	var offset = (7 - dim)*12;
	var step = 30;

	for (var i = 0; i < dim; i++) {
		for (var j = 0; j < dim; j++) {

			// cells
			var cell = document.createElement("div");
			cell.className = "cell";
			cell.style.top = j * step + offset;
			cell.style.left = i * step + offset;
			cell.id = String(i) + String(j);
			cell.innerHTML = board[i][j];
			addattr(cell);
			tb.appendChild(cell);
		}
	}
	document.getElementById("message").innerHTML = playerName() + "'s turn";
	// score cells
	var score_plus = document.createElement("div");
	score_plus.className = "cell stack_plus";
	score_plus.style.top = offset;
	score_plus.style.left = dim * step + 10 + offset;
	score_plus.id = "score_plus";
	score_plus.innerHTML = score(1);
	tb.appendChild(score_plus);
	var score_minus = document.createElement("div");
	score_minus.className = "cell stack_minus";
	score_minus.style.top = step + offset;
	score_minus.style.left = dim * step + 10 + offset;
	score_minus.id = "score_minus";
	score_minus.innerHTML = score(-1);
	tb.appendChild(score_minus);
}

function score(tn) {
	var score = 0;
	for (var i = 0; i < dim; i++) {
		for (var j = 0; j < dim; j++) {
			if (board[i][j] * tn > 0) score += board[i][j] * tn;
		}
	}
	return score;
}

function updateScore() {
	document.getElementById("score_plus").innerHTML = score(1);
	document.getElementById("score_minus").innerHTML = score(-1);
}

function iSClickable(element) {
	var x = parseInt(element.id.substr(0, 1));
	var y = parseInt(element.id.substr(1, 1));
	if (spread) {
		return (board[x][y] * turn == 4);
	}
	if (board[x][y] == 0) return true;
	if (board[x][y] * turn > 0) return true;
	return false;
}

function isSpreadable() {
	for (var i = 0; i < dim; i++) {
		for (var j = 0; j < dim; j++) {
			if (board[i][j] == 4 || board[i][j] == -4) return true;
		}
	}
	return false;
}

function cellColor(element, x, y) {
	if (board[x][y] > 0) {
		element.className = "cell stack_plus";
	} else if (board[x][y] < 0) {
		element.className = "cell stack_minus";
	} else {
		element.className = "cell";
	}
}

function updateCell(x, y) {
	el = document.getElementById(String(x) + String(y));
	el.innerHTML = Math.abs(board[x][y]);
	cellColor(el, x, y);
}

function spreadStack(x, y) {
	if (board[x][y] * turn < 0) {
		board[x][y] *= -1;
	}
	board[x][y] += turn;
	updateCell(x, y);
}

function doSpread(element, x, y) {
	if (x > 0) {
		spreadStack(x - 1, y);
		board[x][y] -= turn;
	}
	if (x < dim - 1) {
		spreadStack(x + 1, y);
		board[x][y] -= turn;
	}
	if (y > 0) {
		spreadStack(x, y - 1);
		board[x][y] -= turn;
	}
	if (y < dim - 1) {
		spreadStack(x, y + 1);
		board[x][y] -= turn;
	}
}

function playerName() {
	if (turn > 0) {
		return "Player1";
	} else {
		return "Player2";
	}
}

function mouseclick(element) {
	if (!iSClickable(element)) return;
	var x = parseInt(element.id.substr(0, 1));
	var y = parseInt(element.id.substr(1, 1));
	if (board[x][y] * turn == 4) {
		doSpread(element, x, y);
		spread = false;
	} else {
		board[x][y] += turn;
	}
	element.innerHTML = Math.abs(board[x][y]);
	cellColor(element, x, y);
	updateScore();
	if (isSpreadable()) {
		spread = true;
		document.getElementById("message").innerHTML = playerName() + "'s spread";
		return;
	}
	turn *= -1;
	document.getElementById("message").innerHTML = playerName() + "'s turn";
}

function mouseover(element) {
	if (!iSClickable(element)) return;
	if (turn > 0) {
		element.className = "cell hover_plus";
	} else {
		element.className = "cell hover_minus";
	}
}

function mouseout(element) {
	var x = parseInt(element.id.substr(0, 1));
	var y = parseInt(element.id.substr(1, 1));
	cellColor(element, x, y);
}
