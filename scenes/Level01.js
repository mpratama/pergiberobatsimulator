class Level01 extends Phaser.Scene {
    constructor() {
        super({
            key: 'level01'
        });
    }

    preload() {
        //plugin animated tiles
        this.load.scenePlugin({
            key: 'AnimatedTiles',
            url: 'AnimatedTiles.min.js',
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
        this.bpjscard = 0;
        //grup utk menyatukan 4 tombol kontrol
        this.panah = this.add.group();

        this.cameras.main.setRoundPixels(true);
        this.tringSound = this.sound.add('getItem');

        //tilemap dan pembagian layernya
        this.lvl1 = this.make.tilemap({key: 'lv01'});
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

        this.orang = this.physics.add.sprite(this.objek[0].x, this.objek[0].y, "char", 0);
        this.orang.body.setSize(10,15);
        this.physics.world.setBounds(0, 0, 800, 480);
        this.orang.body.collideWorldBounds = true;
        this.layer3 = this.lvl1.createStaticLayer("02", [this.tiles, this.tiles2], 0, 0);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);

        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 800, 480);
        this.kiri = this.add.sprite(50, 220, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.bawah = this.add.sprite(50, 300, 'kontrol', 2).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.atas = this.add.sprite(550, 220, 'kontrol', 3).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.kanan = this.add.sprite(550, 300, 'kontrol', 1).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.panah.addMultiple([this.kiri, this.bawah, this.atas, this.kanan]);

        // Tdk boleh lewat jalan atas
        this.zonaKampung = this.add.zone(325,0,120,30);
        this.physics.add.existing(this.zonaKampung);
        this.zonaKampung.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonaKampung, () => {
            this.orang.anims.stop();
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
            })
            .start(this.dialog.lv01.d03, 50);
        }, null, this);

        // plang kampung
        this.zonKp = this.add.zone(328, 90, 16, 16);
        this.physics.add.existing(this.zonKp);
        this.zonKp.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonKp, () => {
            this.orang.anims.stop();
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
            })
            .start(this.dialog.lv01.d02, 50);
        }, null, this);

        //plang puskes
        this.zonPKM = this.add.zone(152, 153, 16, 16);
        this.physics.add.existing(this.zonPKM);
        this.zonPKM.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonPKM, () => {
            this.orang.anims.stop();
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
            })
            .start(this.dialog.lv01.d04, 50);
        }, null, this);

        //getBPJScard
        this.zonBP = this.add.zone(456, 210, 16, 5);
        this.physics.add.existing(this.zonBP);
        this.zonBP.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonBP, () => {
            if(this.bpjscard == 0){
                this.tringSound.play();
                this.orang.anims.stop();
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
            })
            .start(this.dialog.lv01.d01, 50);
                this.bpjscard += 1;
            }            
        }, null, this);

        //goToNextLevel
        this.zonLv = this.add.zone(-5, 168, 16, 32);
        this.physics.add.existing(this.zonLv);
        this.zonLv.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonLv, () => {
            this.cameras.main.fadeOut(500);
            localStorage.setItem("currentLevel", "level02");
            localStorage.setItem("kartuBPJS", this.bpjscard);
            setTimeout(() => this.scene.start("level02"), 1000);
            game._BPJSCARD = this.bpjscard;
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

        this.animatedTiles.init(this.lvl1);
        
    }

    update() {
        
    }

}
