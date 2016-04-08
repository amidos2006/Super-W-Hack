class PlayerInfoText extends BaseUIObject{
    playerName:Phaser.Text;
    playerDescription:Phaser.Text;
    playerSpecial:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "center" };
        this.playerName = this.game.add.text(x, y, "", style, this);
        style = { font: "20px pixelFont", fill: "#ffffff", align: "center" };
        this.playerDescription = this.game.add.text(x, y + 20, "", style, this);
        this.playerDescription.wordWrap = true;
        this.playerDescription.wordWrapWidth = this.game.width - 40;
        style = { font: "15px pixelFont", fill: "#ffffff", align: "center" };
        this.playerSpecial = this.game.add.text(x, y + 80, "", style, this);
        
        this.add(this.playerName);
        this.add(this.playerDescription);
        this.add(this.playerSpecial);
    }
    
    updateText(playerData:BasePlayerData){
        this.playerName.text = playerData.getPlayerName();
        this.playerName.anchor.set(0.5, 0);
        
        this.playerDescription.text = playerData.getDescription();
        this.playerDescription.anchor.set(0.5, 0);
        
        this.playerSpecial.text = playerData.getSpecialText();
        this.playerSpecial.anchor.set(0.5, 0);
    }
}