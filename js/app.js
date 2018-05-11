// Wrap my code in a self executing function.
(function() {
/* ASSIGN GOBAL VARIABLES TO THE VARIOUS PAGE STATES ---------------------------------------------------- */
  const startPage = document.getElementById('start');
  const gamePage = document.getElementById('board');
  const winnerPage = document.getElementById('finish');
  // Assign gobal variables to different pieces needed to create the tic-tac-toe game.
  let origBoard;
  let gameBoard;
  let turns = 0;
  let huPlayer = 'O';
  let aiPlayer = 'X';
  const winCombos =[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [6, 4, 2],
    [2, 5, 8],
    [1, 4, 7],
    [0, 3, 6]
  ];
  const liFirstChild = document.querySelector('header ul li:first-child');
  const liLastChild = document.querySelector('header ul li:last-child');
  const boxes = document.querySelectorAll('.box');
  const winMessage = document.getElementById('finish');
  const winOrTie = document.getElementsByClassName('message')[0];
  const cells = document.querySelectorAll('.box');

// This is a simple function to hide the pages that is not needed when getinfo is shown.
  const showStart = () => {
    gamePage.classList.add('hide-page');
    winnerPage.classList.add('hide-page');
  }
showStart();


// Removes the screen callouts win-one, win-two, or win-tie.
  const reset = () => {
    gamePage.classList.remove('hide-page');
    startPage.classList.add('hide-page');
    winnerPage.classList.add('hide-page');
    winMessage.classList.remove('screen-win-one');
    winMessage.classList.remove('screen-win-two');
    winMessage.classList.remove('screen-win-tie');
    winMessage.style.backgroundColor = '';

// This function clears out all the x's and o's that was played in the previous game.
    startGame();
   }

/* THIS FUNCTION TAKES THE USERNAME & PLAYER WITH THE MINIMAX COMPUTER ---------------------------------- */

  const getInfo = () => {
    startPage.classList.add('hide-page');
    gamePage.classList.remove('hide-page');
    let player1 = document.getElementById('username1').value;
    let defaultPlayer1 = 'Player 1';
    let defaultPlayer2 = 'Computer';

    let computer = document.getElementById('computer-check');
    let aiPlayer = 'Computer';

    // The computer is player 2.
    document.getElementsByTagName('h2')[0].innerHTML = `
          <span class="player1">${player1 || defaultPlayer1}</span>
          vs <span class="player2">${aiPlayer}</span>
        `;
  }

/* THIS FUNCTION STARTS THE GAME -------------------------------------------------------------- */

startGame();
huMark();

// Clears out all the marking from the previous game if played.
function startGame() {
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].classList.remove('box-filled-1');
    boxes[i].classList.remove('box-filled-2');
    boxes[i].style.removeProperty('background-color');
    boxes[i].addEventListener('click', turnClick, false);
  }
}

 function turnClick(square) {
  if (typeof origBoard[square.target.id] === 'number') {
      turn(square.target.id, huPlayer);
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
 }
   function huMark() {
      liFirstChild.classList.remove('player1');
      liFirstChild.classList.add('active');
      liFirstChild.setAttribute('id', 'player1');
    }
   function aiTurn() {
      liLastChild.classList.remove('player2');
      liLastChild.classList.add('active');
      liLastChild.setAttribute('id', 'player2');
    }
    function removeHuMark() {
        liFirstChild.classList.remove('active');
    }
    function removeAiTurn() {
      liLastChild.classList.remove('active');
    }

 function turn(squareId, player) {
  origBoard[squareId] = player;
  if (player === huPlayer) {
    document.getElementById(squareId).classList.add('box-filled-1');
    setTimeout(removeAiTurn, 1000);
  aiTurn();
  } else {
    function aiMark() {
      document.getElementById(squareId).classList.add('box-filled-2');
    }
    setTimeout(aiMark, 500);
    setTimeout(huMark, 1000);
    setTimeout(removeHuMark, 200);
  }
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
 }

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

const gameOver = (gameWon) => {
  winnerPage.classList.remove('hide-page');
  startPage.classList.add('hide-page');
  gamePage.classList.add('hide-page');

  let loser = document.getElementsByClassName('message')[0];
    for (let index of winCombos[gameWon.index]) {
      winMessage.style.backgroundColor =
      gameWon.player === huPlayer ? '#FFA000' : '#3688C3';
    }
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].removeEventListener('click', turnClick, false);
    }
  declareWinner(gameWon.player === huPlayer ? 'WinnerO' : 'Winner');
}

function declareWinner(who) {
  winnerPage.classList.remove('hide-page');
  startPage.classList.add('hide-page');
  gamePage.classList.add('hide-page');
  if (who === "It's a Tie!") {
    winMessage.classList.add('screen-win-tie');
  } else if (who === "WinnerO") {
    winMessage.classList.add('screen-win-one');
  } else {
    winMessage.classList.add('screen-win-two');
  }

  winOrTie.innerHTML = who;
}

function emptySquares() {
  return origBoard.filter(s => typeof s === 'number');
}

function bestSpot(){
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length === 0) {
    for (let i = 0; i < boxes.length; i++) {
/* Clears out all the x's and o's on the board. -------------------------------------------- */
      boxes[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("It's a Tie!");
    return true;
  }
  return false;
}


/* Gets the minimax algorithm. -------------------------------------------- */

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, huPlayer)) {
    return {score: -10};
  } else if (checkWin(newBoard, aiPlayer)) {
    return {score: 10};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }

  var moves = [];
  for (let i = 0; i < availSpots.length; i ++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === aiPlayer)
      move.score = minimax(newBoard, huPlayer).score;
    else
       move.score =  minimax(newBoard, aiPlayer).score;
    newBoard[availSpots[i]] = move.index;
    if ((player === aiPlayer && move.score === 10) || (player === huPlayer && move.score === -10))
      return move;
    else
      moves.push(move);
  }

  let bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -1000;
    for(let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
      bestScore = 1000;
      for(let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}






/* ADD EVENTLISTENER ON THE CLICK EVENT ON THE START BUTTON ------------------------------------ */
document.querySelector('.button').addEventListener("click", getInfo, false);

/* RESET GAME ---------------------------------------------------------------------------------- */
document.getElementById('new-game').addEventListener('click', reset, false);

}());
