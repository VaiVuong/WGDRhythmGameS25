class levelScene extends Phaser.Scene {
    constructor() {
        super("levelScene");
    }

    preload() {
        this.load.image("background", "assets/images/ShopBG.png");

        this.load.spritesheet("ship", "assets/spritesheets/ship.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {
            frameWidth: 32,
            frameHeight: 16
        });

        this.load.audio("audio_beam", ["assets/sounds/beam.ogg", "assets/sounds/beam.mp3"]);
        this.load.audio("audio_explosion", ["assets/sounds/explosion.ogg", "assets/sounds/explosion.mp3"]);
        this.load.audio("audio_pickup", ["assets/sounds/pickup.ogg", "assets/sounds/pickup.mp3"]);
        this.load.audio("music", ["assets/sounds/sci-fi_platformer12.ogg", "assets/sounds/sci-fi_platformer12.mp3"]);
    }

    create() {
        
    }
}