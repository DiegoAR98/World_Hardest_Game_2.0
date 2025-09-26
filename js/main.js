let game;

document.addEventListener('DOMContentLoaded', () => {
    console.log('The World\'s Hardest Game 2.0 - Loading...');

    try {
        game = new Game();
        console.log('Game initialized successfully!');

        game.start();
        console.log('Game started!');

        console.log('Controls:');
        console.log('- Use WASD or Arrow Keys to move');
        console.log('- Collect all yellow coins');
        console.log('- Reach the green goal zone');
        console.log('- Avoid the blue moving obstacles!');

    } catch (error) {
        console.error('Failed to initialize game:', error);
        displayError('Failed to load the game. Please refresh and try again.');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && game) {
        game.pause();
    }

    if (e.key === 'r' && game && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        game.restartLevel();
    }
});

window.addEventListener('beforeunload', () => {
    if (game) {
        game.stop();
    }
});

window.addEventListener('blur', () => {
    if (game && game.gameState === 'playing') {
        game.pause();
    }
});

window.addEventListener('focus', () => {
    if (game && game.gameState === 'paused') {
        setTimeout(() => {
            if (game && game.gameState === 'paused') {
                game.pause();
            }
        }, 100);
    }
});

function displayError(message) {
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 24px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('ERROR', canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillStyle = '#2c3e50';
        ctx.font = '16px Courier New';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2 + 20);
    }

    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #e74c3c;
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
        text-align: center;
        z-index: 9999;
    `;
    errorDiv.innerHTML = `<h3>Game Error</h3><p>${message}</p>`;
    document.body.appendChild(errorDiv);
}