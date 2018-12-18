class Menu extends Phaser.Scene {

    constructor() {
        super('Menu');

        this.active;
        this.currentScene;

        this.menubg;
    }

    preload() {
        this.load.image('Menu', 'assets/mainmenu.png');
        this.load.image('button', 'assets/playbutton.png');
    }

    create() {

        let menubg = this.add.sprite(0, 0, 'Menu');
        let button = this.add.sprite(25, 500, 'button');

        menubg.setOrigin(0, 0);
        button.setOrigin(0, 0);

        button.setInteractive();
        button.on('pointerdown', () => this.scene.start('Game'));
        /*button.on('pointerdown', () => menu_music.stop());  */
    }
}




class gameoverScene extends Phaser.Scene {

    constructor() {
        super('gameoverScene');

        this.active;
        this.currentScene;

        this.menubg;
    }

    preload() {
        this.load.image('gameoverScene', 'assets/gameOverScene.png');
        this.load.image('button', 'assets/playbutton.png');
    }

    create() {

        let menubg2 = this.add.sprite(0, 0, 'gameoverScene');
        let button = this.add.sprite(25, 500, 'button');

        menubg2.setOrigin(0, 0);
        button.setOrigin(0, 0);

        button.setInteractive();
        button.on('pointerdown', () => this.scene.start('Game'));

    }
}




//creating a new scene   
let gameScene = new Phaser.Scene('Game');

//configuring window size and applying physics
let config = {
    type: Phaser.AUTO,
    width: 375,
    height: 667,
    scene: [Menu, gameScene, gameoverScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000
            },
            debug: false
        }
    },
};

let game = new Phaser.Game(config);
//somr paramaters
gameScene.init = function () {
    this.enemyMaxX = -30;
    this.enemyMinX = 450;
    this.maxY = 600;

}


//Function where all assets are loaded 
gameScene.preload = function () {


    //loading bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0xDAA520, 0.8);
    progressBox.fillRect(100, 270, 200, 50);
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Get Ready!',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
            //assetText.setText('Loading asset: ' + file.key);    
        }
    });
    assetText.setOrigin(0.5, 0.5);
    this.load.on('progress', function (value) {
        console.log(value);
        progressBar.clear();
        progressBar.fillStyle(0xFFD700, 1);
        progressBar.fillRect(100, 280, 200 * value, 30);
        percentText.setText(parseInt(value * 100) + '%');
    });
    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
    });
    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });
    loadingText.setOrigin(0.5, 0.5);
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(100, 270, 200, 50);
    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);


    //this is where all my images are loaded 
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/Hearts.png');

    //audio for my game 
    this.load.audio('theme', 'Audio/Gmusic.mp3');
}

var score = 0;


//function in where I can output all my pre loaded images onto the window
gameScene.create = function () {

    //declaring a var to play my music 
    soundName = this.sound.add('theme');
    soundName.play();



    //adding the background
    let bg = this.add.sprite(0, 0, 'background');
    bg.setOrigin(0, 0);
    this.isPlayerAlive = true;


    //add player/physics
    player = this.physics.add.sprite(175, 400, 'player').setScale(1);
    player.setCollideWorldBounds(true);


    //adding the group of enemies
    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 4,
        setXY: {
            x: 350,
            y: 50,
            stepX: 0,
            stepY: 150
        }
    });


    //scales down enemies as they are very big 
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.80, -0.80);


    // set speeds
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        enemy.speed = -5;
    }, this);


    this.isPlayerAlive = true;
    this.cameras.main.resetFX();

    scoreText = this.add.text(150, 100, 'score:0', {
        fontsize: '25',
        fill: '#ffffff'
    });

    /* timer = this.time.addEvent({
     delay: 820,
     loop: true,
     callback: scoreCounter,
     callbackScope: this

 });*/

} //ending of create



gameScene.getScore = function () {

    score = score + 1;
    scoreText.setText('Score: ' + score);
}




//function that handles all gameplay functions as it runs 60 times a second
gameScene.update = function () {




    //checks to see if player is alive
    if (!this.isPlayerAlive) {

        return;

    }




    //touch input
    if (this.input.activePointer.isDown) {
        player.body.velocity.y = -300;

    }


    //death occurs when player hits ground as well as enemies
    if (player.body.velocity.y == 0) {
        this.gameOver();
    }



    // enemy movement and collision
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;


    // move enemies
    for (let i = 0; i < numEnemies; i++) {


        enemies[i].x += enemies[i].speed;


        if (enemies[i].x == this.enemyMaxX) {
            enemies[i].x = this.enemyMinX;
        }


        //collision detection
        if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), enemies[i].getBounds())) {
            this.gameOver();
            break;
        }

        if (this.enemies.x = 150) {
            gameScene.getScore();
        }


    }
} //update ending




/*this.scoreText.setText("Score:" + score);
console.log(score)*/





//end of our scene ,stops music and restarts the scene
gameScene.gameOver = function () {
    this.isPlayerAlive = false;
    soundName.destroy();
    this.scene.start('gameoverScene');

}
