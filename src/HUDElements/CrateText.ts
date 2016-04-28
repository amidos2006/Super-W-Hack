/// <reference path="../BaseUIObject.ts"/>

class CrateText extends BaseUIObject{
    crateSprite:Phaser.Sprite;
    crateText:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        // this.crateSprite = this.game.add.sprite(x, y - 3, "graphics");
        // this.crateSprite.animations.add("normal", [13]);
        // this.crateSprite.animations.play("normal");
        // this.crateSprite.anchor.set(1, 0.5);
        // this.add(this.crateSprite);
        
        var style = { font: "14px pixelFont", fill: "#ffffff", align: "center" };
        this.crateText = this.game.add.text(x, y, "crates: 0", style, this);
        this.crateText.anchor.set(0.5, 0.5);
        this.add(this.crateText);
    }
    
    update(){
        super.update();
        
        this.crateText.text = "crates: " + Global.crateNumber.toString();
    }
}