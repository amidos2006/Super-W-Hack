/// <reference path="BaseGameState.ts"/>

class CreditsState extends BaseGameState{
    constructor(){
        super();
    }
    
    create(){
        super.create();
        
        var creditsObj:CreditsName = new CreditsName(this.game, this.game.width/2, this.game.height/2 - 100);
        this.game.add.existing(creditsObj);
        
        this.game.add.existing(new WhiteLayout(this.game, 10, 10, this.game.width - 20, this.game.height - 20));
        this.add.existing(new HintText(this.game, this.game.width/2, this.game.height - 5, "(x/z) to go back"));
    }
    
    update(){
        super.update();
        
        if(this.input.keyboard.isDown(Phaser.Keyboard.X) || this.input.keyboard.isDown(Phaser.Keyboard.Z)){
            this.game.state.start("mainmenu", true);
            this.input.keyboard.reset();
        }
    }
}