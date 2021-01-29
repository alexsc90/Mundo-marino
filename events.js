const fondo = document.getElementById('fondo')
const btn = document.getElementById('iniciar-juego')
const board = document.getElementById('game-board')
btn.addEventListener('click', () => {
    fondo.style.display = 'none'
    board.style.display = 'flex'
    board.style.position = 'relative';
    myGameArea.start();
    audio.play();
});
document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 38: // up arrow
            player.moveUp();
            audioDiver.play();
            break;
        case 40: // down arrow
            player.moveDown();
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
