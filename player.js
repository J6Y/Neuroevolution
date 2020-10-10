class Player {
    constructor(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;

        this.score;

        this.dy = 0;
        this.jumpForce = 15;
        this.originalHeight = h;
        this.grounded = false;
        this.jumpTimer = 0;

        this.brain = new NeuralNetwork(6, 10, 2);
    }

    jump() {
        if (this.grounded && this.jumpTimer == 0) {
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
            this.jumpTimer++;
            this.dy = -this.jumpForce - (this.jumpTimer / 50);
        }
    }

    crouch() {
        this.h = this.originalHeight / 2;
    }

    think(obstacle) {
        //#region
            let inputs = [
                this.y / canvas.height,
                this.dy / 10,
                obstacle.w / canvas.width,
                obstacle.x / canvas.width,
                obstacle.y / canvas.height,
                obstacle.dx / 10           
            ];
        //#endregion 
        let output = this.brain.predict(inputs);
        
        if (output[0] > 0.5) {
            this.jump();
        } else {
            this.jumpTimer = 0;
        }

        if (output[1] > 0.5) {
            this.crouch();
        } else {
            this.h = this.originalHeight;
        }
    }

    update() { 
        
        /*
        if (keys['Space'] || keys['KeyW']) {
            this.jump();
        } else {
            this.jumpTimer = 0;
        }

        if (keys['ShiftLeft'] || keys['KeyS']) {
            this.crouch();
        } else {
            this.h = this.originalHeight;
        }
        */
        
        this.y += this.dy;

        //Gravity
        if (this.y + this.h < canvas.height) {
            this.dy += gravity;
            this.grounded = false;
        } else {
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.h;
        }

        this.display();
    }

    display() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }
}