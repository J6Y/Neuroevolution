class Obstacle {
    constructor(x, y, w, h, c) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.colour = c;

      this.speed = -gameSpeed;
    }
  
    update() {
      this.x += this.speed;
      this.display();
      this.speed = -gameSpeed;
    }
  
    display() {
        ctx.beginPath();
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath();
    }
}