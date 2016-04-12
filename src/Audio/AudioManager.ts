class AudioManager {
    power_up: Phaser.Sound = null;
    enemies: Phaser.Sound[] = null;
    attacks: Phaser.Sound[] = null;
    hurt: Phaser.Sound[] = null;
    menuSelection: Phaser.Sound = null;
    menuSelected: Phaser.Sound = null;
    pickupCrate: Phaser.Sound = null;
    walk: Phaser.Sound[] = null;
    specials: Phaser.Sound[] = null;
    pickNPC: Phaser.Sound = null;

    musics: Phaser.Sound[] = null;
    musicTitle: Phaser.Sound = null;
    completeLevelMusic: Phaser.Sound = null;

    static AMOUNT_OF_MUSIC: number = 5;
    static AMOUNT_OF_ATTACKS: number = 19;
    static AMOUNT_OF_HURT: number = 3;
    static AMOUNT_OF_WALK: number = 5;
    static AMOUNT_OF_ENEMIES: number = 8;
    static AMOUNT_OF_SPECIALS: number = 3;

    static SPECIAL_AAT: number = 0;
    static SPECIAL_GAT: number = 1;
    static SPECIAL_TAT: number = 2;

    lastWalk: number = 0;

    preload(game: Phaser.Game) {
        this.lastWalk = 0;

        //audio
        game.load.audio("powerup", "assets/audio/powerup2-low.mp3");
        this.power_up = game.add.audio("powerup");
        this.attacks = new Array(AudioManager.AMOUNT_OF_ATTACKS);
        game.load.audio("sbbuller", "assets/audio/Super Box/sndBullet.wav");
        this.attacks[0] = game.add.audio("sbbuller");
        game.load.audio("sbburn", "assets/audio/Super Box/sndBurn.wav");
        this.attacks[1] = game.add.audio("sbburn");
        game.load.audio("sbdisc", "assets/audio/Super Box/sndDisc.wav");
        this.attacks[2] = game.add.audio("sbdisc");
        game.load.audio("sbexplode", "assets/audio/Super Box/sndExplode.wav");
        this.attacks[3] = game.add.audio("sbexplode");
        game.load.audio("sbflame", "assets/audio/Super Box/sndFlame.wav");
        this.attacks[4] = game.add.audio("sbflame");
        game.load.audio("sbkatana", "assets/audio/Super Box/sndKatana.wav");
        this.attacks[5] = game.add.audio("sbkatana");
        game.load.audio("sblaserfire", "assets/audio/Super Box/sndLaserFire.wav");
        this.attacks[6] = game.add.audio("sblaserfire");
        game.load.audio("sbminigun", "assets/audio/Super Box/sndMinigun.wav");
        this.attacks[7] = game.add.audio("sbminigun");
        game.load.audio("sbnapalm", "assets/audio/Super Box/sndNapalm.wav");
        this.attacks[8] = game.add.audio("sbnapalm");
        game.load.audio("sbrevolver", "assets/audio/Super Box/sndRevolver.wav");
        this.attacks[9] = game.add.audio("sbrevolver");
        game.load.audio("sbrocket", "assets/audio/Super Box/sndRocket.wav");
        this.attacks[10] = game.add.audio("sbrocket");
        game.load.audio("sbsar", "assets/audio/Super Box/sndSar.wav");
        this.attacks[11] = game.add.audio("sbsar");
        game.load.audio("sbshotgun", "assets/audio/Super Box/sndShotgun.wav");
        this.attacks[12] = game.add.audio("sbshotgun");
        for (var i: number = 13; i < 19; i++) {
            game.load.audio("attack" + (i - 12), "assets/audio/Original/attack"+(i-12)+".wav");
            this.attacks[i] = game.add.audio("attack" + (i - 12));
        }

        this.hurt = new Array(AudioManager.AMOUNT_OF_HURT);
        for (var i: number = 0; i < AudioManager.AMOUNT_OF_HURT; i++) {
            game.load.audio("hurt" + (i + 1), "assets/audio/Original/hurt" + (i + 1) + ".wav");
            this.hurt[i] = game.add.audio("hurt" + (i + 1));
        }

        game.load.audio("pickup", "assets/audio/Original/pickup1.wav");
        this.pickupCrate = game.add.audio("pickup");
        game.load.audio("menuselection", "assets/audio/Original/menuselection.wav");
        this.menuSelection = game.add.audio("menuselection");
        game.load.audio("menuselected", "assets/audio/Original/selected.wav");
        this.menuSelected = game.add.audio("menuselected");

        this.enemies = new Array(AudioManager.AMOUNT_OF_ENEMIES);
        for (var i: number = 0; i < AudioManager.AMOUNT_OF_ENEMIES; i++) {
            game.load.audio("enemy" + (i + 1), "assets/audio/Original/enemy" + (i + 1) + ".wav");
            this.enemies[i] = game.add.audio("enemy" + (i + 1));
        }

        this.walk = new Array(AudioManager.AMOUNT_OF_WALK);
        for (var i: number = 0; i < AudioManager.AMOUNT_OF_WALK; i++) {
            game.load.audio("walk" + (i + 1), "assets/audio/Original/walk" + (i + 1) + ".wav");
            this.walk[i] = game.add.audio("walk" + (i + 1));
        }

        this.specials = new Array(3);
        game.load.audio("special0", "assets/audio/Original/changeweapon.wav");
        this.walk[0] = game.add.audio("special0");
        game.load.audio("special1", "assets/audio/Original/attackeveryone.wav");
        this.walk[1] = game.add.audio("special1");
        game.load.audio("special2", "assets/audio/Original/teleport.wav");
        this.walk[2] = game.add.audio("special2");

        game.load.audio("pickNPC", "assets/audio/Original/pickperson.wav");
        this.pickNPC = game.add.audio("pickNPC");
        

        //music
        game.load.audio("musicTitle", "assets/music/gameMusicTitle.mp3");
        this.musicTitle = game.add.audio("powerup");
        
        game.load.audio("music1", "assets/music/sacrificial.mp3");
        game.load.audio("music2", "assets/music/Super Crate Box/LEV0.mp3");
        game.load.audio("music3", "assets/music/Super Crate Box/LEV1.mp3");
        game.load.audio("music4", "assets/music/Super Crate Box/LEV2.mp3");
        game.load.audio("music5", "assets/music/Super Crate Box/LEV3.mp3");

        this.musics = new Array(AudioManager.AMOUNT_OF_MUSIC);
        for (var i: number = 0; i < AudioManager.AMOUNT_OF_MUSIC; i++) 
            this.musics[i] = game.add.audio("music" + (i + 1));

        game.load.audio("musiccompletelvl", "assets/music/Spelunky/mVictory.mp3");
        this.pickNPC = game.add.audio("musiccompletelvl");
    }

    playPowerUp() {
        this.power_up.play();
    }

    /**
     * Play the game's title music.
     */
    playTitleMusic() {
        this.musicTitle.play();
    }

    stopTitleMusic() {
        this.musicTitle.stop();
    }

    /**
     * Play the selected music
     * @param id: id of the music in this.musics. 0 <= id < AudioManager.AMOUNT_OF_MUSIC
     */
    playMusic(id: number) {
        this.musics[id].play();
    }

    stopMusic(id: number) {
        if (this.musics[id].isPlaying)
            this.musics[id].stop();
    }

    playMenuSelection() {
        this.menuSelection.play();
    }

    playMenuSelected() {
        this.menuSelected.play();
    }

    playTakeDamage(random: Phaser.RandomDataGenerator) {
        this.hurt[random.between(0, this.hurt.length - 1)].play();
    }

    playAttack(id: number) {
        this.attacks[id].play();
    }

    playWalk() {
        this.walk[this.lastWalk].play();
        this.lastWalk++;
        if (this.lastWalk >= AudioManager.AMOUNT_OF_WALK)
            this.lastWalk = 0;
    }

    playPickUpCrate() {
        this.pickupCrate.play();
    }

    playEnemyDead(random: Phaser.RandomDataGenerator) {
        this.enemies[random.between(0, this.enemies.length - 1)].play();
    }

}