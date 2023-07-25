// Create a canvas element
var canvas = document.createElement("canvas");
  
// Set the canvas to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.margin = "0";
canvas.style.padding = "0";

// Append the canvas to the body of the page
document.body.appendChild(canvas);

// Get the 2d drawing context of the canvas
var ctx = canvas.getContext("2d");

var groundLevel = canvas.height - 50;  // adjust this value based on your game design


var GameEngine = {
    // All game entities
    entities: [],
    score: 0,
    lastScoreTime: 0,
    asteroidSpawnInterval: null,
    minY: 100, // These are just example values,
    maxY: 400, // you'll want to adjust them based on your game's needs.
  
    // Game states
    states: {
        start: 0,
        running: 1,
        gameOver: 2
    },
    
    // Current game state
    currentState: null,
    
    init: function() {
        // Initialize game, set state to start
        this.currentState = this.states.start;
    
        // Start spawning asteroids every 2 seconds
        this.asteroidSpawnInterval = setInterval(() => this.spawnAsteroid(), 2000);
    },
  
    spawnAsteroid: function() {
        // Random Y position within some range
        var y = Math.random() * (this.maxY - this.minY) + this.minY;

        // Create new asteroid and add it to entities
        var asteroid = new Asteroid(500, y, 2);
        this.entities.push(asteroid);
    }, 
  
    update: function() {
        // Update all game entities
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].update();
        }
        // Increment score every second
        if (Date.now() - this.lastScoreTime > 1000) {
            this.score++;
            this.lastScoreTime = Date.now();
        }

        // Check for collisions with all asteroids
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i] instanceof Asteroid && astronaut.collidesWith(this.entities[i])) {
                this.gameOver();
                break;
            }
        }
      
    },
  
    
    gameOver: function() {
        // Switch game state to game over
        this.currentState = this.states.gameOver;
        // Don't forget to clear the interval when the game is over
        clearInterval(this.asteroidSpawnInterval);
    },
    
    render: function(ctx) {
        // Clear the canvas before re-drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Render all game entities
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].render(ctx);
        }
    
        // Display score
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + this.score, 10, 30);
    },

    
    run: function() {
        // Stop the game loop if game over
        if (this.currentState !== this.states.gameOver) {
            this.update();
            this.render(ctx);
            requestAnimationFrame(this.run.bind(this));
        } else {
            // Display game over message
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        }
    }

};

var Astronaut = function(x, y) {
    this.x = x;
    this.y = y;
    this.velocityY = 0;
    this.onGround = true;
    this.radius = 20;
  
    this.update = function() {
        // If not on the ground, apply gravity
        if (!this.onGround) {
            this.velocityY += 0.5; // Gravity
            this.y += this.velocityY;
        }

        // If the astronaut is below the ground, set it back
        if (this.y > groundLevel) {
            this.y = groundLevel;
            this.onGround = true;
            this.velocityY = 0;
        }
    };

    this.jump = function() {
        if (this.onGround) {
            this.velocityY = -10; // Jump speed
            this.onGround = false;
        }
    };

    this.render = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
    };

    this.collidesWith = function(other) {
      var dx = this.x - other.x;
      var dy = this.y - other.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      return distance < this.radius + other.radius;
    };
 
};

// Instantiate the astronaut and add to the game entities
var astronaut = new Astronaut(100, groundLevel);
GameEngine.entities.push(astronaut);


var Asteroid = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;

    this.update = function() {
        this.x -= this.speed;

        // If asteroid is off screen, remove it
        if (this.x < 0) {
            var index = GameEngine.entities.indexOf(this);
            if (index !== -1) {
                GameEngine.entities.splice(index, 1);
            }
        }
    };
      
    this.render = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'gray';
        ctx.fill();
    };
};

// Create initial asteroid
var asteroid = new Asteroid(500, groundLevel, 2);
GameEngine.entities.push(asteroid);



// Assuming you have a reference to your canvas element
canvas.addEventListener('touchstart', function(e) {
    astronaut.jump();
});



// Initialize and run game
GameEngine.init();
GameEngine.run();


