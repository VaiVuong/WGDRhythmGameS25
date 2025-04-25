var game; // Declare globally

var gameSettings = {
    playerSpeed: 200,
};

var config = {
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    scene: [menuScene, levelScene, scoreboardScene],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0},
            debug: true
        }
    }
};

window.onload = function() {
    game = new Phaser.Game(config);
};