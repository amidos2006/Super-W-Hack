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
        
        var buttons:string = "(a)";
        if(!this.game.input.gamepad.pad1.connected){
            buttons = "(x)";
        }
        
        this.game.add.existing(new WhiteLayout(this.game, 10, 10, this.game.width - 20, this.game.height - 20));
        this.game.add.existing(new HintText(this.game, this.game.width/2, 
            this.game.height - 5, "(up/down) to choose\n" + buttons + " to select"));
    }
    
    update(){
        super.update();
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
            Global.constructSingleLevel(this.rnd, RoomTypeEnum.Boss);
            Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, this.rnd, null, Global.weaponNameGenerator, -1);
            this.game.state.start("gameplay");
            this.game.input.keyboard.reset();
        }
        
        if(Global.gameController.direction.y == -1){
            this.choices[this.index].changeText(this.unselectedValues[this.index]);
            this.choices[this.index].selectText(false);
            
            this.index -= 1;
            if(this.index < 0){
                this.index = this.selectedValues.length - 1;
            }
            
            this.choices[this.index].changeText(this.selectedValues[this.index]);
            this.choices[this.index].selectText(true);
            Global.audioManager.playMenuSelection();
        }
        if(Global.gameController.direction.y == 1){
            this.choices[this.index].changeText(this.unselectedValues[this.index]);
            this.choices[this.index].selectText(false);
            
            this.index = (this.index + 1) % this.selectedValues.length;
            
            this.choices[this.index].changeText(this.selectedValues[this.index]);
            this.choices[this.index].selectText(true);
            Global.audioManager.playMenuSelection();
        }
        if(Global.gameController.aButton == ButtonStates.Pressed){
            switch(this.index){
                case 0:
                Global.currentGameMode = GameplayModes.adventure;
                break;
                case 1:
                Global.currentGameMode = GameplayModes.arcade;
                break;
                case 3:
                this.game.state.start("credits", true);
                break;
                case 4:
                break;
            }
            if(this.index >= 0 && this.index<=1){
                this.game.state.start("playerselect", true);
            }
            Global.audioManager.playMenuSelected();
            this.game.input.keyboard.reset();
            this.game.input.gamepad.pad1.reset();
        }
    }
}