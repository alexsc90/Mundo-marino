class Component {
    constructor(width, height, img, x, y) {
        this.width = width;
        this.height = height;
        this.img = img;
        this.x = x;
        this.y = y;
        // new speed properties
        this.speedX = 0;
        this.speedY = 0;
        const diverRaw = new Image();
        diverRaw.src = this.img;
        this.diverImg = diverRaw;
    }
    update() {
        let ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.drawImage(this.diverImg, this.x, this.y, this.width, this.height);
    }
    newPos() {
        this.x = this.x;
        this.y = this.y;
    }
    left() {
        return this.x;
    }
    right() {
        return this.x + this.width;
    }
    top() {
        return this.y;
    }
    bottom() {
        return this.y + this.height;
    }
    crashWith(obstacle) {
        return !(
            this.bottom() < obstacle.top() ||
            this.top() > obstacle.bottom() ||
            this.right() < obstacle.left() ||
            this.left() > obstacle.right()
        );
    }
}
class Diver extends Component {
    constructor(width, height, img, x, y) {
        super(width, height, img, x, y);
        this.life = 100;
        const diverRaw = new Image();
        diverRaw.src = this.img;
        this.diverImg = diverRaw;
    }
    reduceLive() {
        if (myGameArea.frames % 20 === 0) {
            this.life--;
        }
    }
    increaseLive() {
        this.life += 10;
    }
    reduceLiveByImpact(percentage) {
        this.life = Math.ceil(this.life * percentage);
    }
    changeImage(image, width, height) {
        this.width = width;
        this.height = height;
        this.diverImg = image;
    }
    draw() {
        let ctx = myGameArea.context;
        ctx.drawImage(this.diverImg, this.x, this.y, this.width, this.height);
    }
    moveLeft() {
        if (this.x > 0) {
            this.x -= 10;
        }
    }
    moveRight() {
        if (this.x < 1260) {
            this.x += 10;
        }
    }
    moveUp() {
        if (this.y > 0) {
            this.y -= 10;
        }
    }
    moveDown() {
        if (this.y < 585) {
            this.y += 10;
        }
    }
}