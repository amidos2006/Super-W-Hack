/// <reference path="BaseGameState.ts"/>

class LoadingState extends BaseGameState{
    constructor(){
        super();
    }
    
    preload(){
        super.preload();
        
        this.game.load.spritesheet("graphics", "assets/graphics/gameGraphics.png", 32, 32);
        this.game.load.text("dungeonNames_1", "assets/data/dungeonNames_1.txt");
        this.game.load.text("dungeonNames_2", "assets/data/dungeonNames_2.txt");
        this.game.load.text("dungeonNames_3", "assets/data/dungeonNames_3.txt");
        this.game.load.text("weaponAdjectives", "assets/data/weaponNamesAdj.txt");
        this.game.load.text("weaponNouns", "assets/data/weaponNamesNoun.txt");
        this.game.load.text("playerdata", "assets/data/playerData.txt");
        
        this.game.load.text("enemyNumbers", "assets/generationData/enemyNumberProb.txt");
        this.game.load.text("enemyTypes", "assets/generationData/enemyTypeProb.txt");
        this.game.load.text("enemyHealth", "assets/generationData/enemyHealthProb.txt");
        
        Global.audioManager = new AudioManager();
        Global.audioManager.preload(this.game);
    }
    
    create(){
        super.create();
        
        Global.weaponNameGenerator = new WeaponNameGenerator(this.game.cache.getText("weaponAdjectives"), 
            this.game.cache.getText("weaponNouns"));
        Global.audioManager.addSounds(this.game);
        
        Global.enemyNumbers = new EnemyNumbers(this.game);
        Global.enemyTypes = new EnemyTypes(this.game);
        
        this.game.state.start("mainmenu", true);
    }
}