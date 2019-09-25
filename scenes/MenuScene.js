class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'menuScene'
        });
    }

    preload() {
        this.progress = this.add.graphics();
        this.load.on('progress', (value) => {
            this.progress.clear();
            this.progress.fillStyle(0xffffff, 1);
            this.progress.fillRect(0, game.config.height * 0.75, game.config.width * value, 10);
        });
        this.load.on('complete', () => {
            this.progress.destroy();
        });
        
        this.load.image('bg', 'assets/bgMenu.png');
        this.load.audio('menuMusic', ['music/menuScene.mp3', 'music/menuScene.ogg']);
        this.load.audio('startGame', ['music/startGame.mp3', 'music/startGame.ogg']);
        this.load.bitmapFont('gem', 'assets/gem.png', 'assets/gem.xml');
        this.load.spritesheet('burung', 'assets/birdfly.png', {frameWidth: 16, frameHeight: 16});
    }
    
    create() {
        this.d = new Date();
        this.bg = this.add.image(game.config.width/2, 167, 'bg').setScale(1.2, 1.2);
        this.menuMusic = this.sound.add('menuMusic');
        this.menuMusic.play("", {
            loop: true
        });
        this.startSound = this.sound.add('startGame');
        this.terbang = this.anims.create({
            key: 'terbang',
            frames: this.anims.generateFrameNumbers('burung'),
            frameRate: 8,
            repeat: -1
        });
        this.burung = this.add.sprite(Phaser.Math.Between(-10, 510), 0, 'burung').setTint(0x0000ff, 0xffff00, 0x0000ff, 0xff0000);
        this.burung2 = this.add.sprite(0, Phaser.Math.Between(-10, 350, 'burung')).setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        this.ruteTerbang = this.tweens.createTimeline();
        this.ruteTerbang.loop = -1;
        this.ruteTerbang2 = this.tweens.createTimeline();
        this.ruteTerbang2.loop = -1;
        this.ruteTerbang.add({
            targets: this.burung,
            x: 200,
            y: 300,
            ease: 'Power1',
            duration: 4000,
            yoyo: true
        });
        this.ruteTerbang.add({
            targets: this.burung,
            x: 240,
            y: 10,
            ease: 'Power1',
            duration: 5000,
            yoyo: true
        });
        this.ruteTerbang.add({
            targets: this.burung,
            x: 0,
            y: 250,
            ease: 'Power1',
            duration: 5000,
            yoyo: true
        });
        this.ruteTerbang.add({
            targets: this.burung,
            x: 470,
            y: 10,
            ease: 'Power1',
            duration: 5000,
            yoyo: true
        });
        this.ruteTerbang.add({
            targets: this.burung,
            x: 20,
            y: 150,
            ease: 'Power1',
            duration: 5000,
            yoyo: true
        });
        
        this.ruteTerbang2.add({
            targets: this.burung2,
            x: 200,
            y: 300,
            ease: 'Power1',
            duration: 5000,
            yoyo: true
        });
        this.ruteTerbang2.add({
            targets: this.burung2,
            x: 240,
            y: 10,
            ease: 'Power1',
            duration: 5500,
            yoyo: true
        });
        this.ruteTerbang2.add({
            targets: this.burung2,
            x: 10,
            y: 320,
            ease: 'Power1',
            duration: 5500,
            yoyo: true
        });
        this.ruteTerbang2.add({
            targets: this.burung2,
            x: 490,
            y: 10,
            ease: 'Power1',
            duration: 5500,
            yoyo: true
        });
        this.ruteTerbang2.add({
            targets: this.burung2,
            x: 10,
            y: 150,
            ease: 'Power1',
            duration: 5500,
            yoyo: true
        });
        this.burung.play('terbang');
        this.burung2.play('terbang');
        this.ruteTerbang.play();
        this.ruteTerbang2.play();
        this.cp = this.add.bitmapText(10, 320, 'gem', "v1.0 \u00A9Pratama " + this.d.getFullYear(), 16).setCenterAlign();
        this.pergi = this.add.bitmapText(93, 130, 'gem', "Pergi", 20).setCenterAlign();
        this.pulau = this.add.bitmapText(310, 195, 'gem', "-Remote Island Edition-", 18).setCenterAlign();
        this.judul = this.add.bitmapText(game.config.width / 2, 170, 'gem', "Berobat Simulator", 50).setOrigin(0.5).setCenterAlign();
        this.mulai = this.add.dynamicBitmapText(game.config.width / 2, 265, 'gem', "Start Game", 30).setOrigin(0.5).setCenterAlign().setInteractive().setVisible(false);
        this.mulai.setDisplayCallback(this.getar);
        this.mulaiMuncul = this.time.addEvent({delay: 2500, callback: () => {this.mulai.setVisible(true)}, callbackScope: this});
        this.tweens.add({
          targets: this.judul,
          duration: 150,
          yoyo: true,
          repeat: -1,
          y: 173,
          //repeat: 1,
          ease: 'Bounce'
        });

        this.tweens.add({
            targets: this.bg,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Power1',
            x: Phaser.Math.Between(300, 308),
            y: Phaser.Math.Between(165, 175)
          });

        this.mulai.once('pointerdown', () => {
            this.menuMusic.stop();
            this.startSound.play();
            this.scene.start('level01');
        }, this);
    }

    getar(data) {
        data.x = Phaser.Math.Between(data.x - 0.5, data.x + 0.5);
        data.y = Phaser.Math.Between(data.y - 0.5, data.y + 0.5);
        return data;

    }

    update() {

    }

}
