/// <reference path="../BaseUIObject.ts"/>

class CreditsName extends BaseUIObject{
    textHeight:number;
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var credits:string[] = this.game.cache.getText("credits").split("\n");
        this.textHeight = 0;
        
        var style = { font: "10px pixelFont", fill: "#ffffff", align: "center" };
        var gameBy:Phaser.Text = this.game.add.text(x, y + this.textHeight, "game by", style, this);
        gameBy.anchor.set(0.5, 0);
        this.add(gameBy);
        this.textHeight += 10;
        
        style = { font: "20px pixelFont", fill: "#ffffff", align: "center" };
        var names:string[] = credits[0].split(",");
        for (var i = 0; i < names.length; i++) {
            var tempName:Phaser.Text = this.game.add.text(x, y + this.textHeight, names[i].toString(), style, this);
            this.textHeight += 18;
            tempName.anchor.set(0.5, 0);
            this.add(tempName);
        }
        this.textHeight += 18;
        
        style = { font: "10px pixelFont", fill: "#ffffff", align: "center" };
        var madeFor:Phaser.Text = this.game.add.text(x, y + this.textHeight, "made for", style, this);
        madeFor.anchor.set(0.5, 0);
        this.add(madeFor);
        this.textHeight += 10;
        
        style = { font: "20px pixelFont", fill: "#ffffff", align: "center" };
        var gameDesign:Phaser.Text = this.game.add.text(x, y + this.textHeight, credits[1].trim(), style, this);
        gameDesign.anchor.set(0.5, 0);
        this.add(madeFor);
        this.textHeight += 2 * 18;
        
        style = { font: "10px pixelFont", fill: "#ffffff", align: "center" };
        var thanksTo:Phaser.Text = this.game.add.text(x, y + this.textHeight, "thanks to", style, this);
        thanksTo.anchor.set(0.5, 0);
        this.add(thanksTo);
        this.textHeight += 10;
        
        style = { font: "20px pixelFont", fill: "#ffffff", align: "center" };
        var names:string[] = credits[2].split(",");
        for (var i = 0; i < names.length; i++) {
            var tempName:Phaser.Text = this.game.add.text(x, y + this.textHeight, names[i].toString(), style, this);
            this.textHeight += 18;
            tempName.anchor.set(0.5, 0);
            this.add(tempName);
        }
    }
}