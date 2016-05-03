/// <reference path="BaseGameState.ts"/>

class CreditsState extends BaseGameState{
    constructor(){
        super();
    }
    
    create(){
        super.create();
        
        var buttons:string = "(a/b)";
        if(!this.game.input.gamepad.pad1.connected){
            buttons = "(x/z)";
        }
        
        var creditsObj:CreditsName = new CreditsName(this.game, this.game.width/2 + 10, this.game.height);
        this.game.add.existing(creditsObj);
        
        this.game.add.existing(new WhiteLayout(this.game, 10, 10, this.game.width - 20, this.game.height - 20));
        this.add.existing(new HintText(this.game, this.game.width/2, this.game.height - 5, buttons + " to go back"));
    }
    
    update(){
        super.update();
        
        if(Global.gameController.aButton == ButtonStates.Pressed || 
            Global.gameController.bButton == ButtonStates.Pressed){
            this.game.state.start("mainmenu", true);
            this.input.keyboard.reset();
            this.input.gamepad.pad1.reset();
        }
    }
}