const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const playerEl = document.getElementById('player');
const restartBtn = document.getElementById('restart');
const cells = Array.from(document.querySelectorAll('.cell'));

const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');
const resetScoresBtn = document.getElementById('reset-scores');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0, D: 0 };

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function updateStatus(text){
  playerEl.textContent = currentPlayer;
  if(text) statusEl.firstChild && statusEl.firstChild.remove();
}

function handleCellClick(e){
  const idx = Number(e.currentTarget.dataset.index);
  if(!gameActive || board[idx]) return;
  board[idx] = currentPlayer;
  e.currentTarget.textContent = currentPlayer;
  checkResult();
}

function checkResult(){
  for(const combo of winningCombos){
    const [a,b,c] = combo;
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      gameActive = false;
      highlightWin(combo);
      statusEl.textContent = `Wygrywa: ${currentPlayer}`;
      // update score
      if(currentPlayer === 'X') scores.X += 1;
      else scores.O += 1;
      updateScoreboard();
      return;
    }
  }
  if(board.every(cell => cell !== null)){
    gameActive = false;
    statusEl.textContent = 'Remis';
    scores.D += 1;
    updateScoreboard();
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  playerEl.textContent = currentPlayer;
}

function highlightWin(combo){
  combo.forEach(i => cells[i].classList.add('win'));
}

function resetGame(){
  board.fill(null);
  cells.forEach(c => { c.textContent = ''; c.classList.remove('win'); });
  currentPlayer = 'X';
  gameActive = true;
  statusEl.textContent = 'Ruch: ';
  playerEl.textContent = currentPlayer;
}

function updateScoreboard(){
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.D;
}

function resetScores(){
  scores = { X: 0, O: 0, D: 0 };
  updateScoreboard();
}

resetScoresBtn.addEventListener('click', resetScores);

// attach events
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', resetGame);

// init
statusEl.textContent = 'Ruch: ';
playerEl.textContent = currentPlayer;
updateScoreboard();
