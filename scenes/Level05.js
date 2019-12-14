class Level05 extends Phaser.Scene {
    constructor() {
        super({
            key: 'level05'
        });
    }

    preload() {
        //load tileset 01
        //this.load.image('landscapex', 'assets/landscape.png');

        //load tileset 02
        //this.load.image('rogueLike', 'assets/roguelikeSheet_transparent.png');

        //load data tilemapnya
        //this.load.tilemapTiledJSON('peta', 'assets/peta.json');

        //load spritesheet utk 4 tombol kontrol panah
        //this.load.spritesheet('kontrol', 'assets/control.png', {frameHeight: 50, frameWidth: 50})

        //player spritesheet
        //this.load.spritesheet('char', 'assets/charx.png', {frameHeight: 16, frameWidth:16});

        //plugin animated tiles
        this.load.scenePlugin({
            key: 'AnimatedTiles',
            url: 'AnimatedTiles.min.js',
            systemKey: 'animatedTiles',
            sceneKey: 'animatedTiles'
        });
    }
    
    create() {
        this.kiriPencet = false;
        this.bawahPencet = false;
        this.kananPencet = false;
        this.atasPencet = false;
        /* this.bloodFunc = setInterval(() => {
            console.log("kuontoks");
        }, 2000); */
        /* setInterval(() => {
            console.log("interval berjalan");
        }, 2000); */
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

        this.orang = this.physics.add.sprite(this.objek[0].x, this.objek[0].y, "char", 0).setTint(0xffffff);
        this.orang.body.setSize(10,15);
        this.physics.world.setBounds(0, 0, 4800, 480);
        this.orang.body.collideWorldBounds = true;
        this.layer3 = this.lvl1.createStaticLayer("02", [this.tiles, this.tiles2], 0, 0);
        this.kotak = this.add.graphics().fillStyle(0x000000, 1).fillRect(10, 5, 588, 80).setScrollFactor(0).setVisible(false);
        this.dialogBox = this.add.bitmapText(20, 10,"gem", "", 17).setScrollFactor(0);
        this.physics.add.collider(this.orang, this.layer2, null, null, this);

        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 4800, 480);
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
            nextLine(this, this.blokJalan , 70, RED);
        }, null, this);

        // plang kampung
        this.zonKp = this.add.zone(328, 90, 16, 16);
        this.physics.add.existing(this.zonKp);
        this.zonKp.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonKp, () => {
            //setTimeout(nextLine, 2000, this, this.plangDesa)
            nextLine(this, this.plangDesa);
        }, null, this);

        //plang puskes
        this.zonPKM = this.add.zone(152, 153, 16, 16);
        this.physics.add.existing(this.zonPKM);
        this.zonPKM.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonPKM, () => {
            nextLine(this, this.plangPKM, 50, GREEN);
        }, null, this);

        //getBPJScard
        this.zonBP = this.add.zone(456, 210, 16, 5);
        this.physics.add.existing(this.zonBP);
        this.zonBP.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonBP, () => {
            if(this.bpjscard == 0){
                this.tringSound.play();
                nextLine(this, this.bpjsDialog, 50, BLUE);
                localStorage.setItem("kartuBPJS", 1);
                this.bpjscard += 1;
            }            
        }, null, this);

        //goToNextLevel
        this.zonLv = this.add.zone(-5, 168, 16, 32);
        this.physics.add.existing(this.zonLv);
        this.zonLv.body.setImmovable();
        this.physics.add.collider(this.orang, this.zonLv, () => {
            this.cameras.main.fadeOut(500);
            console.log("ke level berikutnya");
            //setTimeout(() => this.scene.start("level02"), 1000);
            //this.scene.start("level02");
            //game._BPJSCARD = this.bpjscard;
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


        
    }

}
