class Level05 extends Phaser.Scene {
    constructor() {
        super({
            key: 'level05'
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
        this.mark1 = JSON.parse(localStorage.getItem("lv05-mark1"));
        this.mark2 = JSON.parse(localStorage.getItem("lv05-mark2"));
        this.mark3 = false;
        this.kiriPencet = false;
        this.bawahPencet = false;
        this.kananPencet = false;
        this.atasPencet = false;
        this.cameras.main.fadeIn();
        //grup utk menyatukan 4 tombol kontrol
        this.panah = this.add.group();

        this.cameras.main.setRoundPixels(true);
        this.tringSound = this.sound.add('getItem');

        //tilemap dan pembagian layernya
        this.lvl1 = this.make.tilemap({key: 'lv05'});
        this.tiles = this.lvl1.addTilesetImage('landscape', 'landscapex');
        this.tiles2 = this.lvl1.addTilesetImage('roguelikeSheet_transparent', 'rogueLike');
        this.layer = this.lvl1.createDynamicLayer("00", [this.tiles, this.tiles2], 0, 0);
        this.pari1 = this.physics.add.sprite(4377, 204, "pari", 0).setTint(0x000000).setAlpha(0.1).setSize(10,10);
        this.pari2 = this.physics.add.sprite(4127, 250, "pari", 0).setTint(0x000000).setAlpha(0.1).setSize(10,10);
        this.pari3 = this.physics.add.sprite(3984, 211, "pari", 0).setTint(0x000000).setAlpha(0.1).setSize(10,10);
        this.pari4 = this.physics.add.sprite(3650, 326, "pari", 0).setTint(0x000000).setAlpha(0.1).setSize(10,10);
        this.pari5 = this.physics.add.sprite(3298, 370, "pari", 0).setTint(0x000000).setAlpha(0.1).setSize(10,10);
        this.pari6 = this.physics.add.sprite(715, 335, "pari", 0).setTint(0x000000).setAlpha(0.1).setSize(10,10);
        this.pari7 = this.physics.add.sprite(1076, 2653, "pari", 0).setTint(0x000000).setAlpha(0.1).setSize(10,10);
        this.pariGroup = this.add.group([this.pari1, this.pari2, this.pari3, this.pari4, this.pari5, this.pari6, this.pari7]);
        this.layer2 = this.lvl1.createDynamicLayer("01", [this.tiles, this.tiles2], 0, 0);
        this.objek = this.lvl1.getObjectLayer('objek_layer')['objects'];
        
        //collision / bertumbuk layer
        this.layer2.setCollisionByProperty({collides: true});

        //animasi player mati
        this.animasiMati = this.anims.create({
            key: 'mati',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [13, 14]
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

        this.animasiJalanLaut = this.anims.create({
            key: 'jalanL',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [6, 7]
            }),
            frameRate: 5,
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

        this.animasiJalanAtasLaut = this.anims.create({
            key: 'jalanAtasL',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [8, 9]
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.animPari = this.anims.create({
            key: 'ikanPari',
            frames: this.anims.generateFrameNumbers('pari', {
                frames: [0,1,2,3]
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.terbang = this.anims.create({
            key: 'terbang',
            frames: this.anims.generateFrameNumbers('burung'),
            frameRate: 8,
            repeat: -1
        });

        this.orang = this.physics.add.sprite(this.objek[0].x, 152, "char", 0).setTint(0xffffff);
        this.orang.body.setSize(10,15);

        this.physics.world.setBounds(0, 0, 4800, 480);
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
        this.layer3 = this.lvl1.createStaticLayer("02", [this.tiles, this.tiles2], 0, 0);
        this.burung = this.add.sprite(4728, 117, 'burung').setTint(0xec2049, 0xec2049, 0xf7db4f, 0x45ada8);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);

        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 4800, 480);
        this.kiri = this.add.sprite(50, 220, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.bawah = this.add.sprite(50, 300, 'kontrol', 2).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.atas = this.add.sprite(550, 220, 'kontrol', 3).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.kanan = this.add.sprite(550, 300, 'kontrol', 1).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.panah.addMultiple([this.kiri, this.bawah, this.atas, this.kanan]);

        // pd masing2 ular: play anim, set bounce, set collide world bounds
        for (var i = 0; i < this.pariGroup.getLength(); i++){
            this.pariGroup.getChildren()[i].play('ikanPari');
            this.pariGroup.getChildren()[i].setBounce(0.9,0.9);
            this.pariGroup.getChildren()[i].setCollideWorldBounds(true);
        }

        //this.ulhbox1 = this.add.rectangle(4260, 70, 195, 184).setStrokeStyle(1,0x000000,1).setOrigin(0);
        this.ulbox1 = new Phaser.Geom.Rectangle(4260, 70, 195, 184);
        this.pari1.body.setBoundsRectangle(this.ulbox1);

        //this.ulhbox2 = this.add.rectangle(4027, 214, 298, 188).setStrokeStyle(1,0x000000,1).setOrigin(0);
        this.ulbox2 = new Phaser.Geom.Rectangle(4027, 214, 298, 188);
        this.pari2.body.setBoundsRectangle(this.ulbox2);

        //this.ulhbox3 = this.add.rectangle(3723, 82, 345, 332).setStrokeStyle(1,0x000000,1).setOrigin(0);
        this.ulbox3 = new Phaser.Geom.Rectangle(3723, 82, 345, 332);
        this.pari3.body.setBoundsRectangle(this.ulbox3);

        //this.ulhbox4 = this.add.rectangle(3406, 45, 287, 331).setStrokeStyle(1,0x000000,1).setOrigin(0);
        this.ulbox4 = new Phaser.Geom.Rectangle(3406, 45, 287, 331);
        this.pari4.body.setBoundsRectangle(this.ulbox4);

        //this.ulhbox5 = this.add.rectangle(3104, 71, 267, 353).setStrokeStyle(1,0x000000,1).setOrigin(0);
        this.ulbox5 = new Phaser.Geom.Rectangle(3104, 71, 267, 353);
        this.pari5.body.setBoundsRectangle(this.ulbox5);

        //this.ulhbox6 = this.add.rectangle(540, 98, 291, 304).setStrokeStyle(1,0x000000,1).setOrigin(0);
        this.ulbox6 = new Phaser.Geom.Rectangle(540, 98, 291, 304);
        this.pari6.body.setBoundsRectangle(this.ulbox6);

        //this.ulhbox7 = this.add.rectangle(840, 63, 299, 340).setStrokeStyle(1,0x000000,1).setOrigin(0);
        this.ulbox7 = new Phaser.Geom.Rectangle(840, 63, 299, 340);
        this.pari7.body.setBoundsRectangle(this.ulbox7);

        this.plang01 = this.add.zone(4695, 264, 15, 15);
        this.physics.add.existing(this.plang01);
        this.plang01.body.setImmovable();
        this.physics.add.collider(this.orang, this.plang01, () => {
            this.plang01.destroy();
            this.orang.anims.stop();
            this.orang.setVelocity(0);
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
                warna: COKLAT,
            })
            .start(this.dialog.lv05.d04, 50);
        }, null, this);

        this.plang02 = this.add.zone(137, 250, 15, 15);
        this.physics.add.existing(this.plang02);
        this.plang02.body.setImmovable();
        this.physics.add.collider(this.orang, this.plang02, () => {
            this.plang02.destroy();
            this.orang.anims.stop();
            this.orang.setVelocity(0);
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
                warna: COKLAT,
            })
            .start(this.dialog.lv05.d05, 50);
        }, null, this);

        //goToNextLevel
        this.zonLv = this.add.zone(0, 0, 1, 472).setOrigin(0);
        this.physics.add.existing(this.zonLv);
        this.zonLv.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonLv, () => {
            this.cameras.main.fadeOut(500);
            localStorage.setItem("currentLevel", "level06");
            setTimeout(() => this.scene.start("level06"), 1000);
        }, null, this);

        this.kiri.on('pointerdown', () => {
            this.kiriPencet = true;
        });

        this.kiri.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
            this.kiriPencet = false;
        });

        this.bawah.on('pointerdown', () => {
            this.bawahPencet = true;
        });

        this.bawah.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
            this.bawahPencet = false;
        });

        this.atas.on('pointerdown', () => {
            this.atasPencet = true;
        });

        this.atas.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
            this.atasPencet = false;
        });

        this.kanan.on('pointerdown', () => {
            this.kananPencet = true;
        });

        this.kanan.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
            this.kananPencet = false;
        });

        this.burung.play('terbang');
        this.manukIdle = this.tweens.add({
            targets: this.burung,
            y: this.burung.y + 3,
            yoyo: true,
            ease: 'Power1',
            repeat: -1,
            duration: 500
        });

        this.cutScn1 = this.tweens.createTimeline();
        this.cutScn1.add({
            delay: 1000,
            targets: this.burung,
            x: 1603,
            y: 238,
            onStart: () => {
                this.manukIdle.pause();
                this.burung.y = 238;
            },
            duration: 3000,
            ease: 'Power1',
        });
        this.cutScn1.add({
            targets: this.burung,
            x: 1603,
            y: 238,
            onStart: () => {
                createTextBox(this, 10, 10, {
                    wrapWidth: 550,
                    warna: YELLOW,
                })
                .start(this.dialog.lv05.d03, 50);
            },
            duration: 3000,
            ease: 'Power1',
        });
        this.cutScn1.add({
            delay: 8000,
            targets: this.burung,
            x: -10,
            onComplete: () => {
                this.burung.destroy();
            },
            duration: 8000,
            ease: 'Power1',
        });

        // menjalankan anim & delay tiap pari
        for (var i = 0; i < this.pariGroup.getLength(); i++){
            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: getPariSpd,
                args: [this.pariGroup.getChildren()[i]],
                callbackScope: this,
            });
        }

        this.death = this.physics.add.overlap(this.orang, this.pariGroup, () => {
            this.cameras.main.flash(700, 255, 0, 0);
            this.panah.setVisible(false);
            this.kiriPencet = false;
            this.kananPencet = false;
            this.atasPencet = false;
            this.bawahPencet = false;
            this.orang.setVelocity(0);
            this.orang.play('mati');
            this.death.active = false;
            this.tetesan.stop();
            localStorage.setItem("lv05-mark1", true);
            setTimeout(() => this.scene.start("level05"), 3000);
        }, null, this);

        this.animatedTiles.init(this.lvl1);
        
    }

    update() {
        //tombol kiri
        if (this.kiriPencet){
            if (this.orang.x < 4500 && this.orang.x > 330){
                this.orang.setVelocityX(-40);
                this.orang.play('jalanL', true);
            }
            else{
                this.orang.setVelocityX(-60);
                this.orang.play('jalan', true);
            }
        }

        //tombol kanan
        if (this.kananPencet){
            if (this.orang.x < 4500 && this.orang.x > 330){
                this.orang.setVelocityX(40);
                this.orang.play('jalanL', true);
            }
            else{
                this.orang.setVelocityX(60);
                this.orang.play('jalan', true);
            }
        }

        //tombol atas
        if (this.atasPencet){
            if (this.orang.x < 4500 && this.orang.x > 330){
                this.orang.setVelocityY(-40);
                this.orang.play('jalanAtasL', true);
            }
            else{
                this.orang.setVelocityY(-60);
                this.orang.play('jalanAtas', true);
            }
        }

        //tombol bawah
        if (this.bawahPencet){
            if (this.orang.x < 4500 && this.orang.x > 330){
                this.orang.setVelocityY(40);
                this.orang.play('jalanL', true);
            }
            else{
                this.orang.setVelocityY(60);
                this.orang.play('jalan', true);
            }
        }

        if (this.mark1 == false && this.orang.x < 4773){
            this.mark1 = true;
            localStorage.setItem("lv05-mark1", true);
            this.orang.setVelocity(0);
            this.kiriPencet = false;
            this.kananPencet = false;
            this.atasPencet = false;
            this.bawahPencet = false;
            this.orang.anims.stop();
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
                warna: YELLOW,
            })
            .start(this.dialog.lv05.d01, 50);
        }

        if (this.mark2 == false && this.orang.x < 4543){
            this.mark2 = true;
            localStorage.setItem("lv05-mark2", true);
            this.orang.setVelocity(0);
            this.kiriPencet = false;
            this.kananPencet = false;
            this.atasPencet = false;
            this.bawahPencet = false;
            this.orang.anims.stop();
            this.panah.setVisible(false);
            createTextBox(this, 10, 10, {
                wrapWidth: 550,
                warna: YELLOW,
            })
            .start(this.dialog.lv05.d02, 50); //x: 4473, y:234
        }

        if (this.mark3 == false && this.orang.x < 1609){
            this.mark3 = true;
            this.panah.setVisible(false);
            this.orang.setVelocity(0);
            this.kiriPencet = false;
            this.kananPencet = false;
            this.atasPencet = false;
            this.bawahPencet = false;
            this.orang.anims.stop();            
            this.cutScn1.play();
        }


        
    }

}
