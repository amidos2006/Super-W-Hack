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
        Global.initialize(this.game.cache.getText("dungeonNames"), this.game.rnd);
        Global.constructLevel(this.game.rnd);
        
        this.game.state.start("gameplay", true);
    }
}