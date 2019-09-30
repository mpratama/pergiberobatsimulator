let curLevelCheck = function(){
   if (!localStorage.getItem("currentLevel")) {
       localStorage.setItem("currentLevel", "level01");
   } 
}

let config = {
    width: 608,
    height: 342,
    //backgroundColor: 0x000000,
    url: "yesbesoklibur.com",
    version: "1.0",
    title: "Pergi Berobat Simulator",
    pixelArt: true,
    scene: [BootScene, MenuScene, Level01, AnimasiTweenScene],
    physics: {
        default: "arcade",
        arcade: {
            fps: 60
            //debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    }
}
let game = new Phaser.Game(config);
let line = "";
let index = 0;

curLevelCheck();
game._CURRLEVEL = localStorage.getItem("currentLevel");