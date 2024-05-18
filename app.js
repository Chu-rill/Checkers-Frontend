const RED = "Red",
  BLACK = "Black",
  BOARD_WIDTH = 8;
let selectedSquare = null;
let currentPlayer = RED;
let redScore = 0;
let blackScore = 0;
let board = [];

function Piece(player, x, y) {
  this.player = player;
  this.x = x;
  this.y = y;
  this.isKing = false;
  this.isChoice = false;
  this.matados = [];
}

function newGame() {
  currentPlayer = RED;
  redScore = 0;
  blackScore = 0;

  board = [];
  for (let i = 0; i < BOARD_WIDTH; i++) {
    board[i] = [];
    for (let j = 0; j < BOARD_WIDTH; j++) {
      if (i < 3 && (i + j) % 2 === 1) {
        board[i][j] = new Piece(BLACK, j, i);
      } else if (i >= BOARD_WIDTH - 3 && (i + j) % 2 === 1) {
        board[i][j] = new Piece(RED, j, i);
      } else {
        board[i][j] = new Piece(null, j, i);
      }
    }
  }
  renderBoard();
  updateScores();
}

function renderBoard() {
  const gameElement = document.getElementById("game");
  gameElement.innerHTML = "";
  gameElement.className = "board";
  for (let i = 0; i < BOARD_WIDTH; i++) {
    for (let j = 0; j < BOARD_WIDTH; j++) {
      const square = board[i][j];
      const squareElement = document.createElement("div");
      squareElement.className = "square";
      squareElement.classList.add(
        (i + j) % 2 === 0 ? "white-square" : "black-square"
      );
      if (square.player) {
        const pieceElement = document.createElement("div");
        pieceElement.className =
          square.player === RED ? "red-piece" : "black-piece";
        pieceElement.innerText = square.isKing ? "K" : "";
        squareElement.appendChild(pieceElement);
      }
      if (square.isChoice) {
        squareElement.classList.add("choice");
      }
      squareElement.addEventListener("click", () => selectSquare(square));
      gameElement.appendChild(squareElement);
    }
  }
}

function selectSquare(square) {
  if (selectedSquare !== null && !square.player) {
    movePiece(square);
    resetChoices();
  } else if (square.player === currentPlayer) {
    selectedSquare = square;
    resetChoices();
    setChoices(
      selectedSquare.x,
      selectedSquare.y,
      1,
      [],
      -1,
      -1,
      selectedSquare.isKing
    );
  } else {
    selectedSquare = null;
  }
  renderBoard();
}

function resetChoices() {
  for (let i = 0; i < BOARD_WIDTH; i++) {
    for (let j = 0; j < BOARD_WIDTH; j++) {
      board[i][j].isChoice = false;
      board[i][j].matados = [];
    }
  }
}

function movePiece(square) {
  if (square.isChoice) {
    let becomeKing = selectedSquare.isKing;
    for (let i = 0; i < square.matados.length; i++) {
      const matado = square.matados[i];
      jump(matado);
      becomeKing = becomeKing || becomeKingAfterJump(matado.x, matado.y);
    }

    square.player = selectedSquare.player;
    square.isKing = becomeKing || isKing(square);
    selectedSquare.player = null;
    selectedSquare.isKing = false;
    currentPlayer = currentPlayer === RED ? BLACK : RED;
    updateScores();
  }
}

function isKing(square) {
  if (currentPlayer === RED) {
    return square.y === 0;
  } else {
    return square.y === BOARD_WIDTH - 1;
  }
}

function becomeKingAfterJump(x, y) {
  return (
    (currentPlayer === RED && y === 1) ||
    (currentPlayer === BLACK && y === BOARD_WIDTH - 2)
  );
}

function jump(jumped) {
  jumped.player = null;
  jumped.isKing = false;
  if (currentPlayer === RED) {
    redScore++;
    if (redScore === 12) {
      setTimeout(() => gameOver(RED), 50);
    }
  } else {
    blackScore++;
    if (blackScore === 12) {
      setTimeout(() => gameOver(BLACK), 50);
    }
  }
}

