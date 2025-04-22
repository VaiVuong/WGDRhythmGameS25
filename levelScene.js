class levelScene extends Phaser.Scene {
    constructor() {
        super("levelScene");
    }

    preload() {
        this.load.image("background", "assets/images/ShopBG.png");

        this.load.spritesheet("fruits", "assets/spritesheets/FruitPixel.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet("coin", "assets/spritesheets/CoinPixel.png", {
            frameWidth: 16,
            frameHeight: 16
        });

    }

    create() {
        //MENU BACKGROUND
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(config.width, config.height);
//
    }
}