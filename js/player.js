class Player {
    constructor(x, y, size = 20) {
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.speed = 3;
        this.color = '#e74c3c';

        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            up: false,
            left: false,
            down: false,
            right: false
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
    }

    handleKeyDown(e) {
        switch(e.key.toLowerCase()) {
            case 'w':
                this.keys.w = true;
                break;
            case 'a':
                this.keys.a = true;
                break;
            case 's':
                this.keys.s = true;
                break;
            case 'd':
                this.keys.d = true;
                break;
            case 'arrowup':
                this.keys.up = true;
                break;
            case 'arrowleft':
                this.keys.left = true;
                break;
            case 'arrowdown':
                this.keys.down = true;
                break;
            case 'arrowright':
                this.keys.right = true;
                break;
        }
        e.preventDefault();
    }

    handleKeyUp(e) {
        switch(e.key.toLowerCase()) {
            case 'w':
                this.keys.w = false;
                break;
            case 'a':
                this.keys.a = false;
                break;
            case 's':
                this.keys.s = false;
                break;
            case 'd':
                this.keys.d = false;
                break;
            case 'arrowup':
                this.keys.up = false;
                break;
            case 'arrowleft':
                this.keys.left = false;
                break;
            case 'arrowdown':
                this.keys.down = false;
                break;
            case 'arrowright':
                this.keys.right = false;
                break;
        }
        e.preventDefault();
    }

    update(levelBounds, walls) {
        let newX = this.x;
        let newY = this.y;

        if (this.keys.w || this.keys.up) {
            newY -= this.speed;
        }
        if (this.keys.s || this.keys.down) {
            newY += this.speed;
        }
        if (this.keys.a || this.keys.left) {
            newX -= this.speed;
        }
        if (this.keys.d || this.keys.right) {
            newX += this.speed;
        }

        const testPosition = { x: newX, y: newY, width: this.width, height: this.height };

        if (CollisionDetector.isInBounds(testPosition, levelBounds)) {
            if (!CollisionDetector.checkWallCollision(testPosition, walls)) {
                this.x = newX;
                this.y = newY;
            }
        }
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }
}