class Obstacle {
    constructor(x, y, radius, speedX, speedY, minX, maxX, minY, maxY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.color = '#3498db';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x <= this.minX || this.x >= this.maxX) {
            this.speedX = -this.speedX;
        }
        if (this.y <= this.minY || this.y >= this.maxY) {
            this.speedY = -this.speedY;
        }

        this.x = Math.max(this.minX, Math.min(this.maxX, this.x));
        this.y = Math.max(this.minY, Math.min(this.maxY, this.y));
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius
        };
    }
}

class Coin {
    constructor(x, y, radius = 8) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.collected = false;
        this.color = '#f1c40f';
        this.pulsePhase = 0;
    }

    update() {
        this.pulsePhase += 0.1;
    }

    render(ctx) {
        if (this.collected) return;

        const pulseFactor = 1 + Math.sin(this.pulsePhase) * 0.2;
        const currentRadius = this.radius * pulseFactor;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius
        };
    }
}

class Level {
    constructor(levelData) {
        this.playerStartX = levelData.playerStartX;
        this.playerStartY = levelData.playerStartY;
        this.goalZone = levelData.goalZone;
        this.walls = levelData.walls || [];
        this.obstacles = [];
        this.coins = [];
        this.levelBounds = levelData.levelBounds;
        this.backgroundColor = '#ecf0f1';

        this.initializeObstacles(levelData.obstacles || []);
        this.initializeCoins(levelData.coins || []);
    }

    initializeObstacles(obstacleData) {
        this.obstacles = obstacleData.map(data =>
            new Obstacle(data.x, data.y, data.radius, data.speedX, data.speedY,
                        data.minX, data.maxX, data.minY, data.maxY)
        );
    }

    initializeCoins(coinData) {
        this.coins = coinData.map(data => new Coin(data.x, data.y, data.radius));
    }

    update() {
        this.obstacles.forEach(obstacle => obstacle.update());
        this.coins.forEach(coin => coin.update());
    }

    render(ctx) {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.renderWalls(ctx);
        this.renderGoalZone(ctx);
        this.coins.forEach(coin => coin.render(ctx));
        this.obstacles.forEach(obstacle => obstacle.render(ctx));
    }

    renderWalls(ctx) {
        ctx.fillStyle = '#2c3e50';
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 2;

        this.walls.forEach(wall => {
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
        });
    }

    renderGoalZone(ctx) {
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.goalZone.x, this.goalZone.y, this.goalZone.width, this.goalZone.height);

        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.goalZone.x, this.goalZone.y, this.goalZone.width, this.goalZone.height);

        ctx.fillStyle = '#27ae60';
        ctx.font = 'bold 16px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('GOAL',
                    this.goalZone.x + this.goalZone.width / 2,
                    this.goalZone.y + this.goalZone.height / 2 + 5);
    }

    checkPlayerObstacleCollision(player) {
        const playerBounds = player.getBounds();

        for (let obstacle of this.obstacles) {
            if (CollisionDetector.circleRectangleCollision(obstacle.getBounds(), playerBounds)) {
                return true;
            }
        }
        return false;
    }

    checkPlayerCoinCollision(player) {
        const playerCenter = player.getCenter();

        for (let coin of this.coins) {
            if (!coin.collected) {
                const distance = CollisionDetector.getDistance(playerCenter, { x: coin.x, y: coin.y });
                if (distance < coin.radius + 10) {
                    coin.collected = true;
                    return true;
                }
            }
        }
        return false;
    }

    checkPlayerGoalCollision(player) {
        return CollisionDetector.rectangleCollision(player.getBounds(), this.goalZone);
    }

    getAllCoinsCollected() {
        return this.coins.every(coin => coin.collected);
    }

    getCollectedCoinsCount() {
        return this.coins.filter(coin => coin.collected).length;
    }

    getTotalCoinsCount() {
        return this.coins.length;
    }

    resetCoins() {
        this.coins.forEach(coin => coin.collected = false);
    }
}

class LevelManager {
    static getLevelData(levelNumber) {
        switch(levelNumber) {
            case 1:
                return LevelManager.getLevel1Data();
            case 2:
                return LevelManager.getLevel2Data();
            default:
                return null;
        }
    }

    static getLevel1Data() {
        return {
            playerStartX: 50,
            playerStartY: 520,
            levelBounds: { x: 20, y: 20, width: 760, height: 560 },
            goalZone: { x: 680, y: 500, width: 80, height: 60 },
            walls: [
                { x: 0, y: 0, width: 800, height: 20 },
                { x: 0, y: 580, width: 800, height: 20 },
                { x: 0, y: 0, width: 20, height: 600 },
                { x: 780, y: 0, width: 20, height: 600 },

                { x: 200, y: 100, width: 20, height: 200 },
                { x: 400, y: 300, width: 20, height: 200 },
            ],
            obstacles: [
                { x: 300, y: 200, radius: 15, speedX: 2, speedY: 0, minX: 240, maxX: 360, minY: 200, maxY: 200 },
                { x: 500, y: 150, radius: 15, speedX: 0, speedY: 1.5, minX: 500, maxX: 500, minY: 120, maxY: 250 },
                { x: 600, y: 350, radius: 15, speedX: -1.5, speedY: 1, minX: 560, maxX: 700, minY: 320, maxY: 420 },
            ],
            coins: [
                { x: 150, y: 300, radius: 8 },
                { x: 350, y: 450, radius: 8 },
                { x: 550, y: 100, radius: 8 },
            ]
        };
    }

    static getLevel2Data() {
        return {
            playerStartX: 50,
            playerStartY: 300,
            levelBounds: { x: 20, y: 20, width: 760, height: 560 },
            goalZone: { x: 680, y: 280, width: 80, height: 40 },
            walls: [
                { x: 0, y: 0, width: 800, height: 20 },
                { x: 0, y: 580, width: 800, height: 20 },
                { x: 0, y: 0, width: 20, height: 600 },
                { x: 780, y: 0, width: 20, height: 600 },

                { x: 150, y: 120, width: 20, height: 120 },
                { x: 250, y: 360, width: 20, height: 120 },
                { x: 400, y: 80, width: 20, height: 160 },
                { x: 400, y: 360, width: 20, height: 160 },
                { x: 550, y: 200, width: 20, height: 200 },
            ],
            obstacles: [
                { x: 200, y: 180, radius: 12, speedX: 1.5, speedY: 0, minX: 180, maxX: 320, minY: 180, maxY: 180 },
                { x: 320, y: 420, radius: 12, speedX: -1.5, speedY: 0, minX: 280, maxX: 380, minY: 420, maxY: 420 },
                { x: 450, y: 300, radius: 12, speedX: 0, speedY: -2, minX: 450, maxX: 450, minY: 260, maxY: 340 },
                { x: 500, y: 150, radius: 12, speedX: 1, speedY: 1, minX: 440, maxX: 520, minY: 120, maxY: 180 },
                { x: 600, y: 350, radius: 12, speedX: -1, speedY: -1.5, minX: 580, maxX: 650, minY: 320, maxY: 380 },
                { x: 300, y: 250, radius: 10, speedX: 0.8, speedY: 1.2, minX: 270, maxX: 370, minY: 220, maxY: 320 },
            ],
            coins: [
                { x: 120, y: 200, radius: 8 },
                { x: 220, y: 500, radius: 8 },
                { x: 350, y: 50, radius: 8 },
                { x: 480, y: 480, radius: 8 },
                { x: 620, y: 120, radius: 8 },
            ]
        };
    }
}