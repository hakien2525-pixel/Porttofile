class DinoGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.isPlaying = false;
        this.isGameOver = false;
        this.score = 0;
        this.bestScore = localStorage.getItem('dinoBestScore') || 0;
        
        // Update DOM scores
        this.scoreEl = document.getElementById('dino-score');
        this.bestScoreEl = document.getElementById('dino-best-score');
        this.updateScoreDisplay();

        // Dino properties
        this.dino = {
            x: 20,
            y: this.height - 24, // Floor is 24px tall
            width: 20,
            height: 24,
            dy: 0,
            jumpForce: -8,
            gravity: 0.5,
            grounded: true
        };

        // Obstacles
        this.obstacles = [];
        this.obstacleSpeed = 4;
        this.spawnTimer = 0;
        
        this.bindEvents();
        this.drawInitialState();
    }

    updateScoreDisplay() {
        if(this.scoreEl) this.scoreEl.innerText = Math.floor(this.score).toString().padStart(5, '0');
        if(this.bestScoreEl) this.bestScoreEl.innerText = "HI " + Math.floor(this.bestScore).toString().padStart(5, '0');
    }

    bindEvents() {
        // Jump on Space or Up arrow
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault(); // Prevent scrolling
                this.handleJump();
            }
        });
        
        // Jump on Click/Tap on the canvas
        this.canvas.addEventListener('mousedown', () => this.handleJump());
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleJump();
        }, {passive: false});
    }

    handleJump() {
        if (this.isGameOver) {
            this.reset();
            return;
        }
        if (!this.isPlaying) {
            this.start();
            return;
        }
        if (this.dino.grounded) {
            this.dino.dy = this.dino.jumpForce;
            this.dino.grounded = false;
        }
    }

    start() {
        this.isPlaying = true;
        this.isGameOver = false;
        this.score = 0;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.dino.y = this.height - 24;
        this.dino.dy = 0;
        this.obstacleSpeed = 4;
        
        // Hide overlay text
        const overlay = document.getElementById('dino-overlay');
        if(overlay) overlay.style.display = 'none';

        requestAnimationFrame(() => this.update());
    }

    reset() {
        this.isPlaying = false;
        this.isGameOver = false;
        this.drawInitialState();
        const overlay = document.getElementById('dino-overlay');
        if(overlay) overlay.style.display = 'flex';
    }

    gameOver() {
        this.isPlaying = false;
        this.isGameOver = true;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('dinoBestScore', this.bestScore);
        }
        this.updateScoreDisplay();
        
        // Show overlay text
        const overlay = document.getElementById('dino-overlay');
        if(overlay) {
            overlay.style.display = 'flex';
            overlay.innerHTML = 'GAME OVER<br>SPACE / TAP TO RESTART';
        }
    }

    spawnObstacle() {
        // Random width between 10 and 20, random height between 15 and 25
        const type = Math.random() > 0.5 ? 1 : 2; 
        const width = 12 * type;
        const height = 20 + Math.random() * 10;
        
        this.obstacles.push({
            x: this.width,
            y: this.height - height,
            width: width,
            height: height
        });
    }

    update() {
        if (!this.isPlaying) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update Dino
        this.dino.dy += this.dino.gravity;
        this.dino.y += this.dino.dy;

        // Ground collision
        if (this.dino.y >= this.height - this.dino.height) {
            this.dino.y = this.height - this.dino.height;
            this.dino.dy = 0;
            this.dino.grounded = true;
        }

        // Draw Dino
        this.ctx.fillStyle = '#535353';
        this.ctx.fillRect(this.dino.x, this.dino.y, this.dino.width, this.dino.height);
        
        // Draw eye
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.dino.x + 12, this.dino.y + 4, 2, 2);

        // Update and draw obstacles
        for (let i = 0; i < this.obstacles.length; i++) {
            let obs = this.obstacles[i];
            obs.x -= this.obstacleSpeed;
            
            // Draw Cactus
            this.ctx.fillStyle = '#535353';
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

            // Collision Detection
            if (
                this.dino.x < obs.x + obs.width &&
                this.dino.x + this.dino.width > obs.x &&
                this.dino.y < obs.y + obs.height &&
                this.dino.y + this.dino.height > obs.y
            ) {
                this.gameOver();
                return;
            }
        }

        // Remove off-screen obstacles
        this.obstacles = this.obstacles.filter(obs => obs.x + obs.width > 0);

        // Spawn new obstacles
        this.spawnTimer--;
        if (this.spawnTimer <= 0) {
            this.spawnObstacle();
            this.spawnTimer = 60 + Math.random() * 60; // Random spawn rate
            this.obstacleSpeed += 0.05; // Slightly increase speed over time
        }

        // Update Score
        this.score += 0.1;
        this.updateScoreDisplay();

        // Draw Ground Line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);
        this.ctx.lineTo(this.width, this.height);
        this.ctx.strokeStyle = '#535353';
        this.ctx.stroke();

        requestAnimationFrame(() => this.update());
    }

    drawInitialState() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw Dino
        this.ctx.fillStyle = '#535353';
        this.ctx.fillRect(20, this.height - 24, 20, 24);
        
        // Draw eye
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(20 + 12, this.height - 24 + 4, 2, 2);
        
        // Draw Ground Line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);
        this.ctx.lineTo(this.width, this.height);
        this.ctx.strokeStyle = '#535353';
        this.ctx.stroke();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DinoGame('dino-canvas-el');
});
