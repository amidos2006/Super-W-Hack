/// <reference path="BaseGameState.ts"/>

class LoadingState extends BaseGameState{
    constructor(){
        super();
    }
    
    preload(){
        super.preload();
        
        this.game.load.spritesheet("graphics", "assets/graphics/gameGraphics.png", 32, 32);
        this.game.load.text("dungeonNames", "assets/data/dungeonNames.txt");
        this.game.load.text("playerdata", "assets/data/playerData.txt");
    }
    
    create(){
        super.create();
        
        this.game.state.start("mainmenu", true);
    }
}