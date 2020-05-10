class Level10bb extends Phaser.Scene {
    constructor() {
        super({
            key: 'lv10bb'
        });
    }

    create () {
        this.cameras.main.fadeIn();

        this.nurseAnim1 = this.anims.create({
            key: 'nursehecting',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [18, 19]
            }),
            frameRate: 4,
            repeat: -1,
        });

        this.aptAnims1 = this.anims.create({
            key: 'aptjalan',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [21, 22]
            }),
            frameRate: 6,
            repeat: -1,
        });

        this.aptAnims2 = this.anims.create({
            key: 'aptkerja',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [23, 24]
            }),
            frameRate: 4,
            repeat: -1,
        });

        this.aptAnims3 = this.anims.create({
            key: 'aptjalanatas',
            frames: this.anims.generateFrameNumbers('char', {
                frames: [25, 26]
            }),
            frameRate: 4,
            repeat: -1,
        });

        this.lvl1 = this.make.tilemap({key: 'gdsc'});
        this.tiles = this.lvl1.addTilesetImage('landscape', 'landscapex');
        this.tiles2 = this.lvl1.addTilesetImage('roguelikeSheet_transparent', 'rogueLike');
        this.layer = this.lvl1.createStaticLayer("00", [this.tiles, this.tiles2], 0, 0);
        this.layer2 = this.lvl1.createStaticLayer("01", [this.tiles, this.tiles2], 0, 0);
        this.objek = this.lvl1.getObjectLayer('objek_layer')['objects'];

        this.nurse = this.add.sprite(349, 278, "char", 15);
        this.apt = this.add.sprite(290, 280, "char", 20);
        this.orang = this.add.sprite(344, 281, "char", 8);
        this.cameras.main.startFollow(this.orang, true, 0.09, 0.09);
        this.cameras.main.setBounds(0, 0, 640, 480);
        this.nurse.play('nursehecting');

        this.aptCutScn = this.tweens.createTimeline();
        this.aptCutScn.add({
            targets: this.apt,
            x: 312,
            duration: 2000,
            onStart: () => {
                this.apt.play('aptjalan');
            },
            onComplete: () => {
                this.apt.anims.stop();
            }
        });
        this.aptCutScn.add({
            delay: 500,
            targets: this.apt,
            y: 252,
            duration: 3000,
            onStart: () => {
                this.apt.play('aptjalanatas');
            },
            onComplete: () => {
                this.apt.anims.stop();
            }
        });
        this.aptCutScn.add({
            targets: this.apt,
            y: 252,
            duration: 1000,
            repeat: -1,
            onStart: () => {
                this.apt.play('aptkerja');
            }
        });
        this.aptCutScn.play();

        setTimeout(() => {
            console.log("ctscene selesai");
            this.cameras.main.fadeOut(3000, 90, 197, 208);
        }, 20000);
    }
}