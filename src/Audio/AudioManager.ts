class AudioManager {
    power_up: Phaser.Sound = null;
    enemieSounds: Phaser.Sound[] = null;
    musics: Phaser.Sound[] = null;
    musicTitle: Phaser.Sound = null;

    static AMOUNT_OF_MUSIC: number = 5;

    preload(game : Phaser.Game) {
        game.load.audio("powerup", "assets/audio/powerup2-low.mp3");
        this.power_up = game.add.audio("powerup");

        
        game.load.audio("musicTitle", "assets/music/gameMusicTitle.mp3");
        this.musicTitle = game.add.audio("powerup");

        game.load.audio("music1", "assets/music/sacrificial.mp3");
        game.load.audio("music2", "assets/music/Super Crate Box/LEV0.mp3");
        game.load.audio("music3", "assets/music/Super Crate Box/LEV1.mp3");
        game.load.audio("music4", "assets/music/Super Crate Box/LEV2.mp3");
        game.load.audio("music5", "assets/music/Super Crate Box/LEV3.mp3");

        this.musics = new Array(AudioManager.AMOUNT_OF_MUSIC);
        for (var i: number = 0; i < AudioManager.AMOUNT_OF_MUSIC; i++) 
            this.musics[i] = game.add.audio("music"+(i+1));
    }

    play_power_up() {
        this.power_up.play();
    }

    play_title_music() {
        this.musicTitle.play();
    }

    stop_title_music() {
        this.musicTitle.stop();
    }

    play_music(id: number) {
        this.musics[id].play();
    }

    stop_music(id: number) {
        if (this.musics[id].isPlaying)
            this.musics[id].stop();
    }
}