/// <reference path="../BaseUIObject.ts"/>

class HintText extends BaseUIObject{
    constructor(game:Phaser.Game, x:number, y:number, text:string){
        super(game);
        
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "center" };
        var hintText:Phaser.Text = this.game.add.text(x, y, text, style);
        hintText.anchor.set(0.5, 1);
        this.add(hintText);
    }
}