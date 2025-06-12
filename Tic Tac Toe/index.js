document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const messageText = document.getElementById('messageText');
    const resetButton = document.getElementById('resetButton');
    const restartButton = document.getElementById('restartButton');
    const body = document.body;

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    // Winning combinations (indices of the cells)
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Celebration colors
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];

    // Create confetti effect
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'celebration';
        document.body.appendChild(confettiContainer);

        // Create 100 pieces of confetti
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confettiContainer.appendChild(confetti);
        }

        // Remove confetti after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }

    // Function to handle cell click
    function handleCellClick(e) {
        const cell = e.target;
        const cellIndex = Array.from(cells).indexOf(cell);

        // Check if cell is already filled or game is not active
        if (gameBoard[cellIndex] !== '' || !gameActive) {
            return;
        }

        // Update the game board and UI
        gameBoard[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer === 'X' ? 'x' : 'o');

        // Add animation class
        cell.style.animation = 'popIn 0.3s ease-out';
        setTimeout(() => {
            cell.style.animation = '';
        }, 300);

        // Check for win or draw
        if (checkWin()) {
            messageText.textContent = `🎉 Player ${currentPlayer} wins! 🎉`;
            messageText.style.animation = 'bounce 0.5s ease';
            gameActive = false;
            createConfetti();
            return;
        }

        if (checkDraw()) {
            messageText.textContent = "🤝 It's a draw! 🤝";
            messageText.style.animation = 'shake 0.5s ease';
            gameActive = false;
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        messageText.textContent = `Player ${currentPlayer}'s turn`;
    }

    // Function to check for a win
    function checkWin() {
        return winCombinations.some(combination => {
            const isWon = combination.every(index => {
                return gameBoard[index] === currentPlayer;
            });

            // Highlight winning combination
            if (isWon) {
                combination.forEach(index => {
                    cells[index].classList.add('winning-cell');
                });
            }

            return isWon;
        });
    }

    // Function to check for a draw
    function checkDraw() {
        return gameBoard.every(cell => cell !== '');
    }

    // Function to reset the game board
    function resetBoard() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        messageText.textContent = `Player ${currentPlayer}'s turn`;
        messageText.style.animation = '';

        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
    }

    // Function to start a new game
    function newGame() {
        resetBoard();
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0.5; }
            70% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(0.9); }
            75% { transform: scale(1.05); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        .winning-cell {
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
        }
    `;
    document.head.appendChild(style);

    // Add event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetBoard);
    restartButton.addEventListener('click', newGame);

    // Initialize game
    messageText.textContent = `Player ${currentPlayer}'s turn`;
});