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

    completeLevelMusic: Phaser.Sound = null;
    
    static musics: Phaser.Sound[] = null;
    static isMusicPlaying: boolean[] = null;
    static musicTitle: Phaser.Sound = null;

    static AMOUNT_OF_MUSIC: number = 12;
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
        this.attacks = new Array(AudioManager.AMOUNT_OF_ATTACKS);

        //audio
        game.load.audio("powerup", "assets/audio/powerup2-low.mp3");
        game.load.audio("sbbuller", "assets/audio/Super Box/sndBullet.wav");
        game.load.audio("sbburn", "assets/audio/Super Box/sndBurn.wav");
        game.load.audio("sbdisc", "assets/audio/Super Box/sndDisc.wav");
        game.load.audio("sbexplode", "assets/audio/Super Box/sndExplode.wav");
        game.load.audio("sbflame", "assets/audio/Super Box/sndFlame.wav");
        game.load.audio("sbkatana", "assets/audio/Super Box/sndKatana.wav");
        game.load.audio("sblaserfire", "assets/audio/Super Box/sndLaserFire.wav");
        game.load.audio("sbminigun", "assets/audio/Super Box/sndMinigun.wav");
        game.load.audio("sbnapalm", "assets/audio/Super Box/sndNapalm.wav");
        game.load.audio("sbrevolver", "assets/audio/Super Box/sndRevolver.wav");
        game.load.audio("sbrocket", "assets/audio/Super Box/sndRocket.wav");
        game.load.audio("sbsar", "assets/audio/Super Box/sndSaw.wav");
        game.load.audio("sbshotgun", "assets/audio/Super Box/sndShotgun.wav");
        for (var i: number = 13; i < 19; i++) {
            game.load.audio("attack" + (i - 12), "assets/audio/Original/attack" + (i - 12) + ".wav");
        }

        this.hurt = new Array(AudioManager.AMOUNT_OF_HURT);
        for (var i: number = 0; i < AudioManager.AMOUNT_OF_HURT; i++) {
            game.load.audio("hurt" + (i + 1), "assets/audio/Original/hurt" + (i + 1) + ".wav");
        }

        game.load.audio("pickup", "assets/audio/Original/pickup1.wav");
        game.load.audio("menuselection", "assets/audio/Original/menuselection.wav");
        game.load.audio("menuselected", "assets/audio/Original/selected.wav");

        this.enemies = new Array(AudioManager.AMOUNT_OF_ENEMIES);
        for (var i: number = 0; i < AudioManager.AMOUNT_OF_ENEMIES; i++) {
            game.load.audio("enemy" + (i + 1), "assets/audio/Original/enemy" + (i + 1) + ".wav");
        }

        this.walk = new Array(AudioManager.AMOUNT_OF_WALK);
        for (var i: number = 0; i < AudioManager.AMOUNT_OF_WALK; i++) {
            game.load.audio("walk" + (i + 1), "assets/audio/Original/walk" + (i + 1) + ".wav");
        }

        this.specials = new Array(3);
        game.load.audio("special0", "assets/audio/Original/changeweapon.wav");
        game.load.audio("special1", "assets/audio/Original/attackeveryone.wav");
        game.load.audio("special2", "assets/audio/Original/teleport.wav");

        game.load.audio("pickNPC", "assets/audio/Original/pickperson.wav");

        //music
        game.load.audio("musicTitle", "assets/music/gameMusicTitle.mp3");

        game.load.audio("music1", "assets/music/sacrificial.mp3");
        game.load.audio("music2", "assets/music/Super Crate Box/LEV0.mp3");
        game.load.audio("music3", "assets/music/Super Crate Box/LEV1.mp3");
        game.load.audio("music4", "assets/music/Super Crate Box/LEV2.mp3");
        game.load.audio("music5", "assets/music/Super Crate Box/LEV3.mp3");
        game.load.audio("music6", "assets/music/gameMusic.mp3");
        game.load.audio("music7", "assets/music/gameMusic2.mp3");
        game.load.audio("music8", "assets/music/gameMusic3.mp3");
        game.load.audio("music9", "assets/music/Spelunky/mCave.mp3");
        game.load.audio("music10", "assets/music/Spelunky/mIce.mp3");
        game.load.audio("music11", "assets/music/Spelunky/mTemple.mp3");
        game.load.audio("music12", "assets/music/Spelunky/mLush.mp3");

        AudioManager.musics = new Array(AudioManager.AMOUNT_OF_MUSIC);
        AudioManager.isMusicPlaying = new Array(AudioManager.AMOUNT_OF_MUSIC);
        for (var i: number = 0; i < AudioManager.AMOUNT_OF_MUSIC; i++) 
            AudioManager.isMusicPlaying[i] = false;
        game.load.audio("musiccompletelvl", "assets/music/Spelunky/mVictory.mp3");
    }

    addSounds(game: Phaser.Game) {
        this.lastWalk = 0;

        //audio
        this.power_up = game.add.audio("powerup");
        this.attacks[0] = game.add.audio("sbbuller");
        this.attacks[1] = game.add.audio("sbburn");
        this.attacks[2] = game.add.audio("sbdisc");
        this.attacks[3] = game.add.audio("sbexplode");
        this.attacks[4] = game.add.audio("sbflame");
        this.attacks[5] = game.add.audio("sbkatana");
        this.attacks[6] = game.add.audio("sblaserfire");
        this.attacks[7] = game.add.audio("sbminigun");
        this.attacks[8] = game.add.audio("sbnapalm");
        this.attacks[9] = game.add.audio("sbrevolver");
        this.attacks[10] = game.add.audio("sbrocket");
        this.attacks[11] = game.add.audio("sbsar");
        this.attacks[12] = game.add.audio("sbshotgun");
        for (var i: number = 13; i < 19; i++) {
            this.attacks[i] = game.add.audio("attack" + (i - 12));
        }

        for (var i: number = 0; i < AudioManager.AMOUNT_OF_HURT; i++) {
            this.hurt[i] = game.add.audio("hurt" + (i + 1));
        }

        this.pickupCrate = game.add.audio("pickup");
        this.menuSelection = game.add.audio("menuselection");
        this.menuSelected = game.add.audio("menuselected");

        for (var i: number = 0; i < AudioManager.AMOUNT_OF_ENEMIES; i++) {
            this.enemies[i] = game.add.audio("enemy" + (i + 1));
        }

        for (var i: number = 0; i < AudioManager.AMOUNT_OF_WALK; i++) {
            this.walk[i] = game.add.audio("walk" + (i + 1));
        }

        this.specials[0] = game.add.audio("special0");
        this.specials[1] = game.add.audio("special1");
        this.specials[2] = game.add.audio("special2");

        this.pickNPC = game.add.audio("pickNPC");


        //music
        AudioManager.musicTitle = game.add.audio("musicTitle");
        AudioManager.musicTitle.loop = true;
        for (var i: number = 0; i < AudioManager.AMOUNT_OF_MUSIC; i++) {
            AudioManager.musics[i] = game.add.audio("music" + (i + 1));
            AudioManager.musics[i].loop = true;
        }

        this.pickNPC = game.add.audio("musiccompletelvl");
        
    }

    playPowerUp() {
        this.power_up.play();
    }

    /**
     * Play the game's title music.
     */
    playTitleMusic() {
        AudioManager.musicTitle.play();
    }

    stopTitleMusic() {
        AudioManager.musicTitle.stop();
    }

    /**
     * Play the selected music
     * @param id: id of the music in this.musics. 0 <= id < AudioManager.AMOUNT_OF_MUSIC
     */
    playMusic(id: number) {
        if (!AudioManager.musics[id].isPlaying)
            AudioManager.musics[id].play();
    }

    stopMusic() {
        for (var i: number = 0; i < AudioManager.musics.length; i++)
            if (AudioManager.musics[i].isPlaying)
                AudioManager.musics[i].stop();
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

    playFinishLevel() {
        this.completeLevelMusic.play();
    }

    stopFinishLevel() {
        this.completeLevelMusic.stop();
    }

    playSpecial(person: number) {
        this.specials[person].play();
    }

    playPickNPC() {
        this.pickNPC.play();
    }
}