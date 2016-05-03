/// <reference path="BaseGameState.ts"/>

class AdventureNameState extends BaseGameState{
    adventureName:AdventureName;
    constructor(){
        super();
    }
    
    create(){
        super.create();
        
        var buttons:string = "(a/b)";
        if(!this.game.input.gamepad.pad1.connected){
            buttons = "(x/z)";
        }
        
        this.adventureName = new AdventureName(this.game, this.game.width/2, this.game.height/2, Global.levelName);
        this.add.existing(this.adventureName);
        
        this.game.add.existing(new WhiteLayout(this.game, 10, 10, this.game.width - 20, this.game.height - 20));
        this.add.existing(new HintText(this.game, this.game.width/2, this.game.height - 5, buttons + " to continue"));
    }
    
    update(){
        super.update();
        
        if(Global.gameController.aButton == ButtonStates.Pressed || 
            Global.gameController.bButton == ButtonStates.Pressed){
            this.adventureName.fadeOut(-0.05);
        }
    }
}