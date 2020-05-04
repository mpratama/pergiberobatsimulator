class Level09 extends Phaser.Scene {
    constructor() {
        super({
            key: 'level09'
        });
    }

    preload() {
        //plugin animated tiles
        this.load.scenePlugin({
            key: 'AnimatedTiles',
            url: 'AnimatedTiles.min.js',
            systemKey: 'animatedTiles',
            sceneKey: 'animatedTiles'
        });

        //rexui plugin
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }
    
    create() {
        this.dialog = this.cache.json.get('dialogjson');
        this.mark0 = 0;
        this.cameras.main.fadeIn();
        this.dialog = this.cache.json.get('dialogjson');
        
        //grup utk menyatukan 4 tombol kontrol
        this.panah = this.add.group();
        this.cameras.main.setRoundPixels(true);

        //tilemap dan pembagian layernya
        this.lvl1 = this.make.tilemap({key: 'lv09'});
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
            frameRate: 6,
            repeat: -1,
        });

        this.animasiJalanPelan = this.anims.create({
            key: 'jalanPelan',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [1, 2]
            }),
            frameRate: 4,
            repeat: -1,
        });

        this.animasiJalanAtas = this.anims.create({
            key: 'jalanAtas',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [3, 4]
            }),
            frameRate: 6,
            repeat: -1,
        });

        this.terbang = this.anims.create({
            key: 'terbang',
            frames: this.anims.generateFrameNumbers('burung'),
            frameRate: 8,
            repeat: -1
        });

        this.orang = this.physics.add.sprite(this.objek[0].x, 247, "char", 0).setTint(0x00FF00, 0x00FF00, 0xFFFFFF, 0xFFFFFF);
        this.orang.body.setSize(10,15);
        this.physics.world.setBounds(0, 0, 800, 480);
        this.orang.body.collideWorldBounds = true;
        this.darah = this.add.particles('darah');
        this.tetesan = this.darah.createEmitter({
            angle: {min: 160, max: 185},
            speed: 10,
            gravityY: 100,
            lifespan: {min: 300, max: 400},
            frequency: 500,
            scale: 1.5,
            follow: this.orang,
            followOffset: {
                x: 5,
                y: -1
            }
        });
        this.layer3 = this.lvl1.createDynamicLayer("02", [this.tiles, this.tiles2], 0, -16);
        this.burung = this.add.sprite(1000, 210, 'burung').setTint(0xec2049, 0xec2049, 0xf7db4f, 0x45ada8);
        this.buah = this.physics.add.image(585, 214, 'buah').setScale(2).setTint(0xff0000, 0xffffff, 0xff0000, 0xff0000).setAlpha(0);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);
        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 800, 480);
        this.kiri = this.add.sprite(50, 220, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.kiri2 = this.add.sprite(50, 220, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0).setVisible(false);
        this.bawah = this.add.sprite(50, 300, 'kontrol', 2).setInteractive().setAlpha(0.5).setScrollFactor(0).setVisible(false);
        this.atas = this.add.sprite(550, 220, 'kontrol', 3).setInteractive().setAlpha(0.5).setScrollFactor(0).setVisible(false);
        this.kanan = this.add.sprite(550, 300, 'kontrol', 1).setInteractive().setAlpha(0.5).setScrollFactor(0).setVisible(false);
        this.panah.addMultiple([this.kiri2, this.bawah, this.atas, this.kanan]);

        //goToNextLevel
        this.zonLv = this.add.zone(0, 0, 1, 480).setOrigin(0);
        this.physics.add.existing(this.zonLv);
        this.zonLv.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonLv, () => {
            this.cameras.main.fadeOut(500);
            localStorage.setItem("currentLevel", "level10");
            setTimeout(() => this.scene.start("level10"), 1000);
        }, null, this);

        this.burung.anims.play('terbang');

        this.kiri.on('pointerdown', () => {
            this.orang.setVelocityX(-5);
            this.orang.play('jalanPelan');
        });

        this.kiri.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.kiri2.on('pointerdown', () => {
            this.orang.setVelocityX(-35);
            this.orang.play('jalan');
        });

        this.kiri2.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.bawah.on('pointerdown', () => {
            this.orang.setVelocityY(35);
            this.orang.play('jalan');
        });

        this.bawah.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.atas.on('pointerdown', () => {
            this.orang.setVelocityY(-35);
            this.orang.play('jalanAtas');
        });

        this.atas.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.kanan.on('pointerdown', () => {
            this.orang.setVelocityX(35);
            this.orang.play('jalan');
        });

        this.kanan.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });
        this.physics.add.overlap(this.orang, this.buah, () => {
            this.kiri.setVisible(false);
            this.orang.setVelocity(0);
            this.orang.anims.stop();
            this.buah.destroy();
            this.orang.clearTint();
            this.panah.setVisible(true);
        }, null, this);

        this.tml = this.tweens.createTimeline();
        this.tml.add({
            targets: this.burung,
            x: 585,
            duration: 3000,
            ease: 'Power1'
        });
        this.tml.add({
            targets: this.buah,
            onStart: () => {
                cTexBox2(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv09.d01, 50);
            },
            alpha: 1,
            duration: 3000
        });
        this.tml.add({
            targets: this.buah,
            y: 250,
            duration: 1000,
            ease: 'Bounce'
        });
        this.tml.add({
            targets: this.burung,
            x: 584,
            duration: 1000,
            ease: 'Power1',
        });
        this.tml.add({
            targets: this.burung,
            x: -10,
            duration: 5000,
            ease: 'Power1',
            onComplete: () => {
                this.burung.destroy();
                this.kiri.setVisible(true);
            }
        });

        this.animatedTiles.init(this.lvl1);
        
    }

    update() {
        if (this.orang.x <= 635 && this.mark0 == 0){
            this.mark0 += 1;
            this.tml.play();
            this.kiri.setVisible(false);
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        }
        
    }

}
