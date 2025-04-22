var game; // Declare globally

var gameSettings = {
    playerSpeed: 200,
};

var config = {
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    scene: [menuScene, levelScene],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0},
            debug: false
        }
    }
};

window.onload = function() {
    game = new Phaser.Game(config); // Assign to global variable
};