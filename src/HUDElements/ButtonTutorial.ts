/// <reference path="../BaseUIObject.ts"/>

class ButtonTutorial extends BaseUIObject{
    xText:Phaser.Text;
    zText:Phaser.Text;
    
    aButton:string;
    bButton:string;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        this.aButton = "(a)";
        if(!this.game.input.gamepad.pad1.connected){
            this.aButton = "(x)";
        }
        
        this.bButton = "(b)";
        if(!this.game.input.gamepad.pad1.connected){
            this.bButton = "(z)";
        }
        
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "left" };
        this.xText = this.game.add.text(x + 2, y, this.bButton + " special [" + Global.getCurrentCost() + "]", style, this);
        this.xText.anchor.set(0, 1);
        this.add(this.xText);
        
        style = { font: "15px pixelFont", fill: "#ffffff", align: "right" };
        this.zText = this.game.add.text(this.game.width - x, y, "aim " + this.aButton, style, this);
        this.zText.anchor.set(1, 1);
        this.add(this.zText);
    }
    
    aimMode(){
        this.xText.text = this.bButton + " cancel";
        this.xText.anchor.set(0, 1);
        
        this.zText.text = "shoot " + this.aButton;
        this.zText.anchor.set(1, 1);
    }
    
    normalMode(){
        this.xText.text = this.bButton + " special [" + Global.getCurrentCost() + "]";
        this.xText.anchor.set(0, 1);
        
        this.zText.text = "aim " + this.aButton;
        this.zText.anchor.set(1, 1);
    }
}