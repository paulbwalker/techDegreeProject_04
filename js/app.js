/* I WRAPPED MY GAME IN A GLOBAL IFEE ------------------------------------------------------ */
  
  (function() { 

// Assign gobal variables to different pieces needed to create the tic-tac-toe game.
  let origBoard;
  let gameBoard;
  let huPlayer = 'O';
  let aiPlayer = 'X'; 
  let player1NameValue = document.getElementById('username1').value;
  let player2NameValue = document.getElementById('username2').value;
  const aiPlayerValue = 'Computer';
  const defaultPlayer1 = 'Player 1';
  const defaultPlayer2 = 'Player 2';
  let player1 = 'O';
  let player2 = 'X'
  let turns = 0;
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


  /* CREATED AN OBJECT THAT SHOWS OR HIDE PAGES WITHIN THE GAME ---------------------------------- */
  const showPage = (function() {
  // The variable are consider private within this function and cannot be access outside this function.
    let start = document.getElementById('start');
    let board = document.getElementById('board');
    let finish = document.getElementById('finish');
  // These function is public and can be called outside this function.
    return {
      startPage: function() {
        start.classList.remove('hide-page');
        board.classList.add('hide-page');
        finish.classList.add('hide-page');
      },
      gamePage: function() {
        board.classList.remove('hide-page');
        start.classList.add('hide-page');
        finish.classList.add('hide-page');
      },
      finishPage: function() {
        finish.classList.remove('hide-page');
        start.classList.add('hide-page');
        board.classList.add('hide-page');
      }
    }
  }());

  /* CREATED AN OBJECT THAT SHOWS ICONS WHEN MOUSE OVER SQUARES ---------------------------------- */
  const myMouseOver = (function () {
    let test = document.querySelector('.boxes');
    return {
      playerO: function() {
        test.addEventListener("mouseover", function( event ) {
          event.target.style.backgroundImage = 'url(img/o.svg)';
          test.addEventListener("mouseout", function( event ) {
            event.target.style.backgroundImage = '';
          }, false);
        }, false);  
      },
      playerX: function() {
        test.addEventListener("mouseover", function( event ) {
          event.target.style.backgroundImage = 'url(img/x.svg)';
          test.addEventListener("mouseout", function( event ) {
            event.target.style.backgroundImage = '';
          }, false);
        }, false);      
      }
    }

  }());


  // //create new start page
  // const startPage = new Page('screen screen-start', 'start', 'Tic Tac Toe', 'message', 'none');
  const startPage = showPage.startPage();
  const startGame = () => {
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].classList.remove('box-filled-1');
        boxes[i].classList.remove('box-filled-2');
        boxes[i].style.removeProperty('background-color');
        winMessage.style.backgroundColor = '';
        boxes[i].addEventListener('click', turnClick, false);
     }
  // This class is added to tell user who goes first which is O.
     return liFirstChild.classList.add('active'); 
  }

  // Resets and removes the screen callouts win-one, win-two, or win-tie.
    const reset = () => {
    winMessage.classList.remove('screen-win-one');
    winMessage.classList.remove('screen-win-two');
    winMessage.classList.remove('screen-win-tie');
    winMessage.style.backgroundColor = '';

  // This function clears out all the x's and o's that was played in the previous game.
    startGame();
  // Call out the tic tac toe game page.
    showPage.gamePage();
   }
    // Gathers the information in the input boxes.
  const getInfo = () => {
    const computer = document.getElementById('computer-check');
    player1NameValue = document.getElementById('username1').value;
    player2NameValue = document.getElementById('username2').value;
    showPage.gamePage();
    // If computer textbox is checked and user will play with computer else plays headToHead.
    if (computer.checked) {
      document.getElementsByTagName('h2')[0].innerHTML = `
          <span class="player1">${player1NameValue || defaultPlayer1}</span> 
          vs <span class="player2">${aiPlayerValue}</span>
        `;
      return player1VsComputer();
    } else {
      document.getElementsByTagName('h2')[0].innerHTML = `
          <span class="player1">${player1NameValue || defaultPlayer1}</span> 
          vs <span class="player2">${player2NameValue || defaultPlayer2}</span>
        `;
      return player1VsPlayer2();
    }
  }

