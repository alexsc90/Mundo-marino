let myObstaclesTronco = [];
let myObstaclesMedusa = [];
let myObstaclesAncla = [];
let myitemTank = [];
let myObstaclesShark = [];
let myItemShield = [];
let myItemStar = [];
let shieldTime = 0;
let starTime = 0;
let audio = new Audio('./music/musica-general.mp3');
let audioDiver = new Audio("./music/burbuja.mp3")
const fondoNegro = new Image();
fondoNegro.src = "./imagenes/FondoNegro.png";
// Iniciar el area de Juego con Fondo
const fondoRaw = new Image();
fondoRaw.src = "./imagenes/fondo-marino.jpg";
const myGameArea = {
    canvas: document.getElementById("canvas"),
    frames: 0,
    x: 0,
    y: 0,
    speed: -3,
    img: fondoRaw,
    start: function () {
        this.canvas.width = 1365;
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
        this.context.font = "bold 30px serif";
        this.context.fillStyle = "#FF9900";
        this.context.fillText(`Puntaje: ${points}`, 350, 50);
        return points;
    },
    life: function (health) {
        this.context.font = "30px serif";
        this.context.fillStyle = "#FF0066";
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
const player = new Diver(100, 50, "./imagenes/buzo.png", 300, 300); 
// FUNCIONES 
function updateObstaclesTronco(frame) {
    const crashedTronco = myObstaclesTronco.some(function (obstacle) {
        return player.crashWith(obstacle);
    });
    if (crashedTronco && shieldTime === 0) {
        player.reduceLiveByImpact(0.9);
        let filter = myObstaclesTronco.filter(function (obstacle) {
            return player.crashWith(obstacle);
        });
        let index = myObstaclesTronco.indexOf(filter[0]);
        myObstaclesTronco.splice(index, 1);
    } else {
        for (i = 0; i < myObstaclesTronco.length; i++) {
            myObstaclesTronco[i].x += -1;
            myObstaclesTronco[i].update();
        }
        myGameArea.frames += 1;
        if (myGameArea.frames % frame === 0) {
            let x = myGameArea.canvas.width;
            let y = myGameArea.canvas.height;
            let randomHeight = Math.floor(Math.random() * (y - 100)) + 50;
            myObstaclesTronco.push(new Component(120, 60, "./imagenes/tronco.png", x, randomHeight));
        }
    }
}
function updateObstaclesMedusa(frame) {
    const crashedMedusa = myObstaclesMedusa.some(function (obstacle) {
        return player.crashWith(obstacle);
    });
    if (crashedMedusa && shieldTime === 0) {
        player.reduceLiveByImpact(0.5);
        let filter = myObstaclesMedusa.filter(function (obstacle) {
            return player.crashWith(obstacle);
        });
        let index = myObstaclesMedusa.indexOf(filter[0]);
        myObstaclesMedusa.splice(index, 1);
    } else {
        for (i = 0; i < myObstaclesMedusa.length; i++) {
            myObstaclesMedusa[i].y += -1;
            myObstaclesMedusa[i].update();
        }
        if (myGameArea.frames % frame === 0) {
            let x = myGameArea.canvas.width;
            let y = myGameArea.canvas.height;
            let randomHeight = Math.floor(Math.random() * (x - 50)) + 50;
            myObstaclesMedusa.push(new Component(60, 80, "./imagenes/medusa.png", randomHeight, y));
        }
    }
}
function upadateObstaclesShark(frame) {
    for (i = 0; i < myObstaclesShark.length; i++) {
        myObstaclesShark[i].x += 1;
        myObstaclesShark[i].update();
    }
    if (myGameArea.frames % frame === 0) {
        let x = myGameArea.canvas.width;
        let y = myGameArea.canvas.height;
        let randomHeight = Math.floor(Math.random() * (y - 200)) + 50;
        myObstaclesShark.push(new Component(400, 150, "./imagenes/shark.png", -400, randomHeight));
    }
}
function updateObstaclesAncla(frame) {
    const crashedAncla = myObstaclesAncla.some(function (obstacle) {
        return player.crashWith(obstacle);
    });
    if (crashedAncla && shieldTime === 0) {
        player.reduceLiveByImpact(0.75);
        let filter = myObstaclesAncla.filter(function (obstacle) {
            return player.crashWith(obstacle);
        });
        let index = myObstaclesAncla.indexOf(filter[0]);
        myObstaclesAncla.splice(index, 1);
    } else {
        for (i = 0; i < myObstaclesAncla.length; i++) {
            myObstaclesAncla[i].y += 1;
            myObstaclesAncla[i].update();
        }
        if (myGameArea.frames % frame === 0) {
            let x = myGameArea.canvas.width;
            let y = myGameArea.canvas.height;
            let randomHeight = Math.floor(Math.random() * (x - 60)) + 50;
            myObstaclesAncla.push(new Component(50, 60, "./imagenes/ancla.png", randomHeight, -70));
        }
    }
}
// CREAR ITEMS QUE MEJOREN EL PERFORMANCE DEL JUGADOR
function updateItemTank() {
    const crashedItemLife = myitemTank.some(function (obstacle) {
        return player.crashWith(obstacle);
    });
    if (crashedItemLife) {
        player.increaseLive();
        let filter = myitemTank.filter(function (obstacle) {
            return player.crashWith(obstacle);
        });
        let index = myitemTank.indexOf(filter[0]);
        myitemTank.splice(index, 1);
    } else {
        for (i = 0; i < myitemTank.length; i++) {
            myitemTank[i].y += -1;
            myitemTank[i].update();
        }
        if (myGameArea.frames % 200 === 0) {
            let x = myGameArea.canvas.width;
            let y = myGameArea.canvas.height;
            let randomHeight = Math.floor(Math.random() * (x - 110)) + 50;
            myitemTank.push(new Component(60, 70, "./imagenes/tanque.png", randomHeight, y));
        }
    }
}
function updateItemShield(frame) {
    const crashedItemShield = myItemShield.some(function (obstacle) {
        return player.crashWith(obstacle);
    });
    if (crashedItemShield) {
        shieldTime += 300;
        const diverRaw = new Image();
        diverRaw.src = "./imagenes/burbuja.png";
        player.changeImage(diverRaw, 140, 80);
        let filter = myItemShield.filter(function (obstacle) {
            return player.crashWith(obstacle);
        });
        let index = myItemShield.indexOf(filter[0]);
        myItemShield.splice(index, 1);
    } else {
        if (shieldTime > 0) {
            shieldTime--;
            myGameArea.context.fillStyle = 'red'
            myGameArea.context.font = "40px Arial";
            myGameArea.context.fillText(`Escudo: ${shieldTime}`, 500, 200)
        }
        for (i = 0; i < myItemShield.length; i++) {
            myItemShield[i].y += -1;
            myItemShield[i].update();
        }
        if (myGameArea.frames % frame === 0) {
            let x = myGameArea.canvas.width;
            let y = myGameArea.canvas.height;
            let randomHeight = Math.floor(Math.random() * (x - 110)) + 50;
            myItemShield.push(new Component(100, 90, "./imagenes/shield.png", randomHeight, y));
        }
    }
}
function updateItemStar(frame) {
    const crashedItemShield = myItemStar.some(function (obstacle) {
        return player.crashWith(obstacle);
    });
    if (crashedItemShield) {
        starTime += 300;
        const diverRaw = new Image();
        diverRaw.src = "./imagenes/energía.png";
        player.changeImage(diverRaw, 140, 80);
        myGameArea.speed = -10;
        let filter = myItemStar.filter(function (obstacle) {
            return player.crashWith(obstacle);
        });
        let index = myItemStar.indexOf(filter[0]);
        myItemStar.splice(index, 1);
    } else {
        if (starTime > 0) {
            starTime--;
            myGameArea.frames += 2;
        }
        if (starTime === 0 && shieldTime === 0) {
            const diverRaw = new Image();
            diverRaw.src = "./imagenes/buzo.png";
            player.changeImage(diverRaw, 100, 50);
        }
        for (i = 0; i < myItemStar.length; i++) {
            myItemStar[i].y += 1;
            myItemStar[i].update();
        }
        if (myGameArea.frames % frame === 0) {
            let x = myGameArea.canvas.width;
            let y = myGameArea.canvas.height;
            let randomHeight = Math.floor(Math.random() * (x - 100)) + 50;
            myItemStar.push(new Component(90, 70, "./imagenes/starfish.png", randomHeight, -70));
        }
    }
}
function changeDificulty() {
    player.reduceLive();
    myGameArea.life(player.life);
    myGameArea.score();
    if (myGameArea.score() < 1000) {
        if(starTime === 0 && shieldTime === 0) myGameArea.speed = -3;
        updateObstaclesTronco(250);
        updateObstaclesMedusa(800);
        upadateObstaclesShark(1500);
        updateObstaclesAncla(600);
        updateItemTank();
        updateItemStar(900);
        updateItemShield(1400)
    } else if (myGameArea.score() >= 1000) {
        myGameArea.speed = -10;
        myGameArea.img = fondoNegro;
        updateObstaclesTronco(175);
        updateObstaclesMedusa(550);
        upadateObstaclesShark(1300);
        updateObstaclesAncla(400);
        updateItemTank();
        updateItemShield(1250);
        updateItemStar(5000);
    }
}
function checkGameOver() {
    const crashedShark = myObstaclesShark.some(function (obstacle) {
        return player.crashWith(obstacle);
    });
    if (player.life === 0 || (crashedShark && shieldTime === 0)) {
        myGameArea.stop();
        myGameArea.clear();
        myGameArea.score();
        myGameArea.context.fillStyle = "#FF0066";
        myGameArea.context.font = '100px Arial';
        myGameArea.context.fillText('Game Over', 425, 325);
        let btn = document.createElement('button');
        btn.innerHTML = 'Juego Nuevo';
        btn.classList.add('reiniciar')
        board.appendChild(btn)
        btn.addEventListener('click', () => {
            window.location.reload()
        })
        audio.pause();
    }
}
function updateGameArea() {
    myGameArea.move();
    myGameArea.clear();
    myGameArea.draw();
    // update the player's position before drawing
    player.newPos();
    player.draw();
    // update the obstacles array
    changeDificulty();
    // check if the game should stop
    checkGameOver();
}





