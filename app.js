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

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const API_BASE = 'http://backend:4000/api';

async function fetchScores() {
  try {
    const response = await fetch(`${API_BASE}/scores`);
    const scores = await response.json();
    updateScoreboard(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
  }
}

async function updateScore(winner) {
  try {
    await fetch(`${API_BASE}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winner })
    });
    fetchScores();
  } catch (error) {
    console.error('Error updating score:', error);
  }
}

async function resetScoresAPI() {
  try {
    await fetch(`${API_BASE}/reset-scores`, {
      method: 'POST'
    });
    fetchScores();
  } catch (error) {
    console.error('Error resetting scores:', error);
  }
}

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
      updateScore(currentPlayer);
      return;
    }
  }
  if(board.every(cell => cell !== null)){
    gameActive = false;
    statusEl.textContent = 'Remis';
    updateScore('D');
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

function updateScoreboard(scores){
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.D;
}

resetScoresBtn.addEventListener('click', resetScoresAPI);

// attach events
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', resetGame);

// init
statusEl.textContent = 'Ruch: ';
playerEl.textContent = currentPlayer;
fetchScores();
