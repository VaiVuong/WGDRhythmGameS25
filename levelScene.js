class levelScene extends Phaser.Scene {
    constructor() {
        super("levelScene");
        this.finalScore = 0;  // Initialize finalScore here
    }

    preload() {
        this.load.image("background", "assets/images/ShopBG.png");
        this.load.spritesheet("fruit", "assets/images/FruitPixel.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.json("midiData", "assets/midi/flowering.json");
        this.load.audio("flowering", ["assets/sounds/Flowering.mp3"]);
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
        this.load.spritesheet("badger_attack", "assets/images/badger_attack_B.png", {
            frameWidth: 384,
            frameHeight: 128
        });
    }

    create() {
        // Background image
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(config.width, config.height);

        // Stop all sounds when transitioning away from this scene
        this.sound.stopAll(); // Stop any currently playing sounds

        this.menuTune = this.sound.add("flowering");
        this.menuTune.play({
            mute: false,
            volume: .3,
            rate: 1, // change back to 1 after debug
            loop: false,
            detune: 0,
            seek: 0,
            delay: 0
        });

        this.menuTune.on('complete', () => {
            console.log("Song has finished");
            // Pass finalScore to the next scene
            this.scene.start("scoreboardScene", { score: this.finalScore });
        });

        // Define 4 horizontal lane positions
        this.lanes = [
            config.width * 0.2,  // Left lane
            config.width * 0.4,  // Second lane
            config.width * 0.6,  // Third lane
            config.width * 0.8   // Right lane
        ];

        // Load and parse the MIDI file
        const midi = this.cache.json.get("midiData");

        if (!midi || !midi.tracks) {
            console.error("Failed to load MIDI tracks from JSON", midi);
            return;
        }

        // Loop through notes and schedule them in Phaser
        midi.tracks.forEach(track => {
            if (!track.notes) return;

            track.notes.forEach(note => {
                if (note.name && this.getLaneForNote(note.name) !== -1) {
                    const distanceToFall = config.height - 50;
                    const fallTime = distanceToFall / 200; // seconds

                    const spawnTime = (note.time - fallTime) * 1000; // convert to ms

                    this.time.delayedCall(spawnTime, () => {
                        this.spawnFruitFromMidi(note);
                    });
                }
            });
        });

        // Group to manage falling fruit sprites
        this.fruitGroup = this.physics.add.group({
            defaultKey: "fruit",
            runChildUpdate: true
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
        this.player = this.physics.add.sprite(config.width / 2, config.height - 165, "badger_idle");
        this.player.setScale(2);
        this.player.play("idle");
        this.player.body.setSize(100, 50).setOffset(0, 100);

        this.anims.create({
            key: "attack",
            frames: this.anims.generateFrameNumbers("badger_attack", { start: 0, end: 5 }),
            frameRate: 35,
            repeat: 0
        });

        // Track previous X to determine direction
        this.prevMouseX = this.player.x;
        // Space key input
        this.isAttacking = false;
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.player.on("animationcomplete", (anim) => {
            if (anim.key === "attack") {
                this.isAttacking = false;
                this.player.play("idle");
            }
        });

        // SCORING BOARD
        this.score = 0;
        this.combo = 0;
        this.multiplier = 1;

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'monospace',
            stroke: '#000000',
            strokeThickness: 4
        });

        this.multiplierText = this.add.text(16, 48, 'Multiplier: x1', {
            fontSize: '24px',
            fill: '#ff0',
            fontFamily: 'monospace',
            stroke: '#000000',
            strokeThickness: 4
        });
    }

    spawnFruitFromMidi(note) {
        // Map the MIDI note to a specific lane
        let laneIndex = this.getLaneForNote(note.name);

        if (laneIndex !== -1) {
            const x = this.lanes[laneIndex]; // Set X to the random lane
            const y = 0; // Start above the screen
            const frameIndex = laneIndex; // Random fruit from the spritesheet

            const fruit = this.fruitGroup.create(x, y, "fruit", frameIndex);
            fruit.setScale(2);
            fruit.setVelocityY(200); // Speed at which the fruit falls

            console.log(`Spawned fruit at lane ${laneIndex} for note ${note.name}`);
        }
    }

    getLaneForNote(noteName) {
        switch (noteName) {
            case "E4": return 0; // Left lane
            case "F#4": return 1; // Second lane
            case "G#4": return 2; // Third lane
            case "A#4": return 3; // Right lane
            default: return -1; // No lane
        }
    }

    

    // Helper function to determine the closest lane (0, 1, 2, or 3)
    getClosestLane(x) {
        const laneWidth = config.width / 4;
        if (x < laneWidth) return 0; // Left lane
        if (x < laneWidth * 2) return 1; // Second lane
        if (x < laneWidth * 3) return 2; // Third lane
        return 3; // Right lane
    }

    // Multiplier Updater
    updateMultiplier() {
        let newMultiplier = 1;
        if (this.combo >= 31) {
            newMultiplier = 4;
        } else if (this.combo >= 21) {
            newMultiplier = 3;
        } else if (this.combo >= 11) {
            newMultiplier = 2;
        }

        if (newMultiplier !== this.multiplier) {
            this.multiplier = newMultiplier;
            this.multiplierText.setText(`Multiplier: x${newMultiplier}`);

            this.tweens.add({
                targets: this.multiplierText,
                scale: { from: 1.5, to: 1 },
                duration: 200,
                ease: "Bounce.easeout"
            });
        }
    }

    update() {
        if (!this.player) return;
        
        const pointerX = this.input.activePointer.x;

        // Move player only when not attacking
        if (!this.isAttacking) {
            this.player.x = pointerX;

            if (pointerX > this.prevMouseX) {
                this.player.flipX = false;
                this.player.play("move", true);
                this.player.body.setSize(100, 50).setOffset(130, 75);
            } else if (pointerX < this.prevMouseX) {
                this.player.flipX = true;
                this.player.play("move", true);
                this.player.body.setSize(100, 50).setOffset(130, 75);
            } else {
                this.player.play("idle", true);
                this.player.body.setSize(100, 50).setOffset(0, 75);
            }

            this.prevMouseX = pointerX;
        }

        // Handle attack input
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.isAttacking = true;
            this.player.setTexture("badger_attack");
            this.player.play("attack", true);
            this.player.body.setSize(100, 50).setOffset(130, 75);
        }

        // Collision detection during attack
        if (this.isAttacking) {
            this.physics.overlap(this.player, this.fruitGroup, (player, fruit) => {
                console.log('Fruit hit!', fruit);
                fruit.destroy();
                this.combo++; // COMBO LOGIC
                this.updateMultiplier();
                this.score += 500 * this.multiplier;
                this.scoreText.setText(`Score: ${this.score}`);
                this.sound.play("smush");

                // Update finalScore here after fruit hit
                this.finalScore = this.score;  // Keep updating finalScore during the game
            });
        }

        // Check for fruit falling off-screen
        this.fruitGroup.getChildren().forEach(fruit => {
            if (fruit.y > config.height - 50) {
                this.combo = 0; // Combo reset on miss
                this.multiplier = 1;
                this.updateMultiplier();
                this.sound.play("miss");
                fruit.destroy();
            }
        });
    }
}
