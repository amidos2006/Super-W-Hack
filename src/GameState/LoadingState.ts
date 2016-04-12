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
        this.game.load.text("playerdata", "assets/data/playerData.txt");
    }
    
    create(){
        super.create();
        
        this.game.state.start("mainmenu", true);
    }
}