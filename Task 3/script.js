const cells = document.querySelectorAll('.cell');
const statusDiv = document.getElementById('game-status');
const resetButton = document.getElementById('reset-button');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let isGameOver = false;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (isGameOver || gameState[index]) return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWinner()) {
    statusDiv.textContent = `Player ${currentPlayer} wins!`;
    isGameOver = true;
    return;
  }

  if (gameState.every(cell => cell)) {
    statusDiv.textContent = 'It\'s a draw!';
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDiv.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
  return winningCombinations.some(combination =>
    combination.every(index => gameState[index] === currentPlayer)
  );
}

function resetGame() {
  currentPlayer = 'X';
  gameState.fill(null);
  isGameOver = false;
  statusDiv.textContent = `Player X's turn`;
  cells.forEach(cell => (cell.textContent = ''));
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
