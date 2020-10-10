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

    // game variables
    let spawnTimer;
    let initialSpawnTimer = 200;
    let highscore = 0;
    let gravity = 1;
    let gameSpeed = 3;
    let score = 0;

    // other
    let keys = {};
    let fps = 60;
//#endregion

// Event Listeners
//#region 
    document.addEventListener('keydown', function (evt) {
        keys[evt.code] = true;
    });
    document.addEventListener('keyup', function (evt) {
        keys[evt.code] = false;
    });
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
          obstacle.y -= player.originalHeight - 10;
        }
        obstacles.push(obstacle);
    }

    function reset() {
        spawnTimer = 150;
        gameSpeed = 3;
        obstacles = [];
        score = 0;
    }

    function set() {
        reset();

        //load previous highscore
        if (localStorage.getItem('highscore')) {
            highscore = localStorage.getItem('highscore');
        }

        //add score text
        scoreText = new Text("Score: " + score, 25, 25, "left", "#212121", "20");
        highscoreText = new Text("Highscore: " + highscore, canvas.width - 25, 25, "right", "#212121", "20");

        player = new Player(25, 0, 50, 50, '#FF5858');
    }

    function playerCollision(obstacle, player) {
        if (player.x < obstacle.x + obstacle.w && player.x + player.w > obstacle.x &&
            player.y < obstacle.y + obstacle.h && player.y + player.h > obstacle.y) 
        {
            return true;
        } else {
            return false;
        }
    }

    function closestObstacle(player) {
        let closest = obstacles[0];

        for (let i = 1; i < obstacles.length; i++) {
            if (obstacles[i] < closest && obstacles[i] > player.x - player.w) {
                closest = obstacles[i];
                console.log(closest);
            }
        }
        return(closest);
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
    set();
    
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
            console.log(obstacles);
            spawnTimer = initialSpawnTimer - gameSpeed * 8;
            
            if (spawnTimer < 60) {
                spawnTimer = 60;
            }
        }

        if (obstacles.length != 0) {
            player.think(closestObstacle(player));
        }

        for (let i = 0; i < obstacles.length; i++) {
            let o = obstacles[i];

            if (o.x + o.w < 0) {
                obstacles.splice(i, 1);
            }
            if (playerCollision(o, player)) {
                reset();
            }
            o.update();
        }

        player.update();

        score++;
        scoreText.t = "Score: " + score;
        scoreText.display();

        if (score > highscore) {
            highscore = score;
            highscoreText.t = "Highscore: " + highscore;
        }
        
        highscoreText.display();

        gameSpeed += 0.0005;
    }
}

Start();