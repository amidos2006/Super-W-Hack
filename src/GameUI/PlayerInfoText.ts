/// <reference path="../BaseUIObject.ts"/>

class PlayerInfoText extends BaseUIObject{
    heroSprite:Phaser.Sprite;
    playerName:FlyingText;
    playerDescription:Phaser.Text;
    playerSpecial:FlyingText;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        this.heroSprite = game.add.sprite(x, y - 70, "graphics");
        this.heroSprite.animations.add("3", [3]);
        this.heroSprite.animations.add("11", [11]);
        this.heroSprite.animations.add("10", [10]);
        this.heroSprite.scale.set(3, 3);
        this.heroSprite.anchor.set(0.5, 0.5);
        
        this.playerName = new FlyingText(game, x + 12, y + 20, "", 2, 15);
        this.playerName.selectText(true);
        var style = { font: "20px pixelFont", fill: "#aaaaaa", align: "center" };
        this.playerDescription = this.game.add.text(x, y + 20, "", style, this);
        this.playerDescription.wordWrap = true;
        this.playerDescription.wordWrapWidth = this.game.width - 40;
        this.playerSpecial = new FlyingText(game, x + 12, y + 120, "", 2, 15);
        this.playerSpecial.selectText(true);
        
        this.add(this.heroSprite);
        this.add(this.playerName);
        this.add(this.playerDescription);
        this.add(this.playerSpecial);
    }
    
    updateText(playerData:BasePlayerData){
        this.playerName.changeText(playerData.getPlayerName());
        this.heroSprite.animations.play(playerData.graphicsIndex.toString());
        
        this.playerDescription.text = playerData.getDescription();
        this.playerDescription.anchor.set(0.5, 0);
        
        this.playerSpecial.changeText(playerData.getSpecialText());
    }
    
    update(){
        super.update();
        
        this.playerName.update();
        this.playerSpecial.update();
    }
}