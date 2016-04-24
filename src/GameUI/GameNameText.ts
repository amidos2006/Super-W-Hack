/// <reference path="../BaseUIObject.ts"/>

class GameNameText extends BaseUIObject{
    superHackText:Phaser.Text;
    wText:Phaser.Text;
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var style = { font: "120px pixelFont", fill: "#555555", align: "center" };
        this.wText = new Phaser.Text(game, x, y, "w", style);
        this.wText.anchor.set(0.5, 0.5);
        this.add(this.wText);
        
        style = { font: "40px pixelFont", fill: "#ffffff", align: "center" }
        this.superHackText = new Phaser.Text(game, x - 12, y, "super  hack!", style);
        this.superHackText.anchor.set(0.5, 0.5);
        this.add(this.superHackText);
    }
}