const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
const TOTAL_ROUNDS = 3;

let playerNames = { X: 'Player X', O: 'Player O' };
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let currentRound = 1;
let roundScores = [];
let roundWinner = null;

const gamePlayPage = document.getElementById('game-play-page');
const scorePage = document.getElementById('score-page');

const roundInfo = document.getElementById('round-info');
const gameInfo = document.getElementById('game-info');
const cells = document.querySelectorAll('.cell');
const gameMessages = document.getElementById('game-messages');
const nextRoundBtn = document.getElementById('next-round-btn');

const playerXScoreHeader = document.getElementById('playerXScoreHeader');
const playerOScoreHeader = document.getElementById('playerOScoreHeader');
const scoreTableBody = document.getElementById('score-table-body');
const finalWinnerMessage = document.getElementById('final-winner-message');
const restartGameBtn = document.getElementById('restart-game-btn');

nextRoundBtn.addEventListener('click', startNewRound);
restartGameBtn.addEventListener('click', restartGame);

function showPage(pageElement) {
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));
    pageElement.classList.add('active');
}

function initializeGame() {
    playerXScoreHeader.textContent = playerNames.X;
    playerOScoreHeader.textContent = playerNames.O;
    currentRound = 1;
    roundScores = [];
    resetBoard();
    showPage(gamePlayPage);
    updateGameInfo();
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    roundWinner = null;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'disabled');
        cell.addEventListener('click', handleCellClick);
    });
    gameMessages.textContent = '';
    nextRoundBtn.style.display = 'none';
}

function startNewRound() {
    if (currentRound < TOTAL_ROUNDS) {
        currentRound++;
        resetBoard();
        roundInfo.textContent = `Round ${currentRound} of ${TOTAL_ROUNDS}`;
        updateGameInfo();
    } else {
        displayFinalScores();
    }
}

function restartGame() {
    playerNames = { X: 'Player X', O: 'Player O' };
    currentRound = 1;
    roundScores = [];
    resetBoard();
    showPage(gamePlayPage);
    gameMessages.textContent = '';
    finalWinnerMessage.textContent = '';
    scoreTableBody.innerHTML = '';
    updateGameInfo();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    clickedCell.classList.add('disabled');
    clickedCell.removeEventListener('click', handleCellClick);

    checkResult();
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const combo = WINNING_COMBINATIONS[i];
        let a = board[combo[0]];
        let b = board[combo[1]];
        let c = board[combo[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        roundWinner = currentPlayer;
        gameMessages.textContent = `${playerNames[currentPlayer]} wins Round ${currentRound}!`;
        recordRoundScore(currentPlayer);
        disableAllCells();
        showNextRoundButton();
        return;
    }

    if (!board.includes('')) {
        gameActive = false;
        roundWinner = 'Draw';
        gameMessages.textContent = `Round ${currentRound} is a Draw!`;
        recordRoundScore('Draw');
        disableAllCells();
        showNextRoundButton();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateGameInfo();
}

function updateGameInfo() {
    roundInfo.textContent = `Round ${currentRound} of ${TOTAL_ROUNDS}`;
    gameInfo.innerHTML = `It's <span style="color: ${currentPlayer === 'X' ? '#e74c3c' : '#2ecc71'};">${playerNames[currentPlayer]}</span>'s turn (${currentPlayer})`;
}

function showNextRoundButton() {
    if (currentRound < TOTAL_ROUNDS) {
        nextRoundBtn.textContent = 'Next Round';
        nextRoundBtn.style.display = 'block';
    } else {
        nextRoundBtn.textContent = 'View Scores';
        nextRoundBtn.style.display = 'block';
    }
}

function recordRoundScore(winner) {
    const scoreEntry = {
        round: currentRound,
        winner: winner,
        playerXScore: 0,
        playerOScore: 0
    };

    if (winner === 'X') {
        scoreEntry.playerXScore = 1;
    } else if (winner === 'O') {
        scoreEntry.playerOScore = 1;
    }

    roundScores.push(scoreEntry);
}

function displayFinalScores() {
    showPage(scorePage);
    scoreTableBody.innerHTML = '';

    let totalXWins = 0;
    let totalOWins = 0;

    roundScores.forEach(score => {
        const row = scoreTableBody.insertRow();
        const cellRound = row.insertCell();
        const cellXScore = row.insertCell();
        const cellOScore = row.insertCell();
        const cellWinner = row.insertCell();

        cellRound.textContent = score.round;
        cellXScore.textContent = score.playerXScore;
        cellOScore.textContent = score.playerOScore;
        cellWinner.textContent = score.winner === 'Draw' ? 'Draw' : playerNames[score.winner];

        totalXWins += score.playerXScore;
        totalOWins += score.playerOScore;
    });

    if (totalXWins > totalOWins) {
        finalWinnerMessage.textContent = `${playerNames.X} wins the game! (${totalXWins} - ${totalOWins})`;
        finalWinnerMessage.style.color = '#e74c3c';
    } else if (totalOWins > totalXWins) {
        finalWinnerMessage.textContent = `${playerNames.O} wins the game! (${totalOWins} - ${totalXWins})`;
        finalWinnerMessage.style.color = '#2ecc71';
    } else {
        finalWinnerMessage.textContent = `The game is a Tie! (${totalXWins} - ${totalOWins})`;
        finalWinnerMessage.style.color = '#e67e22';
    }
}

function disableAllCells() {
    cells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
        cell.classList.add('disabled');
    });
}

window.onload = initializeGame;
