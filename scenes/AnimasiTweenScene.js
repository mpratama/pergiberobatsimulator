class AnimasiTweenScene extends Phaser.Scene {
    constructor() {
        super("animTweenCoba");
    }

    preload() {
        this.load.spritesheet('mumi', 'assets/mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
    }

    create() {
        var mummyAnimation = this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('mumi'),
        frameRate: 12,
        repeat: -1
        });
        
        var sprite = this.add.sprite(50, 300, 'mumi').setScale(3);
        sprite.play('walk');
        
        var eventJalan = this.tweens.createTimeline();

        eventJalan.add({
            targets: sprite,
            x: 200,
            ease: 'Power2',
            duration: 3000
        });

        eventJalan.add({
            targets: sprite,
            y: 200,
            ease: 'Power1',
            duration: 1000
        });

        eventJalan.add({
            targets: sprite,
            x: 500,
            ease: 'Power1',
            duration: 1000
        });

        eventJalan.play();

        this.add.text(20, 20, "Play game...");
    }
}
