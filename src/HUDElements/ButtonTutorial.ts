/// <reference path="../BaseUIObject.ts"/>

class ButtonTutorial extends BaseUIObject{
    xText:Phaser.Text;
    zText:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "left" };
        
        this.xText = this.game.add.text(x + 2, y, "(a) aim", style, this);
        this.xText.anchor.set(0, 1);
        this.add(this.xText);
        
        style = { font: "15px pixelFont", fill: "#ffffff", align: "right" };
        
        this.zText = this.game.add.text(this.game.width - x, y, "[" + Global.getCurrentCost() + "] special (b)", style, this);
        this.zText.anchor.set(1, 1);
        this.add(this.zText);
    }
    
    aimMode(){
        this.xText.text = "(a) shoot";
        this.xText.anchor.set(0, 1);
        
        this.zText.text = "cancel (b)";
        this.zText.anchor.set(1, 1);
    }
    
    normalMode(){
        this.xText.text = "(a) aim";
        this.xText.anchor.set(0, 1);
        
        this.zText.text = "[" + Global.getCurrentCost() + "] special (b)";
        this.zText.anchor.set(1, 1);
    }
}