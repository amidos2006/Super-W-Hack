/// <reference path="BaseGameState.ts"/>

class AdventureNameState extends BaseGameState{
    adventureName:AdventureName;
    constructor(){
        super();
    }
    
    create(){
        super.create();
        
        this.adventureName = new AdventureName(this.game, this.game.width/2, this.game.height/2, Global.levelName);
        this.add.existing(this.adventureName);
    }
    
    update(){
        super.update();
        
        if(this.input.keyboard.isDown(Phaser.Keyboard.X)){
            this.adventureName.fadeOut(-0.05);
            this.input.keyboard.reset();
        }
    }
}