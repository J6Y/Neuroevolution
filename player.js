class Player {
    constructor(x, y, s, c) {
        this.x = x;
        this.y = y;
        this.size = s;
        this.height = s;
        this.colour = c;

        this.speed = 0;
        this.jumpForce = 15;
        this.jumpTimer = 0;
        this.grounded = false;

        this.score = 0;
        this.isDead = false;

        this.brain = new NeuralNetwork(6, 10, 2);
    }

    dispose() {
        this.brain.dispose();
    }

    jump() {
        if (this.grounded && this.jumpTimer == 0) {
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
            this.jumpTimer++;
            this.speed = -this.jumpForce - this.jumpTimer / 50;
        }
    }

    crouch() {
        this.height = this.size / 2;
    }

    think(obstacle) {
        //#region
        let inputs = [
            this.y / canvas.height,
            this.speed / 10,
            obstacle.y / canvas.height,
            obstacle.height / canvas.height,
            obstacle.width / canvas.width,
            obstacle.speed / 10,
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
            this.height = this.size;
        }
    }

    update() {
        this.y += this.speed;

        //Gravity
        if (this.y + this.height < canvas.height) {
            this.speed += gravity;
            this.grounded = false;
        } else {
            this.speed = 0;
            this.grounded = true;
            this.y = canvas.height - this.height;
        }

        this.display();
    }

    display() {
        ctx.beginPath();
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x, this.y, this.size, this.height);
        ctx.closePath();
    }
}
