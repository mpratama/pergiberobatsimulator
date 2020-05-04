class Level07 extends Phaser.Scene {
    constructor() {
        super({
            key: 'level07'
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
        //titik koordinat & size x y bound box utk ular collision
        this.coord = [
            [1100, 0, 180, 240],
            [1100, 240, 180, 240],
            [900, 0, 200, 100],
            [900, 80, 200, 100],
            [900, 160, 200, 100],
            [900, 240, 200, 100],
            [900, 320, 200, 100],
            [900, 400, 200, 100],
            [680, 0, 220, 160],
            [680, 160, 220, 160],
            [680, 320, 220, 160],
            [450, 0, 230, 100],
            [450, 90, 230, 100],
            [450, 180, 230, 100],
            [450, 270, 230, 100],
            [450, 360, 230, 100],
            [450, 450, 230, 100],
            [180, 0, 270, 160],
            [180, 160, 270, 160],
            [180, 320, 270, 160],
            [50, 0, 130, 100],
            [50, 80, 130, 100],
            [50, 160, 130, 100],
            [50, 240, 130, 100],
            [50, 320, 130, 100],
            [50, 400, 130, 100]
        ];

        this.cameras.main.fadeIn();
        //grup utk menyatukan 4 tombol kontrol
        this.panah = this.add.group();

        this.cameras.main.setRoundPixels(true);

        //tilemap dan pembagian layernya
        this.lvl1 = this.make.tilemap({key: 'lv07'});
        this.tiles = this.lvl1.addTilesetImage('landscape', 'landscapex');
        this.tiles2 = this.lvl1.addTilesetImage('roguelikeSheet_transparent', 'rogueLike');
        this.layer = this.lvl1.createDynamicLayer("00", [this.tiles, this.tiles2], 0, 0);

        //spawn 26 ular berdasarkan this.coord
        this.ular = [];
        for (var i=0; i<this.coord.length; i++){
            this.ular[i] = this.physics.add.sprite(this.coord[i][0] + 5, this.coord[i][1] + 5, 'ular', 0).setSize(7,12);
        }

        this.snakeGroup = this.add.group(this.ular);
        this.layer2 = this.lvl1.createDynamicLayer("01", [this.tiles, this.tiles2], 0, 0);
        this.objek = this.lvl1.getObjectLayer('objek_layer')['objects'];
        
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

        this.orang = this.physics.add.sprite(this.objek[0].x, this.objek[0].y, "char", 0).setTint(0x00FF00, 0x00FF00, 0xFFFFFF, 0xFFFFFF);
        
        this.orang.body.setSize(10,14);
        this.physics.world.setBounds(0, 0, 1280, 480);
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
        this.burung = this.add.sprite(1300, 240, 'burung').setTint(0xec2049, 0xec2049, 0xf7db4f, 0x45ada8);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);

        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 1280, 480);
        this.kiri = this.add.sprite(550, 300, 'kontrol', 0).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.bawah = this.add.sprite(550, 225, 'kontrol', 2).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.atas = this.add.sprite(50, 300, 'kontrol', 3).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.kanan = this.add.sprite(50, 220, 'kontrol', 1).setInteractive().setAlpha(0.5).setScrollFactor(0);
        this.panah.addMultiple([this.kiri, this.bawah, this.atas, this.kanan]);

        
        // pd masing2 ular: play anim, set bounce, set collide world bounds
        for (var i = 0; i < this.snakeGroup.getLength(); i++){
            this.snakeGroup.getChildren()[i].play('ular');
            this.snakeGroup.getChildren()[i].setBounce(0.9,0.9);
            this.snakeGroup.getChildren()[i].setCollideWorldBounds(true);
        }
        //this.physics.add.collider(this.snake, this.orang);        
        this.ulBox = [];
        for (var i=0; i<this.coord.length; i++){
            //this.bx[i] = this.add.rectangle(this.coord[i][0], this.coord[i][1], this.coord[i][2], this.coord[i][3]).setStrokeStyle(1,0x000000,1).setOrigin(0);
            this.ulBox[i] = new Phaser.Geom.Rectangle(this.coord[i][0], this.coord[i][1], this.coord[i][2], this.coord[i][3]);
        }

        //this.box = new Phaser.Geom.Rectangle(1100, 0, 180, 240);
        /* this.ular[0].body.setBoundsRectangle(this.ulBox[0]);
        this.ular[1].body.setBoundsRectangle(this.ulBox[1]); */

        for (var i=0; i<this.coord.length; i++){
            this.ular[i].body.setBoundsRectangle(this.ulBox[i]);
        }

        //goToNextLevel
        this.zonLv = this.add.zone(0, 0, 1, 480).setOrigin(0);
        this.physics.add.existing(this.zonLv);
        this.zonLv.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonLv, () => {
            this.cameras.main.fadeOut(500);
            localStorage.setItem("currentLevel", "level08");
            setTimeout(() => this.scene.start("level08"), 1000);
        }, null, this);

        this.kiri.on('pointerdown', () => {
            this.orang.setVelocityX(-45);
            this.orang.play('jalan');
        });

        this.kiri.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.bawah.on('pointerdown', () => {
            this.orang.setVelocityY(45);
            this.orang.play('jalan');
        });

        this.bawah.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.atas.on('pointerdown', () => {
            this.orang.setVelocityY(-45);
            this.orang.play('jalanAtas');
        });

        this.atas.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.kanan.on('pointerdown', () => {
            this.orang.setVelocityX(45);
            this.orang.play('jalan');
        });

        this.kanan.on('pointerup', () => {
            this.orang.setVelocity(0);
            this.orang.anims.stop();
        });

        this.burung.play('terbang');
        this.tweens.add({
            targets: this.burung,
            x: -10,
            ease: 'Power1',
            duration: 8000
        });

        this.kananAnim = this.tweens.createTimeline();
        this.kananAnim.add({
            delay: 8000,
            targets: this.kanan,
            y: 300,
            duration: 500,
            ease: 'Power1',
            yoyo: true,
            hold: 5000,
            repeat: -1,
            repeatDelay: 5000,
        });

        this.atasAnim = this.tweens.createTimeline();
        this.atasAnim.add({
            delay: 8000,
            targets: this.atas,
            y: 220,
            duration: 500,
            ease: 'Power1',
            yoyo: true,
            hold: 5000,
            repeat: -1,
            repeatDelay: 5000,
        });

        this.kiriAnim = this.tweens.createTimeline();
        this.kiriAnim.add({
            delay: 8000,
            targets: this.kiri,
            y: 225,
            duration: 600,
            ease: 'Power1',
            yoyo: true,
            hold: 5000,
            repeat: -1,
            repeatDelay: 5000,
        });

        this.bawahAnim = this.tweens.createTimeline();
        this.bawahAnim.add({
            delay: 8000,
            targets: this.bawah,
            y: 300,
            duration: 600,
            ease: 'Power1',
            yoyo: true,
            hold: 5000,
            repeat: -1,
            repeatDelay: 5000,
        });

        //get crazy with the controls
        this.atasAnim.play();
        this.bawahAnim.play();
        this.kananAnim.play();
        this.kiriAnim.play();

        this.animatedTiles.init(this.lvl1);

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
            this.panah.setVisible(false);
            this.kiriPencet = false;
            this.kananPencet = false;
            this.atasPencet = false;
            this.bawahPencet = false;
            this.orang.setVelocity(0);
            this.orang.play('mati');
            this.death.active = false;
            this.tetesan.stop();
            //localStorage.setItem("lv05-mark1", true);
            setTimeout(() => this.scene.start("level07"), 3000);
        }, null, this);
        
    }

    update() {
        
    }

}