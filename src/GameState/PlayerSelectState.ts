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
        
        var text:string = this.game.cache.getText("playerdata");
        this.characters = [new AatPlayerData(text), new GatPlayerData(text), new TatPlayerData(text)];
        
        this.playerText = new PlayerInfoText(this.game, this.game.width/2, this.game.height/2);
        this.game.add.existing(this.playerText);
        this.playerText.updateText(this.characters[this.selectedIndex]);
        
        this.game.add.existing(new WhiteLayout(this.game, 10, 10, this.game.width - 20, this.game.height - 20));
        this.game.add.existing(new HintText(this.game, this.game.width/2, this.game.height - 5, 
            "(left/right) to choose\n(x) to select"));
    }
    
    update(){
        super.update();
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.selectedIndex -= 1;
            if(this.selectedIndex < 0){
                this.selectedIndex = this.characters.length - 1;
            }
            
            this.playerText.updateText(this.characters[this.selectedIndex]);
            Global.audioManager.playMenuSelection();
            this.game.input.keyboard.reset();
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.selectedIndex = (this.selectedIndex + 1) % this.characters.length;
            this.playerText.updateText(this.characters[this.selectedIndex]);
            Global.audioManager.playMenuSelection();
            this.game.input.keyboard.reset();
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.X)){
            Global.audioManager.stopTitleMusic();
            Global.initialize(this.game.cache.getText("dungeonNames_1"), 
                        this.game.cache.getText("dungeonNames_2"), 
                        this.game.cache.getText("dungeonNames_3"), this.game.rnd);
            Global.currentPlayer = this.characters[this.selectedIndex];
            if(Global.currentGameMode == GameplayModes.adventure){
                this.game.state.start("adventurename", true);
            }
            else{
                this.game.state.start("gameplay", true);
            }
            Global.audioManager.playMenuSelected();
            this.game.input.keyboard.reset();
        }
    }
}