function setChoices(x, y, depth, matados, oldX, oldY, isKing) {
  if (depth > 10) return;
  isKing =
    isKing ||
    (currentPlayer === RED && y === 0) ||
    (currentPlayer === BLACK && y === BOARD_WIDTH - 1);
  // Upper Choices
  if (currentPlayer === RED || isKing) {
    // Upper Left
    if (x > 0 && y > 0) {
      const UP_LEFT = board[y - 1][x - 1];
      if (UP_LEFT.player) {
        if (UP_LEFT.player !== currentPlayer) {
          if (x > 1 && y > 1 && !(x - 2 === oldX && y - 2 === oldY)) {
            const UP_LEFT_2 = board[y - 2][x - 2];
            if (!UP_LEFT_2.player) {
              UP_LEFT_2.isChoice = true;
              const jumpers = matados.slice(0);
              if (jumpers.indexOf(UP_LEFT) === -1) jumpers.push(UP_LEFT);
              UP_LEFT_2.matados = jumpers;
              setChoices(x - 2, y - 2, depth + 1, jumpers, x, y, isKing);
            }
          }
        }
      } else if (depth === 1) {
        UP_LEFT.isChoice = true;
      }
    }

    // Upper Right
    if (x < BOARD_WIDTH - 1 && y > 0) {
      const UP_RIGHT = board[y - 1][x + 1];
      if (UP_RIGHT.player) {
        if (UP_RIGHT.player !== currentPlayer) {
          if (
            x < BOARD_WIDTH - 2 &&
            y > 1 &&
            !(x + 2 === oldX && y - 2 === oldY)
          ) {
            const UP_RIGHT_2 = board[y - 2][x + 2];
            if (!UP_RIGHT_2.player) {
              UP_RIGHT_2.isChoice = true;
              const jumpers = matados.slice(0);
              if (jumpers.indexOf(UP_RIGHT) === -1) jumpers.push(UP_RIGHT);
              UP_RIGHT_2.matados = jumpers;
              setChoices(x + 2, y - 2, depth + 1, jumpers, x, y, isKing);
            }
          }
        }
      } else if (depth === 1) {
        UP_RIGHT.isChoice = true;
      }
    }
  }

  // Lower Choices
  if (currentPlayer === BLACK || isKing) {
    // Lower Left
    if (x > 0 && y < BOARD_WIDTH - 1) {
      const LOWER_LEFT = board[y + 1][x - 1];
      if (LOWER_LEFT.player) {
        if (LOWER_LEFT.player !== currentPlayer) {
          if (
            x > 1 &&
            y < BOARD_WIDTH - 2 &&
            !(x - 2 === oldX && y + 2 === oldY)
          ) {
            const LOWER_LEFT_2 = board[y + 2][x - 2];
            if (!LOWER_LEFT_2.player) {
              LOWER_LEFT_2.isChoice = true;
              const jumpers = matados.slice(0);
              if (jumpers.indexOf(LOWER_LEFT) === -1) jumpers.push(LOWER_LEFT);
              LOWER_LEFT_2.matados = jumpers;
              setChoices(x - 2, y + 2, depth + 1, jumpers, x, y, isKing);
            }
          }
        }
      } else if (depth === 1) {
        LOWER_LEFT.isChoice = true;
      }
    }

    // Lower Right
    if (x < BOARD_WIDTH - 1 && y < BOARD_WIDTH - 1) {
      const LOWER_RIGHT = board[y + 1][x + 1];
      if (LOWER_RIGHT.player) {
        if (LOWER_RIGHT.player !== currentPlayer) {
          if (
            x < BOARD_WIDTH - 2 &&
            y < BOARD_WIDTH - 2 &&
            !(x + 2 === oldX && y + 2 === oldY)
          ) {
            const LOWER_RIGHT_2 = board[y + 2][x + 2];
            if (!LOWER_RIGHT_2.player) {
              LOWER_RIGHT_2.isChoice = true;
              const jumpers = matados.slice(0);
              if (jumpers.indexOf(LOWER_RIGHT) === -1)
                jumpers.push(LOWER_RIGHT);
              LOWER_RIGHT_2.matados = jumpers;
              setChoices(x + 2, y + 2, depth + 1, jumpers, x, y, isKing);
            }
          }
        }
      } else if (depth === 1) {
        LOWER_RIGHT.isChoice = true;
      }
    }
  }
}

function gameOver(winner) {
  alert(winner + " wins!");
  newGame();
}

function updateScores() {
  document.getElementById("red-score").innerText = "Red Score: " + redScore;
  document.getElementById("black-score").innerText =
    "Black Score: " + blackScore;
}

newGame();
