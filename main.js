//Restructure of old project with Neuroevolution implemented

// Vairables 
//#region 
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    // game objects
    let obstacles = [];
    let players = [];
    let scoreText;
    let highscoreText;
    let genText;
    let closestObstacle;

    // nn variables
    let playerCount = 100;
    let aliveCount = 0;
    let genNumber = 0;

    // game variables
    let spawnTimer;
    let initialSpawnTimer = 200;
    let highscore = 0;
    let gravity = 1;
    let gameSpeed = 3;

    // spawn variables
    let playerS = 50;
    let playerY = 0;
    let playerX = 25;

    // other
    let keys = {};
    let fps = 60;
//#endregion

class Text {
    constructor (t, x, y, a, c, s) {
        this.t = t;
        this.x = x;
        this.y = y;
        this.a = a;
        this.c = c;
        this.s = s;
    }

    display() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.font = this.s + "px sans-serif";
        ctx.textAlign = this.a;
        ctx.fillText(this.t, this.x, this.y);
        ctx.closePath();
    }
}

// Game Functions
//#region
    function spawnObstacle() {
        let size = RandomIntInRange(20, 70);
        let type = RandomIntInRange(0, 1);
        let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4');
      
        if (type == 1) {
          obstacle.y -= playerS - 10;
        }
        obstacles.push(obstacle);
    }

    function reset() {
        spawnTimer = 150;
        gameSpeed = 3;
        obstacles = [];
    }

    function set() {
        reset();

        //load previous highscore
        if (localStorage.getItem('highscore')) {
            highscore = localStorage.getItem('highscore');
        }

        //add score text
        //scoreText = new Text("Score: " + score, 25, 25, "left", "#212121", "20");
        //highscoreText = new Text("Highscore: " + highscore, canvas.width - 25, 25, "right", "#212121", "20");

    }

    function checkCollision(obstacle, player) {
        if (player.x < obstacle.x + obstacle.width && 
            player.y < obstacle.y + obstacle.height &&
            obstacle.x < player.x + player.size && 
            obstacle.y < player.y + player.height ) 
        {
            return true;
        } else {
            return false;
        }
    }
//#endregion

// NN Implementation Functions
//#region
    function initPlayers() {
        for (let i = 0; i < playerCount; i++) {
            players[i] = new Player(playerX, playerY, playerS, '#FF5858'); 
            aliveCount += 1;
        }
    }

    function newGen() {
        
        genNumber++;
        
        initPlayers();
    }
//#endregion

function Start() {
    canvas.width = 1400;
    canvas.height = 400;
    ctx.font = "20px sans-serif";

    tf.setBackend('cpu');

    //fps setup
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;

    //game setup

    genText = new Text("Generation " + genNumber, 25, 25, "left", "#212121", "20");

    set();
    newGen();
    
    requestAnimationFrame(Update);
}

function Update() {
    requestAnimationFrame(Update);

    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {

        then = now - (elapsed % fpsInterval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //spawn enemies
        spawnTimer--;
        if (spawnTimer <= 0) {
            spawnObstacle();
            spawnTimer = initialSpawnTimer - gameSpeed * 8;
            
            if (spawnTimer < 60) {
                spawnTimer = 60;
            }
        }

        if (obstacles.length != 0) {
            if (obstacles[0].x + obstacles[0].width < 0) {
                obstacles.splice(0, 1);
            }

            if (obstacles[0].x > playerX - playerS) {
                closestObstacle = obstacles[0];
            } else {
                closestObstacle = obstacles[1];
            }
        }

        if (aliveCount <= 0) {
            newGen();
        }

        for (let i = 0; i < players.length; i++) {
            let p = players[i];

            if (p.isDead == false) {

                if (obstacles.length != 0) {
                    if (checkCollision(closestObstacle, p)) {
                        p.isDead = true;
                        aliveCount-=1;
                        console.log(aliveCount);
                    }
                }

                if (obstacles.length != 0) {
                    p.think(closestObstacle);
                }
                p.update();
            }
        }

        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].update();
        }

        /*
        score++;
        scoreText.t = "Score: " + score;
        scoreText.display();

        if (score > highscore) {
            highscore = score;
            highscoreText.t = "Highscore: " + highscore;
        }
        
        highscoreText.display();
        */

        genText.t = "Generation " + genNumber;
        genText.display();

        gameSpeed += 0.0005;
    }
}

Start();