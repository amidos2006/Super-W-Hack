/// <reference path="../BaseUIObject.ts"/>

class LevelName extends BaseUIObject{
    text:Phaser.Text;
    nameText:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var style = { font: "16px pixelFont", fill: "#ffffff", align: "center" };
        this.nameText = new Phaser.Text(this.game, x, y, Global.levelName, style);
        this.nameText.anchor.set(0.5, 0);
        this.add(this.nameText);
        
        style = { font: "14px pixelFont", fill: "#ffffff", align: "center" };
        this.text = new Phaser.Text(this.game, x, y + 14, "(" + (Global.levelNumber + 1).toString() + " / " + Global.MAX_DEPTH.toString()  + ")" , style);
        this.text.anchor.set(0.5, 0);
        this.add(this.text);
    }
}