/* PLAYER1 VERSUS PLAYER2 ----------------------------------------------------------------------- */

  // I set it up this way to use common functions with player1VsComputer.
  const player1VsPlayer2 = () => { 
    return startGame();
  }

  const turnClick = (square) => {
    if (typeof origBoard[square.target.id] === 'number' && !checkTie()) {
      if (turns === 0) {
        turn(square.target.id, player1);
        turns += 1; 
        myMouseOver.playerX();  
      } else{
        turn(square.target.id, player2);
        turns -= 1;
        myMouseOver.playerO();
      }
    }
  }

  const turn = (squareId, player) => {
    origBoard[squareId] = player;
    if (player === player1) {
      document.getElementById(squareId).classList.add('box-filled-1');  
      liLastChild.classList.add('active');
      liFirstChild.classList.remove('active');
    } else {
      document.getElementById(squareId).classList.add('box-filled-2');
      liFirstChild.classList.add('active');
      liLastChild.classList.remove('active');
    } 
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
    checkTie();
  }

  const checkWin = (board, player) => {
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
    let loser = document.getElementsByClassName('message')[0];
      for (let index of winCombos[gameWon.index]) {
        winMessage.style.backgroundColor =
        gameWon.player === huPlayer ? '#FFA000' : '#3688C3';
      }
      for (let i = 0; i < boxes.length; i++) {
      boxes[i].removeEventListener('click', turnClick, false);
    }
   declareWinner(gameWon.player === huPlayer ? `Winner: ${player1NameValue || defaultPlayer1}` : `Winner: ${player2NameValue}` || `Winner: ${aiPlayerValue}`);

  }

  const declareWinner = (who) => {
    if (who === 'It\'s a Tie!') {
      winMessage.classList.add('screen-win-tie');
    } else if (who === `Winner: ${player1NameValue || defaultPlayer1}`) {

      winMessage.classList.add('screen-win-one');
    } else if (who === `Winner: ${player2NameValue || aiPlayerValue }`) {
      winMessage.classList.add('screen-win-two');
    }
    winOrTie.innerHTML = who;
    showPage.finishPage();
  }

  const emptySquares = () => {
    return origBoard.filter(s => typeof s === 'number');
  }

  const checkTie = () => {
    if(emptySquares().length === 0) {
      for (let i = 0; i < boxes.length; i++) {
        // this clears out all the marks on the board.
        boxes[i].removeEventListener('click', turnClick, false);
      }
      declareWinner("It's a Tie!");
      return true;
    }
    return false;
  }

/* VERSUS AIPLAYER ----------------------------------------------------------------------- */

  // This function is similar with startGame but the EventListener goes to different area.
  const startComputerGame = () => {
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].classList.remove('box-filled-1');
        boxes[i].classList.remove('box-filled-2');
      boxes[i].style.removeProperty('background-color');
        boxes[i].addEventListener('click', aiClick, false);
     }
     // This class is added to tell user who goes first which is O.
     return liFirstChild.classList.add('active'); 
  }

  // These function are similar with player1VsPlayer2 with the exception player2 plays automatically.
  const player1VsComputer = () => {
    return startComputerGame();
  }
  const aiClick = (square) => {
    if (typeof origBoard[square.target.id] === 'number') {
      myMouseOver.playerO();
        turn(square.target.id, huPlayer);
      if (!checkTie()) computerTurn(bestSpot(), aiPlayer);
      }
   }
   const huMark = () => {
      liFirstChild.classList.remove('player1');
      liFirstChild.classList.add('active');
      liFirstChild.setAttribute('id', 'player1');
    }
    const aiTurn = () => {
      liLastChild.classList.remove('player2');
      liLastChild.classList.add('active');
      liLastChild.setAttribute('id', 'player2');
    }
    const removeHuMark = () => {
        liFirstChild.classList.remove('active');
    }
    const removeAiTurn = () => {
      liLastChild.classList.remove('active');
    }
  const computerTurn = (squareId, player) => {
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
  function bestSpot(){
    return minimax(origBoard, aiPlayer).index;
  }

  /* This minimax algorithm was on utube and works well so I incorperated it. -------------------------------------------- */

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
