const fondo = document.getElementById('fondo')
const btn = document.getElementById('iniciar-juego')
const board = document.getElementById('game-board')

btn.addEventListener('click', () => {
    fondo.style.display = 'none'
    board.style.display = 'flex'
    board.style.position = 'relative'
})

const myObstaclesTronco = [];
const myObstaclesMedusa = [];
let myitemTank = [];
// Iniciar el area de Juego con Fondo
const imgRaw = new Image();
imgRaw.src = "./imagenes/fondo-marino.jpg";
const myGameArea = {
    canvas: document.getElementById("canvas"),
    frames: 0,
    x: 0,
    y: 0,
    speed: -3,
    img: imgRaw,
    start: function () {
        this.canvas.width = 1300;
        this.canvas.height = 655;
        this.context = this.canvas.getContext("2d");
        // call updateGameArea() every 20 milliseconds
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    score: function () {
        const points = Math.floor(this.frames / 5);
        this.context.font = "18px serif";
        this.context.fillStyle = "black";
        this.context.fillText(`Puntaje: ${points}`, 350, 50);
    },
    life: function (health) {
        this.context.font = "30px serif";
        this.context.fillStyle = "black";
        this.context.fillText(`Tu aire:${health}`, 150, 50);
    },
    draw: function () {
        this.context.drawImage(this.img, this.x, this.y, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.img, this.x + this.canvas.width, this.y, this.canvas.width, this.canvas.height);
    },
    move: function () {
        this.x += this.speed;
        this.x %= this.canvas.width;
    }
};
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
        if (this.x < 1200) {
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
const player = new Diver(100, 70, "./imagenes/buzo.png", 300, 300);
function updateGameArea() {
    myGameArea.move();
    myGameArea.clear();
    myGameArea.draw();
    // update the player's position before drawing
    player.newPos();
    player.reduceLive();
    player.draw();
    // update the obstacles array
    updateObstaclesTronco();
    updateObstaclesMedusa();
    updateItemTank();
    // updateItems();
    // check if the game should stop
    // checkItems();
    checkGameOver();
    // update and draw the score
    myGameArea.score();
    myGameArea.life(player.life);
}
myGameArea.start();
document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 38: // up arrow
            player.moveUp()
            break;
        case 40: // down arrow
            player.moveDown()
            break;
        case 37: // left arrow
            player.moveLeft();
            break;
        case 39: // right arrow
            player.moveRight();
            break;
    }
};
document.onkeyup = function (e) {
    player.speedX = 0;
    player.speedY = 0;
};
function updateObstaclesTronco() {
    for (i = 0; i < myObstaclesTronco.length; i++) {
        myObstaclesTronco[i].x += -1;
        myObstaclesTronco[i].update();
    }
    // constructor(width, height, img, x, y) {
    myGameArea.frames += 1;
    if (myGameArea.frames % 300 === 0) {
        let x = myGameArea.canvas.width;
        let y = myGameArea.canvas.height;
        let randomHeight = Math.floor(Math.random() * (y - 50)) + 50;
        myObstaclesTronco.push(new Component(120, 60, "./imagenes/tronco.png", x, randomHeight));
    }
}
function updateObstaclesMedusa() {
    for (i = 0; i < myObstaclesTronco.length; i++) {
        myObstaclesMedusa[i].y += -1;
        myObstaclesMedusa[i].update();
    }
    // constructor(width, height, img, x, y) {
    if (myGameArea.frames % 200 === 0) {
        let x = myGameArea.canvas.width;
        let y = myGameArea.canvas.height;
        let randomHeight = Math.floor(Math.random() * (x - 50)) + 50;
        myObstaclesMedusa.push(new Component(80, 60, "./imagenes/medusa.png", randomHeight, y));
    }
}
function updateItemTank() {
    const crashedItemLife = myitemTank.some(function (obstacle) {
        return player.crashWith(obstacle);
    });
    if (crashedItemLife) {
        player.increaseLive();
        myitemTank = [];
        return;
    } else {
        for (i = 0; i < myitemTank.length; i++) {
            myitemTank[i].y += -1;
            myitemTank[i].update();
        }
        // constructor(width, height, img, x, y) {
        if (myGameArea.frames % 400 === 0) {
            let x = myGameArea.canvas.width;
            let y = myGameArea.canvas.height;
            let randomHeight = Math.floor(Math.random() * (x - 50)) + 50;
            myitemTank.push(new Component(80, 90, "./imagenes/tanque.png", randomHeight, y));
        }
    }
}
/* function checkItems() {
    const crashedItemLife = myitemTank.filter(function (obstacle) {
        return player.crashWith(obstacle);
    });
    if (crashedItemLife) {
        console.log(crashedItemLife);
    }
} */
function checkGameOver() {
    const crashedTronco = myObstaclesTronco.some(function (obstacle) {
        return player.crashWith(obstacle);
    });
    const crashedMedusa = myObstaclesMedusa.some(function (obstacle) {
        return player.crashWith(obstacle);
    });
    if (crashedTronco || crashedMedusa) {
        myGameArea.stop();
    }
}