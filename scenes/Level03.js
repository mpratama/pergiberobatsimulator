class Level03 extends Phaser.Scene {
    constructor() {
        super({
            key: 'level03'
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
        this.mark1 = false;
        this.cameras.main.fadeIn();
        
        //grup utk menyatukan 4 tombol kontrol
        this.panah = this.add.group();
        this.cameras.main.setRoundPixels(true);

        //tilemap dan pembagian layernya
        this.lvl1 = this.make.tilemap({key: 'lv03'});
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

        this.orang = this.physics.add.sprite(152, this.objek[0].y, "char", 0).setTint(0xffffff);
        this.orang.body.setSize(10,15);
        this.physics.world.setBounds(0, 0, 608, 9600);
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
        this.finish = this.add.dynamicBitmapText(130, 150, 'gem', "Finish diatas sini!", 40).setCenterAlign().setAlpha(0.8);
        this.finish.setDisplayCallback(this.getar);
        //this.mulai = this.add.dynamicBitmapText(game.config.width / 2, 265, 'gem', this.startText, 30).setOrigin(0.5).setCenterAlign().setInteractive().setVisible(false);
        this.burung = this.add.sprite(168, 9505, 'burung').setTint(0xec2049, 0xec2049, 0xf7db4f, 0x45ada8);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);

        this.cameras.main.scrollY = 9258;
        this.cameras.main.setBounds(0, 0, 608, 9600);
        this.kiri = this.add.sprite(50, 220, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.bawah = this.add.sprite(50, 300, 'kontrol', 2).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.atas = this.add.sprite(550, 220, 'kontrol', 3).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.kanan = this.add.sprite(550, 300, 'kontrol', 1).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.panah.addMultiple([this.kiri, this.bawah, this.atas, this.kanan]);

        /* // Plang template
        this.plang01 = this.add.zone(297, 617, 15, 15);
        this.physics.add.existing(this.plang01);
        this.plang01.body.setImmovable();
        this.physics.add.collider(this.orang, this.plang01, () => {
            console.log("teks");
        }, null, this); */

        //goToNextLevel
        this.zonLv = this.add.zone(296, -1, 592, 8);
        this.physics.add.existing(this.zonLv);
        this.zonLv.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonLv, () => {
            this.cameras.main.fadeOut(500);
            setTimeout(() => this.scene.start("level04"), 1000);
            localStorage.setItem("currentLevel", "level04");
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
            y: 9510,
            yoyo: true,
            ease: 'Power1',
            repeat: -1,
            duration: 500
        });

        this.cutScn1 = this.tweens.createTimeline();
        this.cutScn1.add({
            targets: this.cameras.main,
            scrollY: 9258,
            duration: 3000,
            onStart: () => {
                this.orang.setVelocity(0);
                this.orang.anims.stop();
                this.panah.setVisible(false);
                cTexBox2(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv03.d01, 50);
            },
            onComplete: () => {
                cTexBox2(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv03.d02, 50);
            }
        });
        this.cutScn1.add({
            delay: 5000,
            targets: this.cameras.main,
            scrollY: 9258,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv03.d03, 50);
            }
        });
        this.cutScn1.add({
            delay: 1000,
            targets: this.cameras.main,
            scrollY: 0,
            duration: 4000,
            ease: 'Power1',
        });
        this.cutScn1.add({
            delay: 3000,
            targets: this.cameras.main,
            scrollY: 9258,
            duration: 4000,
            ease: 'Power1',
        });
        this.cutScn1.add({
            delay: 2000,
            targets: this.cameras.main,
            scrollY: 9258,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv03.d04, 50);
            }
        });
        this.cutScn1.add({
            delay: 2000,
            targets: this.burung,
            x: 300,
            y: 9000,
            duration: 2000,
            ease: 'Power1',
            onComplete: () => {
                this.burung.destroy();
                this.finish.destroy();
                this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
                this.panah.setVisible(true);
            }
        });

        this.animatedTiles.init(this.lvl1);
        
    }

    getar(data) {
        data.x = Phaser.Math.Between(data.x - 1, data.x + 1);
        data.y = Phaser.Math.Between(data.y - 1, data.y + 1);
        return data;

    }

    update() {
        if (this.mark1 == false && this.orang.y < 9542){
            this.cutScn1.play();
            this.mark1 = true;
        }
        
    }

}
