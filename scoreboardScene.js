class scoreboardScene extends Phaser.Scene {
    constructor() {
        super("scoreboardScene");
    }

    init(data){
        this.finalScore = data.score || 0;
    }


    preload(){


        this.load.image("leaderBG", "assets/images/LeaderBoard.png");
        this.load.image("submit", "assets/images/Submit.png");
        this.load.image("menu", "assets/images/Menu.png");



        this.load.audio("menuTune", ["assets/sounds/Chiptune.mp3"]);
        this.load.audio("selection", ["assets/sounds/Selection.mp3"]);

        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
    }

    create() {
        this.sound.stopAll();
        
        // Scoreboard Background
        this.scoreBackground = this.add.image(0, 0, "leaderBG");
        this.scoreBackground.setOrigin(0, 0);
        this.scoreBackground.setDisplaySize(config.width, config.height);
        
        // Submit Button
        this.submit = this.add.image(0, 0, "submit");
        this.submit.setOrigin(-1.5, -5);
        this.submit.setDisplaySize(config.width / 7, config.height / 8)
        this.submit.setInteractive();
        
        // Menu Button
        this.menu = this.add.image(0, 0, "menu");
        this.menu.setOrigin(-1.5, -6.5);
        this.menu.setDisplaySize(config.width / 7, config.height / 8)
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
        
        var printText = this.add.text(400, 200, '', {
            fontSize: '12px',
        }).setOrigin(0.5).setFixedSize(100, 100);
        var inputText = this.add.rexInputText(400, 400, 10, 10, {
            type: 'textarea',
            text: 'hello world',
            fontSize: '12px',
        })
            .resize(100, 100)
            .setOrigin(0.5)
            .on('textchange', function (inputText) {
                printText.text = inputText.text;
            })
            .on('focus', function (inputText) {
                console.log('On focus');
            })
            .on('blur', function (inputText) {
                console.log('On blur');
            })
            .on('click', function (inputText) {
                console.log('On click');
            })
            .on('dblclick', function (inputText) {
                console.log('On dblclick');
            })

        this.input.on('pointerdown', function () {
            inputText.setBlur();
            console.log('pointerdown outside');
        })
      
        inputText.on('keydown', function (inputText, e) {
            if ((inputText.inputType !== 'textarea') && (e.key === 'Enter')) {
                inputText.setBlur();
            }
        })
      
        printText.text = inputText.text;

        this.add.text(0, 580, 'Click below text to edit it');
        
        // Submit Button Click
        this.submit.on("pointerdown", () => {
            this.sound.play("selection");
        });
        
        // Menu Button Click
        this.menu.on("pointerdown", () => {
            this.sound.play("selection");
            this.scene.start("menuScene");
        });
    }

    update(){

    }

}