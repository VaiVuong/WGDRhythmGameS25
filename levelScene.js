class levelScene extends Phaser.Scene {
    constructor() {
        super("levelScene");
    }

    init() {
        this.score = 0;
        this.combo = 0;
        this.multiplier = 1;
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

        this.load.audio("miss", ["assets/sounds/beam.ogg", "assets/sounds/Miss.mp3"]);
        this.load.audio("hit", ["assets/sounds/explosion.ogg", "assets/sounds/Smush.mp3"]);
    }

    create() {
        // Background
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
        this.background.setDisplaySize(config.width, config.height);

        // Score Text
        this.scoreText = this.add.text(20, 20, "Score: 0", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#ffffff"
        });

        // Multiplier Text
        this.multiplierText = this.add.text(20, 60, "Multiplier: x1", {
            fontFamily: "Arial",
            fontSize: "28px",
            color: "#ffcc00"
        });

        // Example music trigger
        this.music = this.sound.add("music");
        this.music.play({
            volume: 0.5,
            loop: true
        });

        // DEBUG: Simulate hits & misses
        this.input.keyboard.on("keydown-H", () => {
            this.updateScore();
        });

        this.input.keyboard.on("keydown-M", () => {
            this.resetCombo();
        });
    }

    updateScore(points = 100) {
        this.combo++;

        // Set multiplier based on combo
        if (this.combo >= 31) {
            this.multiplier = 4;
        } else if (this.combo >= 21) {
            this.multiplier = 3;
        } else if (this.combo >= 11) {
            this.multiplier = 2;
        } else {
            this.multiplier = 1;
        }

        // Update score
        this.score += points * this.multiplier;

        // Update text
        this.scoreText.setText(`Score: ${this.score}`);
        this.multiplierText.setText(`Multiplier: x${this.multiplier}`);
    }

    resetCombo() {
        this.combo = 0;
        this.multiplier = 1;
        this.multiplierText.setText(`Multiplier: x1`);
    }
}
