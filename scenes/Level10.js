class Level10 extends Phaser.Scene {
    constructor() {
        super({
            key: 'level10'
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
        this.cameras.main.fadeIn();
        //grup utk menyatukan 4 tombol kontrol
        this.panah = this.add.group();

        this.cameras.main.setRoundPixels(true);

        //tilemap dan pembagian layernya
        this.lvl1 = this.make.tilemap({key: 'lv10'});
        this.tiles = this.lvl1.addTilesetImage('landscape', 'landscapex');
        this.tiles2 = this.lvl1.addTilesetImage('roguelikeSheet_transparent', 'rogueLike');
        this.layer = this.lvl1.createDynamicLayer("00", [this.tiles, this.tiles2], 0, 0);
        this.layer2 = this.lvl1.createDynamicLayer("01", [this.tiles, this.tiles2], 0, 0);
        this.layer2.setSize(5,5);
        //this.objek = this.lvl1.getObjectLayer('objek_layer')['objects'];
        
        //collision / bertumbuk layer
        this.layer2.setCollisionByProperty({collides: true});

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
        this.terbang = this.anims.create({
            key: 'terbang',
            frames: this.anims.generateFrameNumbers('burung'),
            frameRate: 8,
            repeat: -1
        });

        this.orang = this.physics.add.sprite(795, 279, "char", 0);
        
        this.orang.body.setSize(10,14);
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
        this.burung = this.add.sprite(Math.random() * 800, -400, 'burung').setTint(0xec2049, 0xec2049, 0xf7db4f, 0x45ada8);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);

        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 800, 480);
        this.kiri = this.add.sprite(50, 220, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.bawah = this.add.sprite(50, 300, 'kontrol', 2).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.atas = this.add.sprite(550, 220, 'kontrol', 3).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.kanan = this.add.sprite(550, 300, 'kontrol', 1).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.panah.addMultiple([this.kiri, this.bawah, this.atas, this.kanan]);

        this.triggerDead = this.add.zone(400, 204, 16, 5).setOrigin(0);
        this.physics.add.existing(this.triggerDead);
        this.triggerDead.body.setImmovable();
        this.physics.add.collider(this.orang, this.triggerDead, () => {
            this.triggerDead.destroy();
            this.sengBoleLewat2.destroy();
            setTimeout(() => {
                this.cutScn.play();
                this.panah.setVisible(false);
                this.orang.setVelocity(0)
                this.orang.anims.stop();
            }, 60000);
        }, null, this);

        this.sengBoleLewat = this.add.zone(704, 60, 96, 5).setOrigin(0);
        this.physics.add.existing(this.sengBoleLewat);
        this.sengBoleLewat.body.setImmovable();
        this.physics.add.collider(this.orang, this.sengBoleLewat, () => {
            this.orang.anims.stop();
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
            })
            .start(this.dialog.lv10.d01, 50);
        }, null, this);

        this.sengBoleLewat2 = this.add.zone(300, 279, 5, 120).setOrigin(0);
        this.physics.add.existing(this.sengBoleLewat2);
        this.sengBoleLewat2.body.setImmovable();
        this.physics.add.collider(this.orang, this.sengBoleLewat2, () => {
            this.orang.anims.stop();
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
            })
            .start(this.dialog.lv10.d01, 50);
        }, null, this);

        this.kiri.on('pointerdown', () => {
            this.orang.setVelocityX(-30);
            this.orang.play('jalan');
        });

        this.kiri.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.bawah.on('pointerdown', () => {
            this.orang.setVelocityY(30);
            this.orang.play('jalan');
        });

        this.bawah.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.atas.on('pointerdown', () => {
            this.orang.setVelocityY(-30);
            this.orang.play('jalanAtas');
        });

        this.atas.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.kanan.on('pointerdown', () => {
            this.orang.setVelocityX(30);
            this.orang.play('jalan');
        });

        this.kanan.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.atas.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.ending = this.tweens.createTimeline();
        this.ending.add({
            targets: this.sengBoleLewat,
            y: this.sengBoleLewat.y,
            duration: 3000,
            onStart: () =>{
                cTexBox2(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv10.d02, 50);
            },
            onComplete: () => {
                cTexBox2(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv10.d03, 50);
            }
        });
        this.ending.add({
            delay: 5000,
            targets: this.sengBoleLewat,
            y: this.sengBoleLewat.y,
            duration: 6000,
            onStart: () => {
                cTexBox2(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv10.d04, 50);
            },
            onComplete: () => {
                this.orang.play("mati");
                this.tetesan.stop();
            }
        });
        this.ending.add({
            delay: 1000,
            targets: this.sengBoleLewat,
            y: this.sengBoleLewat.y,
            duration: 2000,
            onStart: () => {
                cTexBox2(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv10.d05, 50);
            }
        });
        this.ending.add({
            delay: 1000,
            targets: this.burung,
            x: 713,
            y: 0,
            duration: 5000,
            onStart: () => {
                this.cameras.main.fadeOut(3000);
            },
            onComplete: () => {
                console.log("mamama");
                this.scene.start("badending");
            }
        });

        this.burung.play('terbang');
        this.cutScn = this.tweens.add({
            targets: this.burung,
            x: 0,
            y: 0,
            ease: 'Circ.easeInOut',
            duration: 5000,
            paused: true,
            onComplete: () => {
                this.ending.play();
            }
        });

        this.animatedTiles.init(this.lvl1);
        
    }

    update() {
        if (this.cutScn.isPlaying()){
            this.cutScn.updateTo('x', this.orang.x, true);
            this.cutScn.updateTo('y', this.orang.y - 40, true);
        }

    }

}