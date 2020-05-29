class GoodEndingCredit extends Phaser.Scene {
    constructor() {
        super({
            key: 'goodending'
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
        this.lvl1 = this.make.tilemap({key: 'gdend'});
        this.tiles = this.lvl1.addTilesetImage('landscape', 'landscapex');
        this.tiles2 = this.lvl1.addTilesetImage('roguelikeSheet_transparent', 'rogueLike');
        this.layer = this.lvl1.createDynamicLayer("00", [this.tiles, this.tiles2], 0, 0);
        this.layer2 = this.lvl1.createDynamicLayer("01", [this.tiles, this.tiles2], 0, 0);
        this.objek = this.lvl1.getObjectLayer('objek_layer')['objects'];
        this.layer2.setCollisionByProperty({collides: true});

        this.animasiJalan = this.anims.create({
            key: 'jalan',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [1, 2]
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.animasiNgampak = this.anims.create({
            key: 'ngampak',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [10, 11]
            }),
            frameRate: 2,
            repeat: -1,
        });

        this.terbang = this.anims.create({
            key: 'terbang',
            frames: this.anims.generateFrameNumbers('burung'),
            frameRate: 8,
            repeat: -1
        });

        this.orang = this.physics.add.sprite(340, -10, "char", 0);

        this.layer3 = this.lvl1.createStaticLayer("02", [this.tiles, this.tiles2], 0, 0);
        //this.cameras.main.fadeIn(1000, 90,197,208);
        this.cameras.main.setRoundPixels(true);
        this.burung = this.add.sprite(-100, 180, 'burung').setTint(0xec2049, 0xec2049, 0xf7db4f, 0x45ada8);

        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 608, 480);

        this.animatedTiles.init(this.lvl1);

        this.end = this.tweens.createTimeline();
        this.end.add({
            delay: 2000,
            targets: this.orang,
            y: 215,
            duration: 7000,
            onStart: () => {
                this.orang.play('jalan');
            },
            onComplete: () => {
                this.orang.anims.stop();
            }
        });

        this.end.add({
            delay: 500,
            targets: this.orang,
            x: 347,
            duration: 1000,
            onStart: () => {
                this.orang.play('jalan');
            },
            onComplete: () => {
                this.orang.anims.stop();
            }
        });
        this.end.add({
            delay: 500,
            targets: this.orang,
            x: 347,
            duration: 4000,
            onStart: () => {
                this.orang.play('ngampak');
            }
        });
        this.end.add({
            delay: 1000,
            targets: this.orang,
            x: 347,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 150, 20, {
                    wrapWidth: 400,
                })
                .start(this.dialog.ge.d01, 50);
            }
        });
        this.end.add({
            delay: 2000,
            targets: this.orang,
            x: 347,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 150, 20, {
                    wrapWidth: 400,
                })
                .start(this.dialog.ge.d02, 50);
            }
        });
        this.end.add({
            delay: 2000,
            targets: this.orang,
            x: 347,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 100, 20, {
                    wrapWidth: 400,
                })
                .start(this.dialog.ge.d03, 50);
            }
        });
        this.end.add({
            delay: 2000,
            targets: this.orang,
            x: 347,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 100, 20, {
                    wrapWidth: 400,
                })
                .start(this.dialog.ge.d04, 50);
            }
        });
        this.end.add({
            delay: 2000,
            targets: this.orang,
            x: 347,
            duration: 3000,
            onStart: () => {
                cTexBox2(this, 180, 20, {
                    wrapWidth: 400,
                })
                .start(this.dialog.ge.d05, 50);
            }
        });
        this.end.add({
            delay: 200,
            targets: this.burung,
            x: 610,
            duration: 3000,
            ease: 'Power1',
            onComplete: () => {
                this.burung.destroy();
                this.orang.anims.stop();
            }
        });
        this.end.add({
            delay: 2000,
            targets: this.orang,
            x: 347,
            duration: 7000,
            onStart: () => {
                cTexBox2(this, 200, 200, {
                    wrapWidth: 400,
                })
                .start(this.dialog.ge.d06, 200);
            }    
        });
        this.end.add({
            delay: 2000,
            targets: this.orang,
            x: 347,
            duration: 3000,
            onStart: () => {
                this.scene.start("menuScene");
            }
        });

        this.burung.play('terbang');
        this.end.play();
    }
}