// Shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Ball class extending Shape
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true; // Track if the ball exists
  }

  draw() {
    if (this.exists) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  update() {
    if (this.exists) {
      if (this.x + this.size >= width || this.x - this.size <= 0) {
        this.velX = -this.velX;
      }
      if (this.y + this.size >= height || this.y - this.size <= 0) {
        this.velY = -this.velY;
      }
      this.x += this.velX;
      this.y += this.velY;
    }
  }

  collisionDetect() {
    if (this.exists) {
      for (const ball of balls) {
        if (ball.exists && this !== ball) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < this.size + ball.size) {
            ball.color = this.color = randomRGB(); // Change color on collision
          }
        }
      }
    }
  }
}

// EvilCircle class extending Shape
class EvilCircle extends Shape {
  constructor(x, y, isAutoControlled = false) {
    super(x, y, 5, 5); // Default speed for player-controlled evil ball
    this.color = 'white';
    this.size = 10;
    this.isAutoControlled = isAutoControlled;

    if (!this.isAutoControlled) {
      window.addEventListener('keydown', (e) => this.move(e));
    }
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3; // Thicker outline
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size > width) this.x = width - this.size;
    if (this.x - this.size < 0) this.x = this.size;
    if (this.y + this.size > height) this.y = height - this.size;
    if (this.y - this.size < 0) this.y = this.size;
  }

  move(e) {
    const speed = 10; // Adjust this value for player-controlled speed
    if (this.isAutoControlled) {
      // Random movement for auto-controlled evil balls
      const directions = [
        { x: -this.velX, y: 0 }, // left
        { x: this.velX, y: 0 },  // right
        { x: 0, y: -this.velY }, // up
        { x: 0, y: this.velY },  // down
      ];
      const randomDir = directions[Math.floor(Math.random() * directions.length)];
      this.x += randomDir.x;
      this.y += randomDir.y;
    } else {
      switch (e.key) {
        case 'a': this.x -= speed; break; // Move left
        case 'd': this.x += speed; break; // Move right
        case 'w': this.y -= speed; break; // Move up
        case 's': this.y += speed; break; // Move down
      }
    }
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.exists = false;
          ballCount--;
          para.textContent = 'Ball count: ' + ballCount;
        }
      }
    }
  }
}

// Canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Random number generator
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random color generator
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Arrays to hold balls and evil balls
let balls = [];
let evilBalls = [];
let ballCount = 25;
let mayhemInterval = null; // Track the mayhem mode interval

// Add a paragraph to show ball count
const para = document.querySelector('p');
para.textContent = 'Ball count: ' + ballCount;

// Create initial evil circle
const evilCircle = new EvilCircle(random(0, width), random(0, height));
evilBalls.push(evilCircle);

// Function to reset the game to default
function resetGame() {
  clearInterval(mayhemInterval);
  balls = [];
  evilBalls = [evilCircle]; // Keep the main evil circle
  ballCount = 25;
  para.textContent = 'Ball count: 25';

  // Add 25 balls
  while (balls.length < 25) {
    const size = random(10, 20);
    const ball = new Ball(
      random(size, width - size),
      random(size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomRGB(),
      size
    );
    balls.push(ball);
  }
}

// Add an auto-moving evil ball
function addAutoEvilBall() {
  const autoEvilBall = new EvilCircle(random(0, width), random(0, height), true); // Auto-controlled evil ball
  evilBalls.push(autoEvilBall);
}

// Remove an auto-moving evil ball
function removeAutoEvilBall() {
  if (evilBalls.length > 1) evilBalls.pop(); // Keep at least one evil ball
}

// Activate Mayhem Mode (spawn 100 balls and add a ball every 3 seconds)
function mayhemMode() {
  clearInterval(mayhemInterval);
  balls = [];
  ballCount = 100; // Start count at 100
  para.textContent = 'Ball count: ' + ballCount;

  // Add 100 balls initially
  for (let i = 0; i < 100; i++) {
    const size = random(10, 20);
    const ball = new Ball(
      random(size, width - size),
      random(size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomRGB(),
      size
    );
    balls.push(ball);
  }

  // Add a new ball every 3 seconds
  mayhemInterval = setInterval(() => {
    const size = random(10, 20);
    const ball = new Ball(
      random(size, width - size),
      random(size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomRGB(),
      size
    );
    balls.push(ball);
    ballCount++;
    para.textContent = 'Ball count: ' + ballCount;
  }, 3000);
}

// Game loop
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'; // Change this to any color you like
  ctx.fillRect(0, 0, width, height);

  // Draw and update balls
  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  // Draw evil balls
  for (const evilBall of evilBalls) {
    evilBall.draw();
    evilBall.checkBounds();
    evilBall.collisionDetect();
    if (evilBall.isAutoControlled) evilBall.move(); // Auto-move if it's an auto-controlled evil ball
  }

  requestAnimationFrame(loop);
}

// Start the game
resetGame();
loop();

// Button event listeners
document.getElementById('resetGame').addEventListener('click', resetGame);
document.getElementById('addEvilBall').addEventListener('click', addAutoEvilBall);
document.getElementById('removeEvilBall').addEventListener('click', removeAutoEvilBall);
document.getElementById('mayhemMode').addEventListener('click', mayhemMode);
