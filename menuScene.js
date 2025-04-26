class menuScene extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

        this.load.image("background", "assets/images/ShopBG.png");
        this.load.image("credit", "assets/images/Credits.png");
        this.load.image("title", "assets/images/BadgerFruitBash.png");
        this.load.image("start", "assets/images/Start.png");
        this.load.image("quit", "assets/images/Quit.png");
        this.load.audio("menuTune", ["assets/sounds/Chiptune.mp3"]);
        this.load.audio("miss", ["assets/sounds/Miss.mp3"]);
        this.load.audio("selection", ["assets/sounds/Selection.mp3"]);
        this.load.audio("smush", ["assets/sounds/Smush.mp3"]);
    }

    create() {
        this.sound.stopAll();

        // Menu background
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(config.width, config.height);

        // Title card
        this.title = this.add.image(0, 0, "title");
        this.title.setOrigin(-1, -.05);
        this.title.setDisplaySize(config.width / 3, config.height / 3);

        // Start button
        this.start = this.add.image(0, 0, "start");
        this.start.setOrigin(-3, -2.6);
        this.start.setDisplaySize(config.width / 7, config.height / 7);
        this.start.setInteractive();

        // Quit button
        this.quit = this.add.image(0, 0, "quit");
        this.quit.setOrigin(-3, -3.5);
        this.quit.setDisplaySize(config.width / 7, config.height / 7);
        this.quit.setInteractive();

        // Credits
        this.credit = this.add.image(0, 0, "credit");
        this.credit.setOrigin(-1, -5);
        this.credit.setDisplaySize(config.width / 3, config.height / 6);

        // Play menu music
        this.menuTune = this.sound.add("menuTune");
        this.menuTune.play({
            mute: false,
            volume: 0.75,
            rate: 1,
            loop: true,
            detune: 0,
            seek: 0,
            delay: 0
        });

        // Start button behavior
        this.start.on("pointerdown", () => {
            this.sound.play("selection");
            this.scene.start("levelScene");
        });

        // Quit button behavior
        this.quit.on("pointerdown", () => {
            this.sound.play("selection");
            console.log("Quit clicked");
            window.close();
        });
    }


}
