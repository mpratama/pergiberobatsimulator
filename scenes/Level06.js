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

        //rexui plugin
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    asalNo(bil) {
        return Math.floor(Math.random() * bil);
    }

    create() {
        this.dialog = this.cache.json.get('dialogjson');
        this.mark1 = false;
        this.mark2 = false;
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

        this.terbang = this.anims.create({
            key: 'terbang',
            frames: this.anims.generateFrameNumbers('burung'),
            frameRate: 8,
            repeat: -1
        });

        this.orang = this.physics.add.sprite(this.objek[0].x, this.objek[0].y, "char", 0).setTint(0xffffff);
        this.orang.body.setSize(10,15);
        this.physics.world.setBounds(0, 0, 800, 480);
        this.orang.body.collideWorldBounds = true;
        this.darah = this.add.particles('darah');
        this.tetesan = this.darah.createEmitter({
            angle: {min: 160, max: 185},
            speed: 10,
            gravityY: 100,
            lifespan: {min: 300, max: 400},
            frequency: 170,
            scale: 1.5,
            follow: this.orang,
            followOffset: {
                x: 5,
                y: -1
            }
        });
        this.layer3 = this.lvl1.createStaticLayer("02", [this.tiles, this.tiles2], 0, -16);
        this.burung = this.add.sprite(700, 200, 'burung').setTint(0x0000ff, 0xffff00, 0x0000ff, 0xff0000);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);

        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 800, 480);
        this.kiri = this.add.sprite(50, 220, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.bawah = this.add.sprite(50, 300, 'kontrol', 2).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.atas = this.add.sprite(550, 220, 'kontrol', 3).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.kanan = this.add.sprite(550, 300, 'kontrol', 1).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.panah.addMultiple([this.kiri, this.bawah, this.atas, this.kanan]);

        //goToNextLevel
        this.zonLv = this.add.zone(0, 0, 1, 480).setOrigin(0);
        this.physics.add.existing(this.zonLv);
        this.zonLv.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonLv, () => {
            this.cameras.main.fadeOut(500);
            setTimeout(() => this.scene.start("level07"), 1000);
            localStorage.setItem("currentLevel", "level07");
        }, null, this);

        this.kiri.on('pointerdown', () => {
            this.orang.setVelocityX(-50);
            this.orang.play('jalan');
        });

        this.kiri.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.bawah.on('pointerdown', () => {
            this.orang.setVelocityY(50);
            this.orang.play('jalan');
        });

        this.bawah.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.atas.on('pointerdown', () => {
            this.orang.setVelocityY(-50);
            this.orang.play('jalanAtas');
        });

        this.atas.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.kanan.on('pointerdown', () => {
            this.orang.setVelocityX(50);
            this.orang.play('jalan');
        });

        this.kanan.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.burung.play('terbang');

        this.tml1 = this.tweens.createTimeline();
        this.tml1.add({
            delay: 500,
            targets: this.kiri,
            x: this.asalNo(600),
            y: this.asalNo(300),
            scale: 3,
            onStart: () => {
                this.orang.setTint(0x00FF00, 0x00FF00, 0xFFFFFF, 0xFFFFFF);
            },
            ease: 'Back.easeInOut',
            duration: 700
        });

        this.tml1.add({
            targets: this.kanan,
            x: this.asalNo(600),
            y: this.asalNo(300),
            scale: 3,
            ease: 'Back.easeInOut',
            duration: 700
        });

        this.tml1.add({
            targets: this.atas,
            x: this.asalNo(600),
            y: this.asalNo(300),
            scale: 3,
            ease: 'Back.easeInOut',
            duration: 700
        });

        this.tml1.add({
            targets: this.bawah,
            x: this.asalNo(600),
            y: this.asalNo(300),
            scale: 3,
            ease: 'Back.easeInOut',
            duration: 700,
            onComplete: () =>{
                this.tml2.play();
            }
        });

        this.tml2 = this.tweens.createTimeline();

        this.tml2.add({
            targets: this.kiri,
            x: 550,
            y: 300,
            scale: 1,
            ease: 'Bounce.easeInOut',
            duration: 700
        });

        this.tml2.add({
            targets: this.kanan,
            x: 50,
            y: 220,
            scale: 1,
            ease: 'Bounce.easeInOut',
            duration: 700
        });

        this.tml2.add({
            targets: this.atas,
            x: 50,
            y: 300,
            scale: 1,
            ease: 'Bounce.easeInOut',
            duration: 700
        });

        this.tml2.add({
            targets: this.bawah,
            x: 550,
            y: 225,
            scale: 1,
            ease: 'Bounce.easeInOut',
            duration: 700,
            onComplete: () => {
                for (var i = 0; i < this.panah.getLength(); i++){
                    this.panah.getChildren()[i].setInteractive();
                }
            }
        });

        this.animatedTiles.init(this.lvl1);
        
    }

    update() {
        if (this.mark1 == false && this.orang.x < 743){
            this.mark1 = true;
            this.orang.anims.stop();
            this.orang.setVelocity(0);
            for (var i = 0; i < this.panah.getLength(); i++){
                this.panah.getChildren()[i].disableInteractive();
            }
            this.tml1.play();
        }

        if (this.mark2 == false && this.orang.x < 677){
            this.mark2 = true;
            this.orang.anims.stop();
            this.orang.setVelocity(0);
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
            })
            .start(this.dialog.lv06.d01, 50);
        }
        
    }

}