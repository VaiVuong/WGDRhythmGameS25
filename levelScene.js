class levelScene extends Phaser.Scene {
    constructor() {
        super("levelScene");
    }

    preload() {
        this.load.image("background", "assets/images/ShopBG.png");

        this.load.spritesheet("fruit", "assets/images/FruitPixel.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.audio("menuTune", ["assets/sounds/Chiptune.mp3"]);
        this.load.audio("miss", ["assets/sounds/Miss.mp3"]);
        this.load.audio("selection", ["assets/sounds/Selection.mp3"]);
        this.load.audio("smush", ["assets/sounds/Smush.mp3"]);

        this.load.spritesheet("badger_idle", "assets/images/badger_idle.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("badger_move", "assets/images/badger_move.png", {
            frameWidth: 384,
            frameHeight: 128
        });
    }

    create() {
        // Background image
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(config.width, config.height);

        // Define 4 horizontal lane positions
        this.lanes = [
            config.width * 0.2,  // Left lane
            config.width * 0.4,  // Second lane
            config.width * 0.6,  // Third lane
            config.width * 0.8   // Right lane
        ];

        // Group to manage falling fruit sprites
        this.fruitGroup = this.physics.add.group({
            defaultKey: "fruit",
            runChildUpdate: true
        });
        

        // Drop fruit every 800ms
        this.time.addEvent({
            delay: 800,
            callback: this.spawnFruit,
            callbackScope: this,
            loop: true
        });


      // Badger animations
    this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("badger_idle", { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
    });

    this.anims.create({
        key: "move",
        frames: this.anims.generateFrameNumbers("badger_move", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    // Badger player sprite
    this.player = this.add.sprite(config.width / 2, config.height - 165, "badger_idle");
    this.player.setScale(2);
    this.player.play("idle");

    // Track previous X to determine direction
    this.prevMouseX = this.player.x;
    }

    spawnFruit() {
        // Randomly pick a lane (index 0 to 3)
        const laneIndex = Phaser.Math.Between(0, this.lanes.length - 1);
        const x = this.lanes[laneIndex]; // Set X to the random lane
        const y = 0; // Start above the screen
        const frameIndex = laneIndex; // Random fruit from the spritesheet

        const fruit = this.fruitGroup.create(x, y, "fruit", frameIndex);
        fruit.setScale(2);
        fruit.setVelocityY(100);

        console.log("Spawned fruit at", x, "in lane", laneIndex, "frame", frameIndex);
    }

    update() {
        // Destroy any fruit that has fallen off-screen
        this.fruitGroup.children.each(fruit => {
            if (fruit.y > config.height + 20) {
                fruit.destroy();
            }
        }, this);


        let pointerX = this.input.activePointer.x;

    // Only move left-right
    this.player.x = pointerX;

    // Determine movement direction
    if (pointerX > this.prevMouseX) {
        this.player.flipX = false; // Face right
        this.player.play("move", true);
    } else if (pointerX < this.prevMouseX) {
        this.player.flipX = true; // Face left
        this.player.play("move", true);
    } else {
        this.player.play("idle", true);
    }

// Update previous mouse X for next frame
this.prevMouseX = pointerX;
    }
}
