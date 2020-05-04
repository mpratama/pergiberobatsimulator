class Level04 extends Phaser.Scene {
    constructor() {
        super({
            key: 'level04'
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
        this.mark1 = JSON.parse(localStorage.getItem("lv04-mark1"));
        this.mark2 = false;
        this.dialog = this.cache.json.get('dialogjson');
        this.cameras.main.fadeIn();
        //grup utk menyatukan 4 tombol kontrol
        this.panah = this.add.group();

        this.cameras.main.setRoundPixels(true);

        //tilemap dan pembagian layernya
        this.lvl1 = this.make.tilemap({key: 'lv04'});
        this.tiles = this.lvl1.addTilesetImage('landscape', 'landscapex');
        this.tiles2 = this.lvl1.addTilesetImage('roguelikeSheet_transparent', 'rogueLike');
        this.layer = this.lvl1.createDynamicLayer("00", [this.tiles, this.tiles2], 0, 0);
        this.snake1 = this.physics.add.sprite(578, 221, 'ular', 0).setSize(7,12);
        this.snake2 = this.physics.add.sprite(420, 410, 'ular', 0).setSize(7,12);
        this.snake3 = this.physics.add.sprite(200, 452, 'ular', 0).setSize(7,12);
        this.snake4 = this.physics.add.sprite(67, 287, 'ular', 0).setSize(7,12);
        this.snake5 = this.physics.add.sprite(106, 82, 'ular', 0).setSize(7,12);
        this.snake6 = this.physics.add.sprite(386, 290, 'ular', 0).setSize(7,12);
        this.snake7 = this.physics.add.sprite(532, 67, 'ular', 0).setSize(7,12);
        this.snakeGroup = this.add.group([this.snake1,this.snake2,this.snake3,this.snake4,this.snake5,this.snake6,this.snake7]);
        this.layer2 = this.lvl1.createDynamicLayer("01", [this.tiles, this.tiles2], 0, 0);
        this.objek = this.lvl1.getObjectLayer('objek_layer')['objects'];
        
        //collision / bertumbuk layer
        this.layer2.setCollisionByProperty({collides: true});

        //animasi player mati
        this.animasiMati = this.anims.create({
            key: 'mati',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [13, 12]
            }),
            frameRate: 2,
        });

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

        this.animular = this.anims.create({
            key: 'ular',
            frames: this.anims.generateFrameNumbers('ular', {
                frames: [0,1,2,3]
            }),
            frameRate: 3,
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
        this.burung = this.add.sprite(600, 415, 'burung').setTint(0xec2049, 0xec2049, 0xf7db4f, 0x45ada8);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);

        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 800, 480);
        this.kiri = this.add.sprite(50, 220, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.bawah = this.add.sprite(50, 300, 'kontrol', 2).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.atas = this.add.sprite(550, 220, 'kontrol', 3).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.kanan = this.add.sprite(550, 300, 'kontrol', 1).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.panah.addMultiple([this.kiri, this.bawah, this.atas, this.kanan]);

        // pd masing2 ular: play anim, set bounce, set collide world bounds
        for (var i = 0; i < this.snakeGroup.getLength(); i++){
            this.snakeGroup.getChildren()[i].play('ular');
            this.snakeGroup.getChildren()[i].setBounce(0.9,0.9);
            this.snakeGroup.getChildren()[i].setCollideWorldBounds(true);
        }

        //this.ulhbox1 = this.add.rectangle(560, 190, 95, 95).setStrokeStyle(1,0x000000,1).setOrigin(0);
        this.ulbox1 = new Phaser.Geom.Rectangle(560, 190, 95, 95);
        this.snake1.body.setBoundsRectangle(this.ulbox1);
        
        this.ulbox2 = new Phaser.Geom.Rectangle(400, 350, 95, 100);
        this.snake2.body.setBoundsRectangle(this.ulbox2);

        this.ulbox3 = new Phaser.Geom.Rectangle(183, 418, 193, 55);
        this.snake3.body.setBoundsRectangle(this.ulbox3);

        this.ulbox4 = new Phaser.Geom.Rectangle(31, 256, 99, 64);
        this.snake4.body.setBoundsRectangle(this.ulbox4);

        this.ulbox5 = new Phaser.Geom.Rectangle(64, 61, 95, 34);
        this.snake5.body.setBoundsRectangle(this.ulbox5);

        this.ulbox6 = new Phaser.Geom.Rectangle(336, 273, 96, 39);
        this.snake6.body.setBoundsRectangle(this.ulbox6);

        this.ulbox7 = new Phaser.Geom.Rectangle(481, 21, 94, 70);
        this.snake7.body.setBoundsRectangle(this.ulbox7);

        //goToNextLevel
        this.zonLv = this.add.zone(0, 0, 1, 128).setOrigin(0);
        this.physics.add.existing(this.zonLv);
        this.zonLv.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonLv, () => {
            this.cameras.main.fadeOut(500);
            localStorage.setItem("currentLevel", "level05");
            setTimeout(() => this.scene.start("level05"), 1000);
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

        this.burung.play('terbang');
        this.tweens.add({
            targets: this.burung,
            y: 417,
            yoyo: true,
            ease: 'Power1',
            repeat: -1,
            duration: 500
        });

        this.cutScn1 = this.tweens.createTimeline();
        this.cutScn1.add({
            delay: 1000,
            targets: this.burung,
            x: -10,
            y: 70,
            duration: 3000,
            ease: 'Power1',
            onComplete: () => {
                this.burung.destroy();
            }
        });

        // menjalankan anim & delay tiap ular
        for (var i = 0; i < this.snakeGroup.getLength(); i++){
            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: getUlarSpd,
                args: [this.snakeGroup.getChildren()[i]],
                callbackScope: this,
            });
        }

        this.death = this.physics.add.overlap(this.orang, this.snakeGroup, () => {
            this.cameras.main.flash(700, 255, 0, 0);
            this.orang.setVelocity(0);
            this.panah.setVisible(false);
            this.orang.play('mati');
            this.death.active = false;
            this.tetesan.stop();
            localStorage.setItem("lv04-mark1", true);
            setTimeout(() => this.scene.start("level04"), 3000);
        }, null, this);

        this.animatedTiles.init(this.lvl1);
    }

    update() {
        if (this.mark1 == false && this.orang.y < 425){
            this.mark1 = true;
            this.orang.setVelocity(0);
            this.orang.anims.stop();
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
                warna: YELLOW,
            })
            .start(this.dialog.lv04.d01, 50);
        }

        if (this.orang.x <= 235 && this.orang.x >= 229 && this.orang.y < 87 && this.mark2 == false){
            this.cutScn1.play();
            this.mark2 = true;
        }
        
    }

}