/// <reference path="../BaseUIObject.ts"/>

class CrateText extends BaseUIObject{
    crateSprite:Phaser.Sprite;
    middleText:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        // this.crateSprite = this.game.add.sprite(x, y - 3, "graphics");
        // this.crateSprite.animations.add("normal", [13]);
        // this.crateSprite.animations.play("normal");
        // this.crateSprite.anchor.set(1, 0.5);
        // this.add(this.crateSprite);
        
        var style = { font: "14px pixelFont", fill: "#ffffff", align: "center" };
        var text:string = "crates: 0";
        if(Global.currentGameMode == GameplayModes.adventure){
            text = "score: " + Global.scoreNumber + " (x1)";
        }
        this.middleText = this.game.add.text(x, y, text, style, this);
        this.middleText.anchor.set(0.5, 0.5);
        this.add(this.middleText);
    }
    
    update(){
        super.update();
        
        this.middleText.text = "crates: " + Global.crateNumber.toString();
        if(Global.currentGameMode == GameplayModes.adventure){
            this.middleText.text = "score: " + Global.scoreNumber + " (x" + Global.scoreMultiplier + ")"
        }
    }
}