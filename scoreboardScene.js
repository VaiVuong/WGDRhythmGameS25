class scoreboardScene extends Phaser.Scene {
    constructor() {
        super("scoreboardScene");
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    preload() {
        this.load.image("leaderBG", "assets/images/LeaderBoard.png");
        this.load.image("submit", "assets/images/Submit.png");
        this.load.image("menu", "assets/images/Menu.png");
        this.load.audio("menuTune", ["assets/sounds/Chiptune.mp3"]);
        this.load.audio("selection", ["assets/sounds/Selection.mp3"]);
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);

        this.load.atlas('portraits', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/characters/portraits.png', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/characters/portraits.json');
    }

    create() {
        this.sound.stopAll();
        
        // Flag to track if score has been submitted
        this.isScoreSubmitted = false;

        // Scoreboard Background
        this.scoreBackground = this.add.image(0, 0, "leaderBG");
        this.scoreBackground.setOrigin(0, 0);
        this.scoreBackground.setDisplaySize(config.width, config.height);
        
        // Submit Button
        this.submit = this.add.image(0, 0, "submit");
        this.submit.setOrigin(-1.5, -5);
        this.submit.setDisplaySize(config.width / 7, config.height / 8);
        this.submit.setInteractive();
        
        // Menu Button
        this.menu = this.add.image(0, 0, "menu");
        this.menu.setOrigin(-1.5, -6.5);
        this.menu.setDisplaySize(config.width / 7, config.height / 8);
        this.menu.setInteractive();
        
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
    
        // Create Input Field
        this.inputText = this.add.rexInputText(375, 300, 350, 50, {
            type: 'textarea',
            text: 'Enter your name',
            fontSize: '40px',
            background: 'transparent',
            maxLength: 8,
            color: '#000',
            border: '2px solid #fff',
            padding: 10,
        }).setOrigin(0.5)
        .setInteractive();

        //Leaderboard
        this.leaderText = this.add.text(800, 400, 'Loading leaderboard...', {
            fontSize: '40px',
            color: '#000000',
            align: 'left',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        this.leaderText.text = "TEST TEST";
        
        // Submit Button Click Handler
        this.submit.on("pointerdown", () => {
            if (this.isScoreSubmitted) {
                return; // Prevent further submissions if the score is already submitted
            }

            this.sound.play("selection");

            const playerName = this.inputText.text;
            const playerScore = this.finalScore;

            // Call the function to submit the score
            this.submitScore(playerName, playerScore);

            // Mark the score as submitted and disable the button
            this.isScoreSubmitted = true;
            this.submit.setAlpha(0.5);  // Make the button semi-transparent to show it's disabled
            this.submit.setInteractive(false); // Disable interaction with the button
        });
    
        // Menu Button Click Handler
        this.menu.on("pointerdown", () => {
            this.sound.play("selection");
            this.scene.start("menuScene");
        });
    
        // Display Scores when Scene Starts
        this.fetchScores();

        createTextBox(this, 100, 50, {
            wrapWidth: 500,
        })
            .start(content, 50);

        // Fixed size of textbox, and text game object
        createTextBox(this, 100, 200, {
            width: 600,
            height: 150,
            title: 'Title'
        })
            .start(content, 50);

        // Fixed size of text game object
        createTextBox(this, 100, 450, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 65,
            typingMode: 'line'
        })
            .start(content, 50);
    }
    
// Function to submit the score to Firestore
async submitScore(playerName, score) {
    try {
        await window.addDoc(window.collection(window.db, "bfbLeaderboard"), {
            user: playerName, // Save as 'user' instead of 'name'
            score: score
        });
        console.log("Score submitted");
        this.fetchScores(); // Refresh scores
    } catch (e) {
        console.error("Error submitting score: ", e);
    }
}
    
// Function to fetch top scores from Firestore
async fetchScores() {
    try {
        const q = window.query(
            window.collection(window.db, "bfbLeaderboard"),
            window.orderBy("score", "desc"),
            window.limit(10)
        );
        const querySnapshot = await window.getDocs(q);
        const scores = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            scores.push({ user: data.user, score: data.score }); // Access 'user' and 'score' fields
        });
        this.displayScores(scores); // Display fetched scores
    } catch (e) {
        console.error("Error fetching scores: ", e);
    }
}

    displayScores(scores) {
        if (!this.leaderText) {
            // Just in case it's not initialized
            this.leaderText = this.add.text(640, 400, '', {
                fontSize: '32px',
                color: '#ffffff',
                align: 'left',
                wordWrap: { width: 600 }
            }).setOrigin(0.5);
        }
    
        if (!scores.length) {
            this.leaderText.setText("No scores yet!");
            return;
        }
    
        const leaderboardString = scores.map((entry, index) => {
            return `${index + 1}. ${entry.user}: ${entry.score}`;
        }).join('\n');
    
        this.leaderText.setText(leaderboardString);
    }

    update() {}
}
