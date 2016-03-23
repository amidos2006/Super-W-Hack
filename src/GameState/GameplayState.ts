class GameplayState extends BaseGameState{
    constructor(){
        super();
    }
    
    create(){
        super.create();
        
        Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
    }
}