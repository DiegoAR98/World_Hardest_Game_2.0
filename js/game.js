class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentLevel = 1;
        this.maxLevel = 2;
        this.deaths = 0;
        this.player = null;
        this.level = null;
        this.gameState = 'playing';
        this.isRunning = false;

        this.setupUI();
        this.initializeLevel(this.currentLevel);
    }

    setupUI() {
        const nextLevelBtn = document.getElementById('nextLevelBtn');
        const restartBtn = document.getElementById('restartBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');

        nextLevelBtn.addEventListener('click', () => {
            this.nextLevel();
        });

        restartBtn.addEventListener('click', () => {
            this.restartLevel();
        });

        playAgainBtn.addEventListener('click', () => {
            this.resetGame();
        });
    }

    initializeLevel(levelNumber) {
        const levelData = LevelManager.getLevelData(levelNumber);
        if (!levelData) {
            console.error(`Level ${levelNumber} not found!`);
            return;
        }

        this.level = new Level(levelData);
        this.player = new Player(levelData.playerStartX, levelData.playerStartY);
        this.gameState = 'playing';
        this.updateUI();
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.player.update(this.level.levelBounds, this.level.walls);
        this.level.update();

        if (this.level.checkPlayerObstacleCollision(this.player)) {
            this.playerDied();
            return;
        }

        if (this.level.checkPlayerCoinCollision(this.player)) {
            this.updateUI();
        }

        if (this.level.checkPlayerGoalCollision(this.player)) {
            if (this.level.getAllCoinsCollected()) {
                this.levelCompleted();
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.level.render(this.ctx);
        this.player.render(this.ctx);
    }

    playerDied() {
        this.deaths++;
        this.player.reset(this.level.playerStartX, this.level.playerStartY);
        this.level.resetCoins();
        this.updateUI();
    }

    levelCompleted() {
        this.gameState = 'levelComplete';

        if (this.currentLevel >= this.maxLevel) {
            this.showGameCompleteScreen();
        } else {
            this.showLevelCompleteScreen();
        }
    }

    nextLevel() {
        this.currentLevel++;
        this.hideLevelCompleteScreen();
        this.initializeLevel(this.currentLevel);
    }

    restartLevel() {
        this.hideLevelCompleteScreen();
        this.initializeLevel(this.currentLevel);
    }

    resetGame() {
        this.currentLevel = 1;
        this.deaths = 0;
        this.hideGameCompleteScreen();
        this.initializeLevel(this.currentLevel);
    }

    updateUI() {
        document.getElementById('levelNumber').textContent = this.currentLevel;
        document.getElementById('deathCount').textContent = this.deaths;
        document.getElementById('coinCount').textContent = this.level ? this.level.getCollectedCoinsCount() : 0;
        document.getElementById('totalCoins').textContent = this.level ? this.level.getTotalCoinsCount() : 0;
    }

    showLevelCompleteScreen() {
        document.getElementById('finalDeaths').textContent = this.deaths;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }

    hideLevelCompleteScreen() {
        document.getElementById('gameOverScreen').classList.add('hidden');
    }

    showGameCompleteScreen() {
        document.getElementById('totalDeaths').textContent = this.deaths;
        document.getElementById('gameCompleteScreen').classList.remove('hidden');
    }

    hideGameCompleteScreen() {
        document.getElementById('gameCompleteScreen').classList.add('hidden');
    }

    gameLoop() {
        this.update();
        this.render();

        if (this.isRunning) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.gameLoop();
        }
    }

    stop() {
        this.isRunning = false;
    }

    pause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
}