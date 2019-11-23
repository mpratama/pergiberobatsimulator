//fungsi inisiasi levelsave, disimpan dalam localStorage
let curLevelCheck = function(){
   if (!localStorage.getItem("currentLevel")) {
       localStorage.setItem("currentLevel", "level01");
   } 
}

//game config
let config = {
    width: 608,
    height: 342,
    //backgroundColor: 0x000000,
    url: "yesbesoklibur.com",
    version: "1.0",
    title: "Pergi Berobat Simulator",
    pixelArt: true,
    scene: [BootScene, MenuScene, Level01, Level02, Level03, Level04],
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

// variabel untuk isi dialog, index huruf, warna teks dialog
let line = "";
let index = 0;
const RED = 0xff0000;
const WHITE = 0xffffff;
const BLUE = 0x0000ff;
const GREEN = 0x00ff00;

// mengecek Baru mulai game atau sudah pernah bermain sebelumnya
curLevelCheck();
game._CURRLEVEL = localStorage.getItem("currentLevel");
game._BPJSCARD = localStorage.getItem("kartuBPJS");

//function ini berfungsi utk dicallback dengan nextLine function, panggil dari nextLine
let updateLine = function(scene, teks){
    if (line.length < teks[index].length) {
        line = teks[index].substr(0, line.length + 1);
        scene.dialogBox.setText(line);
    }
    else {
        scene.time.addEvent({
            delay: 1500,
            callback: nextLine,
            callbackScope: scene,
            args: [scene, teks]
        });
        index++;
    }
}

//function untuk dialog teks utk dipanggil di masing2 scene, masukkan argumentnya ya
//argumennnya:  scene => scene mana yg mau gunakan, isi dgn this
//              teks => teks dalam bentuk array misal ["Indonesia raya!\nMerdeka!\nMerdeka!"]
//              wkt => delay muncul tiap huruf dalam ms
//              tint => warna teks (RED, GREEN, BLUE, default WHITE)
let nextLine = function(scene, teks, wkt, tint){
    let wktu = wkt;
    let dialogBoxTint = tint;
    if (typeof(tint) === "undefined") dialogBoxTint = WHITE;
    scene.dialogBox.setTint(dialogBoxTint);
    if (typeof(wkt) === "undefined") wktu = 30;
    let panahan = scene.panah.getChildren();
    for (let i in panahan) {
        panahan[i].setVisible(false);
    }
    scene.kotak.setVisible(true);
    scene.orang.anims.stop();
    if (index < teks.length){
        line = "";
        scene.time.addEvent({
            repeat: teks[index].length,
            delay: wktu,
            callback: updateLine,
            callbackScope: scene,
            args: [scene, teks]
            });
        }
    else {
        scene.kotak.setVisible(false);
        line = "";
        scene.dialogBox.setText("");
        index = 0;
        scene.panah.toggleVisible();
        }
}