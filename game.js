var game; // Declare globally

var gameSettings = {
    playerSpeed: 200,
};

var config = {
    type: Phaser.AUTO,
    parent: 'gameContainer',  // Attach the game to this div
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    dom: {
        createContainer: true
    },
    scene: [menuScene, levelScene, scoreboardScene],
};


window.onload = function() {
    game = new Phaser.Game(config);
};