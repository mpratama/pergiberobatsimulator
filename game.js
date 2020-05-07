samkijo();
//fungsi inisiasi levelsave, disimpan dalam localStorage
let curLevelCheck = function(){
   if (!localStorage.getItem("currentLevel")) {
       localStorage.setItem("currentLevel", "level01");
       localStorage.setItem("lv04-mark1", false);
       localStorage.setItem("lv05-mark1", false);
       localStorage.setItem("lv05-mark2", false);
   } 
}

const BLACK = 0x000000;
const RED = 0xff0000;
const WHITE = 0xffffff;
const BLUE = 0x0000ff;
const GREEN = 0x00ff00;
const COKLAT = 0xc8c8a9;
const YELLOW = 0xf7db4f;
const GetValue = Phaser.Utils.Objects.GetValue;
var createTextBox = function (scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    var bgColor = GetValue(config, 'warna', BLACK);
    var textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,

            background: scene.rexUI.add.roundRectangle(10, 5, 588, 80, 5, bgColor, 0.5),

            // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
            text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

            space: {
                left: 10,
                right: 10,
                top: 5,
                bottom: 5,
                text: 10,
            }
        })
        .setOrigin(0)
        .setScrollFactor(0)
        .layout();

    textBox
        .setInteractive()
        .on('pointerdown', function () {
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.typeNextPage();
            }
        }, textBox)
        .on('pageend', function () {
            if (this.isLastPage) {
                setTimeout(() => {
                    textBox.setVisible(false);
                    scene.panah.setVisible(true);
                }, 2000);
            }
        }, textBox)
    //.on('type', function () {
    //})

    return textBox;
}

var cTexBox2 = function (scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    var bgColor = GetValue(config, 'warna', BLACK);
    var textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,

            background: scene.rexUI.add.roundRectangle(10, 5, 588, 80, 5, bgColor, 0.5),

            // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
            text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

            space: {
                left: 10,
                right: 10,
                top: 5,
                bottom: 5,
                text: 10,
            }
        })
        .setOrigin(0)
        .setScrollFactor(0)
        .layout();

    textBox
        .setInteractive()
        .on('pointerdown', function () {
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.typeNextPage();
            }
        }, textBox)
        .on('pageend', function () {
            if (this.isLastPage) {
                setTimeout(() => {
                    textBox.setVisible(false);
                }, 2000);
            }
        }, textBox)
    //.on('type', function () {
    //})

    return textBox;
}

var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,
        fontFamily: 'Arial',
        fontSize: '18px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3
    })
}


//game config
let config = {
    width: 608,
    height: 342,
    //backgroundColor: 0x000000,
    url: "yesbesoklibur.com",
    version: "1.0",
    title: "Pergi Berobat Simulator",
    render: {
        pixelArt: true,
        powerPreference: "low-power"
    },
    scene: [BootScene, MenuScene, Level01, Level02, Level03, Level04, Level05, Level06, Level07, Level08, Level09, Level10, Level10b, BadEndingCredit],
    physics: {
        default: "arcade",
        arcade: {
            fps: 60,
            debug: false //set false jika siap production
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    }
}

//Phase init
let game = new Phaser.Game(config);

// mengecek Baru mulai game atau sudah pernah bermain sebelumnya
curLevelCheck();
game._CURRLEVEL = localStorage.getItem("currentLevel");
game._BPJSCARD = localStorage.getItem("kartuBPJS");

// ular speed randomizer
let ularSpd = [-30, 30, -35, 35, -40, 40,];
let pariSpd = [-200,200,-230,230,-260,260];

let randUlarSpd = function(){
    return ularSpd[Math.floor(Math.random() * ularSpd.length)];
}

let randPariSpd = function(){
    return pariSpd[Math.floor(Math.random() * pariSpd.length)];
}

let getUlarSpd = function(ularSprite){
    var r = randUlarSpd();
    var rd1 = [1.5, 4.7]
    var rd2 = [0, 3.14]
    var ul = Math.floor(Math.random() * 2);
    ularSprite.setVelocity(0);
    if (ul == 0){
        ularSprite.setVelocityX(r);
        ularSprite.setRotation(rd1[Math.floor(Math.random() * rd1.length)]);
    }
    else {
        ularSprite.setVelocityY(r);
        ularSprite.setRotation(rd2[Math.floor(Math.random() * rd2.length)]);
    }
}

let getPariSpd = function(pariSprite){
    var r = randPariSpd();
    var rd1 = [1.5, 4.7]
    var rd2 = [0, 3.14]
    var ul = Math.floor(Math.random() * 2);
    //pariSprite.setVelocity(0);
    if (ul == 0){
        pariSprite.setVelocityX(r);
        pariSprite.setRotation(rd1[Math.floor(Math.random() * rd1.length)]);
    }
    else {
        pariSprite.setVelocityY(r);
        pariSprite.setRotation(rd2[Math.floor(Math.random() * rd2.length)]);
    }
}