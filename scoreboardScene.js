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
    }

    create(){
        this.sound.stopAll();

        //Scoreboard Background
        this.scoreBackground = this.add.image(0,0, "leaderBG");
        this.scoreBackground.setOrigin(0,0);
        this.scoreBackground.setDisplaySize(config.width, config.height);

        //Submit Button
        this.submit = this.add.image(0,0, "submit");
        this.submit.setOrigin(-1.5,-5);
        this.submit.setDisplaySize(config.width / 7, config.height / 8)
        this.submit.setInteractive();

        //Menu Button
        this.menu = this.add.image(0,0, "menu");
        this.menu.setOrigin(-1.5,-6.5);
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

        this.submit.on("pointerdown", () => {
            this.sound.play("selection");
            
        })
        this.menu.on("pointerdown", () => {
            this.sound.play("selection");
            this.scene.start("menuScene");
        })
        
        
    }

    update(){

    }

    textAreaChanged() {
        var text = this.formUtil.getTextAreaValue("area51");
        console.log(text);
    }

}