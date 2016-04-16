class MainMenuState extends BaseGameState{
    choices:FlyingText[];
    unselectedValues:string[];
    selectedValues:string[];
    index:number;
    
    constructor(){
        super();
        
        this.unselectedValues = ["the binding of isaac", "super crate box", "steamspy", "igf awards"];
        this.selectedValues = ["adventure mode", "arcade mode", "stats", "credits"];
    }
    
    create(){
        super.create();
        Global.audioManager.playTitleMusic();
        
        this.game.add.existing(new GameNameText(this.game, this.game.width/2 + 10, this.game.height/2 - 60));
        
        this.index = 0;
        this.choices = [];
        for (var i = 0; i < this.unselectedValues.length; i++) {
            var temp:FlyingText = new FlyingText(this.game, this.game.width/2, this.game.height/2 + 20 * i + 30, 
                this.unselectedValues[i], 2);
                this.choices.push(temp);
            this.game.add.existing(temp);
        }
        
        this.choices[this.index].changeText(this.selectedValues[this.index]);
        this.choices[this.index].selectText(true);
        
        this.game.add.existing(new HintText(this.game, this.game.width/2, this.game.height, "(up/down) to choose\n(x) to select"));
    }
    
    update(){
        super.update();
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            this.choices[this.index].changeText(this.unselectedValues[this.index]);
            this.choices[this.index].selectText(false);
            
            this.index -= 1;
            if(this.index < 0){
                this.index = this.selectedValues.length - 1;
            }
            
            this.choices[this.index].changeText(this.selectedValues[this.index]);
            this.choices[this.index].selectText(true);
            Global.audioManager.playMenuSelection();
            this.game.input.keyboard.reset();
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            this.choices[this.index].changeText(this.unselectedValues[this.index]);
            this.choices[this.index].selectText(false);
            
            this.index = (this.index + 1) % this.selectedValues.length;
            
            this.choices[this.index].changeText(this.selectedValues[this.index]);
            this.choices[this.index].selectText(true);
            Global.audioManager.playMenuSelection();
            this.game.input.keyboard.reset();
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.X)){
            switch(this.index){
                case 0:
                Global.currentGameMode = GameplayModes.adventure;
                break;
                case 1:
                Global.currentGameMode = GameplayModes.arcade;
                break;
                case 2:
                Global.currentGameMode = GameplayModes.endless;
                break;
                case 3:
                break;
                case 4:
                break;
                case 5:
                break;
            }
            if(this.index >= 0 && this.index<=0){
                this.game.state.start("playerselect", true);
            }
            Global.audioManager.playMenuSelected();
            this.game.input.keyboard.reset();
        }
    }
}