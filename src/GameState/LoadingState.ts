/// <reference path="BaseGameState.ts"/>

class LoadingState extends BaseGameState{
    constructor(){
        super();
    }
    
    preload(){
        super.preload();
        
        this.game.load.spritesheet("graphics", "assets/graphics/gameGraphics.png", 32, 32);
        this.game.load.text("dungeonNames", "assets/data/dungeonNames.txt");
    }
    
    create(){
        Global.initialize();
        Global.constructLevel(this.game.cache.getText("dungeonNames"), this.game.rnd);
        
        this.game.state.start("gameplay", true);
    }
}