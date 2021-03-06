class PlayerSelectState extends BaseGameState{
    characters:BasePlayerData[];
    selectedIndex:number;
    playerText:PlayerInfoText;
    
    constructor(){
        super();
    }
    
    create(){
        super.create();
        
        this.selectedIndex = 0;
        
        var aButton:string = "(a)";
        if(!this.game.input.gamepad.pad1.connected){
            aButton = "(x)";
        }
        
        var bButton:string = "(b)";
        if(!this.game.input.gamepad.pad1.connected){
            bButton = "(z)";
        }
        
        var text:string = this.game.cache.getText("playerdata");
        this.characters = [new AatPlayerData(text), new GatPlayerData(text), new TatPlayerData(text)];
        
        this.playerText = new PlayerInfoText(this.game, this.game.width/2, this.game.height/2);
        this.game.add.existing(this.playerText);
        this.playerText.updateText(this.characters[this.selectedIndex]);
        
        this.game.add.existing(new WhiteLayout(this.game, 10, 10, this.game.width - 20, this.game.height - 20));
        this.game.add.existing(new HintText(this.game, this.game.width/2, this.game.height - 5, 
            "(left/right) to choose\n" + aButton + " to select - " + bButton + " to go back"));
            
        var arrowSprite:Phaser.Sprite = this.game.add.sprite(this.game.width/2 + 80, this.game.height/2 - 100, "graphics");
        arrowSprite.animations.add("normal", [7]);
        arrowSprite.animations.play("normal");
        arrowSprite.scale.set(2, 2);
        arrowSprite.anchor.set(0.5, 0.5);
        
        arrowSprite = this.game.add.sprite(this.game.width/2 - 100, this.game.height/2 - 100, "graphics");
        arrowSprite.animations.add("normal", [7]);
        arrowSprite.animations.play("normal");
        arrowSprite.scale.set(-2, 2);
        arrowSprite.anchor.set(0.5, 0.5);
        
        Global.initialize(this.game.cache.getText("dungeonNames_1"), 
            this.game.cache.getText("dungeonNames_2"), 
            this.game.cache.getText("dungeonNames_3"), this.game.rnd);
    }
    
    update(){
        super.update();
        
        if(Global.gameController.direction.x == -1){
            this.selectedIndex -= 1;
            if(this.selectedIndex < 0){
                this.selectedIndex = this.characters.length - 1;
            }
            
            this.playerText.updateText(this.characters[this.selectedIndex]);
            Global.audioManager.playMenuSelection();
        }
        
        if(Global.gameController.direction.x == 1){
            this.selectedIndex = (this.selectedIndex + 1) % this.characters.length;
            this.playerText.updateText(this.characters[this.selectedIndex]);
            Global.audioManager.playMenuSelection();
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.P)){
            Global.levelNumber = (Global.levelNumber + 1) % 5;
            Global.constructLevel(this.game.rnd);
            Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, this.game.rnd, null, Global.weaponNameGenerator, -1);
            this.game.input.keyboard.reset();
        }
        
        if(Global.gameController.aButton == ButtonStates.Pressed){
            Global.audioManager.stopTitleMusic();
            Global.currentPlayer = this.characters[this.selectedIndex];
            if(Global.currentGameMode == GameplayModes.adventure){
                this.game.state.start("adventurename", true);
            }
            else{
                this.game.state.start("gameplay", true);
            }
            Global.audioManager.playMenuSelected();
        }
        
        if(Global.gameController.bButton == ButtonStates.Pressed){
            this.game.state.start("mainmenu");
        }
    }
}