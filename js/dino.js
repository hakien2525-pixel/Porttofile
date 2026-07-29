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
            y: this.height - 30, // Floor is 30px tall
            width: 24,
            height: 24,
            dy: 0,
            jumpForce: -5,
            gravity: 0.25,
            grounded: true
        };

        // Obstacles
        this.obstacles = [];
        this.obstacleSpeed = 2; // Slower initial speed
        this.spawnTimer = 0;
        
        this.bindEvents();
        this.drawInitialState(); // Draw immediately
    }

    updateScoreDisplay() {
        if(this.scoreEl) this.scoreEl.innerText = Math.floor(this.score).toString().padStart(5, '0');
        if(this.bestScoreEl) this.bestScoreEl.innerText = "HI " + Math.floor(this.bestScore).toString().padStart(5, '0');
    }

    bindEvents() {
        // Jump on Space or Up arrow
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                this.handleJump();
            }
        });
        
        // Jump on Click/Tap
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
        this.dino.y = this.height - 30;
        this.dino.dy = 0;
        this.obstacleSpeed = 2; // Reset speed
        
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
            overlay.innerHTML = '<span style="background: rgba(255,255,255,0.7); padding: 4px; border-radius: 4px;">GAME OVER<br>SPACE / TAP TO RESTART</span>';
        }
    }

    spawnObstacle() {
        this.obstacles.push({
            x: this.width,
            y: this.height - 24 - 5, // ground offset
            width: 16,
            height: 24
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
        if (this.dino.y >= this.height - this.dino.height - 5) {
            this.dino.y = this.height - this.dino.height - 5;
            this.dino.dy = 0;
            this.dino.grounded = true;
        }

        // Setup font for emojis
        this.ctx.font = '24px sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        // Draw Dino Emoji
        this.ctx.fillText('🦖', this.dino.x, this.dino.y);

        // Update and draw obstacles
        for (let i = 0; i < this.obstacles.length; i++) {
            let obs = this.obstacles[i];
            obs.x -= this.obstacleSpeed;
            
            // Draw Cactus Emoji
            this.ctx.fillText('🌵', obs.x, obs.y);

            // Collision Detection
            const hitboxMargin = 4;
            if (
                this.dino.x + hitboxMargin < obs.x + obs.width - hitboxMargin &&
                this.dino.x + this.dino.width - hitboxMargin > obs.x + hitboxMargin &&
                this.dino.y + hitboxMargin < obs.y + obs.height - hitboxMargin &&
                this.dino.y + this.dino.height - hitboxMargin > obs.y + hitboxMargin
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
            this.spawnTimer = 100 + Math.random() * 100; // Slower spawn rate
            this.obstacleSpeed += 0.002; // Very slow speed increase
        }

        // Update Score
        this.score += 0.05; // Slower score increment
        this.updateScoreDisplay();

        // Draw Ground Line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height - 5);
        this.ctx.lineTo(this.width, this.height - 5);
        this.ctx.strokeStyle = '#a0a0a0';
        this.ctx.stroke();

        requestAnimationFrame(() => this.update());
    }

    drawInitialState() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Setup font for emojis
        this.ctx.font = '24px sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        // Draw Dino Emoji
        this.ctx.fillText('🦖', 20, this.height - 30);
        
        // Draw Ground Line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height - 5);
        this.ctx.lineTo(this.width, this.height - 5);
        this.ctx.strokeStyle = '#a0a0a0';
        this.ctx.stroke();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DinoGame('dino-canvas-el');
});
