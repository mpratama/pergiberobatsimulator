class Level06 extends Phaser.Scene {
    constructor() {
        super({
            key: 'level06'
        });
    }

    preload() {
        
        this.load.scenePlugin({
            key: 'AnimatedTiles',
            url: 'AnimatedTiles.min.js',
            systemKey: 'animatedTiles',
            sceneKey: 'animatedTiles'
        });
    }

    asalNo(bil) {
        return Math.floor(Math.random() * bil);
    }
    
    create() {
        this.cameras.main.fadeIn();
        //grup utk menyatukan 4 tombol kontrol
        this.panah = this.add.group();

        this.cameras.main.setRoundPixels(true);

        //tilemap dan pembagian layernya
        this.lvl1 = this.make.tilemap({key: 'lv06'});
        this.tiles = this.lvl1.addTilesetImage('landscape', 'landscapex');
        this.tiles2 = this.lvl1.addTilesetImage('roguelikeSheet_transparent', 'rogueLike');
        this.layer = this.lvl1.createDynamicLayer("00", [this.tiles, this.tiles2], 0, 0);
        this.layer2 = this.lvl1.createDynamicLayer("01", [this.tiles, this.tiles2], 0, 0);
        this.objek = this.lvl1.getObjectLayer('objek_layer')['objects'];
        
        //collision / bertumbuk layer
        this.layer2.setCollisionByProperty({collides: true});

        //animasi jalan player
        this.animasiJalan = this.anims.create({
            key: 'jalan',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [1, 2]
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.animasiJalanAtas = this.anims.create({
            key: 'jalanAtas',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [3, 4]
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.orang = this.physics.add.sprite(this.objek[0].x, this.objek[0].y, "char", 0).setTint(0xffffff);
        this.orang.body.setSize(10,15);
        this.physics.world.setBounds(0, 0, 800, 480);
        this.orang.body.collideWorldBounds = true;
        this.layer3 = this.lvl1.createStaticLayer("02", [this.tiles, this.tiles2], 0, -16);
        this.kotak = this.add.graphics().fillStyle(0x000000, 1).fillRect(10, 5, 588, 80).setScrollFactor(0).setVisible(false);
        this.dialogBox = this.add.bitmapText(20, 10,"gem", "", 17).setScrollFactor(0);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);

        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 800, 480);
        this.kiri = this.add.sprite(50, 220, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.bawah = this.add.sprite(50, 300, 'kontrol', 2).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.atas = this.add.sprite(550, 220, 'kontrol', 3).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.kanan = this.add.sprite(550, 300, 'kontrol', 1).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.panah.addMultiple([this.kiri, this.bawah, this.atas, this.kanan]);

        //goToNextLevel
        this.zonLv = this.add.zone(-5, 60, 16, 128);
        this.physics.add.existing(this.zonLv);
        this.zonLv.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonLv, () => {
            this.cameras.main.fadeOut(500);
            setTimeout(() => this.scene.start("level07"), 1000);
        }, null, this);

        this.kiri.on('pointerdown', () => {
            this.orang.setVelocityX(-60);
            this.orang.play('jalan');
        });

        this.kiri.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.bawah.on('pointerdown', () => {
            this.orang.setVelocityY(60);
            this.orang.play('jalan');
        });

        this.bawah.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.atas.on('pointerdown', () => {
            this.orang.setVelocityY(-60);
            this.orang.play('jalanAtas');
        });

        this.atas.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.kanan.on('pointerdown', () => {
            this.orang.setVelocityX(60);
            this.orang.play('jalan');
        });

        this.kanan.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.tml1 = this.tweens.createTimeline();
        this.tml1.add({
            targets: this.kiri,
            x: this.asalNo(600),
            y: this.asalNo(300),
            scale: 3,
            ease: 'Back.easeInOut',
            duration: 1000
        });

        this.tml1.add({
            targets: this.kanan,
            x: this.asalNo(600),
            y: this.asalNo(300),
            scale: 3,
            ease: 'Back.easeInOut',
            duration: 1000
        });

        this.tml1.add({
            targets: this.atas,
            x: this.asalNo(600),
            y: this.asalNo(300),
            scale: 3,
            ease: 'Back.easeInOut',
            duration: 1000
        });

        this.tml1.add({
            targets: this.bawah,
            x: this.asalNo(600),
            y: this.asalNo(300),
            scale: 3,
            ease: 'Back.easeInOut',
            duration: 1000
        });

        this.tml2 = this.tweens.createTimeline();

        this.tml2.add({
            targets: this.kiri,
            x: 550,
            y: 300,
            scale: 1,
            ease: 'Bounce.easeInOut',
            duration: 1000
        });

        this.tml2.add({
            targets: this.kanan,
            x: 50,
            y: 220,
            scale: 1,
            ease: 'Bounce.easeInOut',
            duration: 1000
        });

        this.tml2.add({
            targets: this.atas,
            x: 50,
            y: 300,
            scale: 1,
            ease: 'Bounce.easeInOut',
            duration: 1000
        });

        this.tml2.add({
            targets: this.bawah,
            x: 550,
            y: 225,
            scale: 1,
            ease: 'Bounce.easeInOut',
            duration: 1000
        });

        this.anem = this.tweens.createTimeline();

        this.anem.add({
            targets: this.orang,
            x: 757,
            duration: 5000,
            onStart: () => {
                this.orang.play('jalan');
            },
            onComplete: () => {
                this.orang.anims.stop();
            }
        });

        this.anem.add({
            targets: this.orang,
            y: 215,
            duration: 3000,
            onStart: () => {
                this.orang.play('jalanAtas');
            },
            onComplete: () => {
                this.orang.anims.stop();
            }
        });

        this.darah = this.add.particles('darah');
        this.tetesan = this.darah.createEmitter({
            angle: {min: 160, max: 185},
            speed: 10,
            gravityY: 100,
            lifespan: {min: 400, max: 500},
            frequency: 170,
            scale: 1.5,
            follow: this.orang,
            followOffset: {
                x: 5,
                y: 4
            }
        });

        this.animatedTiles.init(this.lvl1);
        
    }

    update() {
        //this.tetesan.x.propertyValue = this.orang.x + 5;
        //this.tetesan.y.propertyValue = this.orang.y + 3;
        
    }

}